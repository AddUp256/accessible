use std::fs;
use std::io::Write;
use std::path::{Path, PathBuf};
use std::process::{Command, Stdio};
use std::sync::atomic::{AtomicU64, Ordering};
use std::time::{SystemTime, UNIX_EPOCH};

use serde::Deserialize;
use serde::Serialize;

#[cfg(windows)]
use std::os::windows::process::CommandExt;

#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct SpellingIssueDto {
    pub kind: String,
    pub message: String,
    pub offset: usize,
    pub length: usize,
    pub suggestion: Option<String>,
}

#[derive(Deserialize)]
struct GrammalecteTop {
    #[serde(default)]
    data: Vec<serde_json::Value>,
}

#[derive(Deserialize)]
struct ParagraphErrors {
    #[serde(default, rename = "lGrammarErrors")]
    grammar_errors: Vec<GrammalecteError>,
}

#[derive(Deserialize)]
struct GrammalecteError {
    #[serde(rename = "sMessage")]
    message: String,
    #[serde(rename = "sUnderlined", default)]
    underlined: String,
    #[serde(rename = "nStartX", default)]
    start_x: usize,
    #[serde(rename = "nEndX", default)]
    end_x: usize,
    #[serde(rename = "aSuggestions", default)]
    suggestions: Vec<String>,
}

struct GrammalecteCommand {
    program: String,
    prefix_args: Vec<String>,
}

static WORK_COUNTER: AtomicU64 = AtomicU64::new(0);

fn hidden_command(program: &str) -> Command {
    #[cfg(windows)]
    {
        let mut command = Command::new(program);
        command.creation_flags(0x08000000);
        command
    }
    #[cfg(not(windows))]
    {
        Command::new(program)
    }
}

fn grammalecte_commands() -> Vec<GrammalecteCommand> {
    let mut commands = vec![GrammalecteCommand {
        program: "grammalecte-cli".to_string(),
        prefix_args: vec![],
    }];

    if let Ok(path) = std::env::var("GRAMMALECTE_CLI") {
        let trimmed = path.trim();
        if !trimmed.is_empty() {
            if trimmed.ends_with(".py") {
                commands.push(GrammalecteCommand {
                    program: "python".to_string(),
                    prefix_args: vec![trimmed.to_string()],
                });
                commands.push(GrammalecteCommand {
                    program: "py".to_string(),
                    prefix_args: vec!["-3".to_string(), trimmed.to_string()],
                });
                commands.push(GrammalecteCommand {
                    program: "python3".to_string(),
                    prefix_args: vec![trimmed.to_string()],
                });
            } else {
                commands.push(GrammalecteCommand {
                    program: trimmed.to_string(),
                    prefix_args: vec![],
                });
            }
        }
    }

    for path in grammalecte_cli_candidates() {
        let value = path.to_string_lossy().to_string();
        commands.push(GrammalecteCommand {
            program: "python".to_string(),
            prefix_args: vec![value.clone()],
        });
        commands.push(GrammalecteCommand {
            program: "py".to_string(),
            prefix_args: vec!["-3".to_string(), value.clone()],
        });
        commands.push(GrammalecteCommand {
            program: "python3".to_string(),
            prefix_args: vec![value],
        });
    }

    commands
}

fn find_file_named(root: &Path, filename: &str, depth: usize) -> Option<PathBuf> {
    if depth == 0 || !root.is_dir() {
        return None;
    }

    let entries = fs::read_dir(root).ok()?;
    for entry in entries.flatten() {
        let path = entry.path();
        if path.is_file()
            && path
                .file_name()
                .and_then(|name| name.to_str())
                .is_some_and(|name| name.eq_ignore_ascii_case(filename))
        {
            return Some(path);
        }
        if path.is_dir() {
            if let Some(found) = find_file_named(&path, filename, depth - 1) {
                return Some(found);
            }
        }
    }

    None
}

fn grammalecte_cli_candidates() -> Vec<PathBuf> {
    let mut candidates = Vec::new();

    #[cfg(windows)]
    {
        if let Ok(local_app_data) = std::env::var("LOCALAPPDATA") {
            let root = PathBuf::from(local_app_data)
                .join("Accessible")
                .join("Grammalecte");
            if let Some(path) = find_file_named(&root, "grammalecte-cli.py", 6) {
                candidates.push(path);
            }
        }
        if let Ok(app_data) = std::env::var("APPDATA") {
            let root = PathBuf::from(app_data).join("Grammalecte");
            if let Some(path) = find_file_named(&root, "grammalecte-cli.py", 6) {
                candidates.push(path);
            }
        }
    }

    candidates
}

fn command_help_works(command: &GrammalecteCommand) -> bool {
    let mut process = hidden_command(&command.program);
    process.args(&command.prefix_args).arg("-h");
    process
        .output()
        .map(|output| output.status.success())
        .unwrap_or(false)
}

pub fn is_grammalecte_installed() -> bool {
    grammalecte_commands().iter().any(command_help_works)
}

fn paragraph_char_offsets(text: &str) -> Vec<usize> {
    if text.is_empty() {
        return vec![0];
    }

    let parts: Vec<&str> = text.split("\n\n").collect();
    let mut offsets = Vec::with_capacity(parts.len());
    let mut start = 0;

    for (index, part) in parts.iter().enumerate() {
        offsets.push(start);
        start += part.chars().count();
        if index + 1 < parts.len() {
            start += 2;
        }
    }

    offsets
}

fn error_length(error: &GrammalecteError) -> usize {
    if error.end_x > error.start_x {
        return error.end_x - error.start_x;
    }
    if !error.underlined.is_empty() {
        return error.underlined.chars().count();
    }
    1
}

fn parse_grammalecte_json(text: &str, json: &str) -> Result<Vec<SpellingIssueDto>, String> {
    let top: GrammalecteTop =
        serde_json::from_str(json).map_err(|e| format!("Réponse Grammalecte illisible : {e}"))?;

    let paragraph_offsets = paragraph_char_offsets(text);
    let mut issues = Vec::new();

    for (paragraph_index, value) in top.data.iter().enumerate() {
        let paragraph_start = paragraph_offsets.get(paragraph_index).copied().unwrap_or(0);

        let paragraph: ParagraphErrors = if value.is_string() {
            serde_json::from_str(value.as_str().unwrap_or("")).unwrap_or(ParagraphErrors {
                grammar_errors: vec![],
            })
        } else {
            serde_json::from_value(value.clone()).unwrap_or(ParagraphErrors {
                grammar_errors: vec![],
            })
        };

        for error in paragraph.grammar_errors {
            let length = error_length(&error);
            let suggestion = error
                .suggestions
                .first()
                .cloned()
                .filter(|value| !value.is_empty());

            issues.push(SpellingIssueDto {
                kind: "grammar".to_string(),
                message: error.message,
                offset: paragraph_start + error.start_x,
                length,
                suggestion,
            });
        }
    }

    Ok(issues)
}

fn run_grammalecte_with_command(
    command: &GrammalecteCommand,
    input_path: &PathBuf,
) -> Result<String, String> {
    let mut process = hidden_command(&command.program);
    process.args(&command.prefix_args);
    process
        .arg("-f")
        .arg(input_path)
        .arg("-j")
        .arg("-wss")
        .arg("-ctx")
        .stdout(Stdio::piped())
        .stderr(Stdio::piped());

    let output = process
        .spawn()
        .and_then(|child| child.wait_with_output())
        .map_err(|e| format!("Impossible d'exécuter Grammalecte : {e}"))?;

    let stdout = String::from_utf8_lossy(&output.stdout).trim().to_string();
    let stderr = String::from_utf8_lossy(&output.stderr).trim().to_string();

    if stdout.is_empty() && !stderr.is_empty() {
        return Err(stderr);
    }

    if stdout.is_empty() {
        return Err("Grammalecte n'a renvoyé aucun résultat.".to_string());
    }

    Ok(stdout)
}

fn grammar_temp_path() -> PathBuf {
    let stamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_millis())
        .unwrap_or(0);
    let counter = WORK_COUNTER.fetch_add(1, Ordering::Relaxed);
    std::env::temp_dir().join(format!(
        "accessible-grammalecte-{}-{}-{}.txt",
        stamp,
        std::process::id(),
        counter
    ))
}

fn grammar_check_with_commands(text: &str) -> Result<Vec<SpellingIssueDto>, String> {
    let input_path = grammar_temp_path();

    {
        let mut file = fs::File::create(&input_path).map_err(|e| e.to_string())?;
        file.write_all(text.as_bytes()).map_err(|e| e.to_string())?;
    }

    let mut last_error =
        String::from("Grammalecte n'est pas installé ou introuvable sur cet appareil.");

    for command in grammalecte_commands() {
        match run_grammalecte_with_command(&command, &input_path) {
            Ok(json) => {
                let _ = fs::remove_file(&input_path);
                return parse_grammalecte_json(text, &json);
            }
            Err(error) => last_error = error,
        }
    }

    let _ = fs::remove_file(&input_path);
    Err(last_error)
}

#[tauri::command]
pub fn is_grammalecte_available() -> bool {
    is_grammalecte_installed()
}

#[tauri::command]
pub fn grammar_check_text(text: String) -> Result<Vec<SpellingIssueDto>, String> {
    let trimmed = text.trim();
    if trimmed.is_empty() {
        return Err("Aucun texte à corriger.".to_string());
    }

    if !is_grammalecte_installed() {
        return Err(
            "Grammalecte n'est pas installé. Installez Grammalecte (CLI) ou définissez la variable GRAMMALECTE_CLI vers grammalecte-cli.py, puis relancez.".to_string(),
        );
    }

    grammar_check_with_commands(trimmed)
}
