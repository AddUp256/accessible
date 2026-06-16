//! R?le : Module Rust Spellcheck : commandes natives et pont syst?me pour Accessible.
use std::io::Write;
use std::path::{Path, PathBuf};
use std::process::{Command, Stdio};

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

fn hunspell_command() -> Command {
    if let Some(binary) = resolve_existing_binary(hunspell_candidates()) {
        let mut command = hidden_path_command(&binary);
        apply_dictionary_env(&mut command);
        return command;
    }

    #[cfg(windows)]
    {
        let mut command = Command::new("hunspell");
        command.creation_flags(0x08000000);
        apply_dictionary_env(&mut command);
        command
    }
    #[cfg(not(windows))]
    {
        let mut command = Command::new("hunspell");
        apply_dictionary_env(&mut command);
        command
    }
}

fn hidden_path_command(program: &Path) -> Command {
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

#[cfg(windows)]
fn executable_name(name: &str) -> String {
    format!("{name}.exe")
}

#[cfg(not(windows))]
fn executable_name(name: &str) -> String {
    name.to_string()
}

fn path_env_candidates(binary: &str) -> Vec<PathBuf> {
    let executable = executable_name(binary);
    std::env::var_os("PATH")
        .map(|paths| {
            std::env::split_paths(&paths)
                .map(|path| path.join(&executable))
                .collect()
        })
        .unwrap_or_default()
}

fn hunspell_candidates() -> Vec<PathBuf> {
    let mut candidates = Vec::new();

    if let Ok(path) = std::env::var("HUNSPELL_CMD") {
        if !path.trim().is_empty() {
            candidates.push(PathBuf::from(path.trim()));
        }
    }

    #[cfg(windows)]
    {
        if let Ok(local_app_data) = std::env::var("LOCALAPPDATA") {
            candidates.push(
                PathBuf::from(&local_app_data)
                    .join("Microsoft")
                    .join("WindowsApps")
                    .join("hunspell.exe"),
            );
            candidates.push(
                PathBuf::from(&local_app_data)
                    .join("Programs")
                    .join("Hunspell")
                    .join("hunspell.exe"),
            );
        }

        for env_key in ["ProgramFiles", "ProgramFiles(x86)"] {
            if let Ok(root) = std::env::var(env_key) {
                candidates.push(PathBuf::from(&root).join("Hunspell").join("hunspell.exe"));
                candidates.push(
                    PathBuf::from(&root)
                        .join("Hunspell")
                        .join("bin")
                        .join("hunspell.exe"),
                );
                candidates.push(
                    PathBuf::from(&root)
                        .join("FSFhu")
                        .join("Hunspell")
                        .join("hunspell.exe"),
                );
            }
        }
    }

    candidates.extend(path_env_candidates("hunspell"));
    candidates
}

fn resolve_existing_binary(candidates: Vec<PathBuf>) -> Option<PathBuf> {
    candidates.into_iter().find(|path| path.is_file())
}

fn dictionary_dir_candidates() -> Vec<PathBuf> {
    let mut dirs = Vec::new();

    if let Ok(dicpath) = std::env::var("DICPATH") {
        dirs.extend(std::env::split_paths(&dicpath).filter(|path| path.is_dir()));
    }

    if let Ok(app_data) = std::env::var("APPDATA") {
        dirs.push(PathBuf::from(&app_data).join("hunspell").join("dicts"));
    }

    if let Ok(user_profile) = std::env::var("USERPROFILE") {
        dirs.push(PathBuf::from(&user_profile).join("hunspell-dicts"));
    }

    dirs.into_iter().filter(|path| path.is_dir()).collect()
}

fn apply_dictionary_env(command: &mut Command) {
    let dirs = dictionary_dir_candidates();
    if dirs.is_empty() {
        return;
    }

    if let Ok(joined) = std::env::join_paths(dirs) {
        command.env("DICPATH", joined);
    }
}

pub fn is_hunspell_installed() -> bool {
    hunspell_command()
        .arg("-h")
        .output()
        .map(|output| output.status.success())
        .unwrap_or(false)
}

fn resolve_dictionary(lang: &str) -> Vec<String> {
    match lang.trim().to_lowercase().as_str() {
        "fr" | "fra" => vec!["fr_FR".to_string(), "fr".to_string(), "french".to_string()],
        "en" | "en-us" | "en_us" => {
            vec!["en_US".to_string(), "en".to_string(), "english".to_string()]
        }
        "es" | "es-es" | "es_es" => vec!["es_ES".to_string(), "es".to_string()],
        "de" | "de-de" | "de_de" => vec!["de_DE".to_string(), "de".to_string()],
        "it" | "it-it" | "it_it" => vec!["it_IT".to_string(), "it".to_string()],
        "pt" | "pt-pt" | "pt_pt" | "pt-br" | "pt_br" => {
            vec!["pt_PT".to_string(), "pt_BR".to_string(), "pt".to_string()]
        }
        other => vec![other.to_string()],
    }
}

fn char_offset_of_line(text: &str, line_index: usize) -> usize {
    let mut offset = 0;
    for (i, line) in text.lines().enumerate() {
        if i == line_index {
            return offset;
        }
        offset += line.chars().count() + 1;
    }
    offset
}

fn parse_hunspell_output(
    output: &str,
    source_line: &str,
    line_start: usize,
) -> Vec<SpellingIssueDto> {
    let mut issues = Vec::new();

    for raw in output.lines() {
        if raw.starts_with("& ") {
            let Some((meta, suggestions)) = raw[2..].split_once(':') else {
                continue;
            };
            let parts: Vec<&str> = meta.split_whitespace().collect();
            if parts.len() < 3 {
                continue;
            }
            let word = parts[0];
            let word_offset: usize = parts[2].parse().unwrap_or(0);
            let first_suggestion = suggestions
                .split(',')
                .next()
                .map(|s| s.trim().to_string())
                .filter(|s| !s.is_empty());

            let local_offset = source_line
                .char_indices()
                .nth(word_offset)
                .map(|(idx, _)| idx)
                .or_else(|| source_line.find(word))
                .unwrap_or(word_offset);

            let doc_offset = line_start + source_line[..local_offset].chars().count();
            let length = word.chars().count();

            issues.push(SpellingIssueDto {
                kind: "spelling".to_string(),
                message: format!("Mot à vérifier : « {word} »"),
                offset: doc_offset,
                length,
                suggestion: first_suggestion,
            });
        } else if raw.starts_with("# ") {
            let parts: Vec<&str> = raw[2..].split_whitespace().collect();
            if parts.len() < 3 {
                continue;
            }
            let word = parts[0];
            let word_offset: usize = parts[2].parse().unwrap_or(0);
            let local_offset = source_line
                .char_indices()
                .nth(word_offset)
                .map(|(idx, _)| idx)
                .or_else(|| source_line.find(word))
                .unwrap_or(word_offset);
            let doc_offset = line_start + source_line[..local_offset].chars().count();

            issues.push(SpellingIssueDto {
                kind: "spelling".to_string(),
                message: format!("Mot inconnu : « {word} »"),
                offset: doc_offset,
                length: word.chars().count(),
                suggestion: None,
            });
        }
    }

    issues
}

fn run_hunspell_line(line: &str, dictionary: &str) -> Result<String, String> {
    let mut command = hunspell_command();
    command
        .arg("-d")
        .arg(dictionary)
        .arg("-a")
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped());

    let mut child = command
        .spawn()
        .map_err(|e| format!("Impossible d'exécuter Hunspell : {e}"))?;

    if let Some(stdin) = child.stdin.as_mut() {
        stdin
            .write_all(line.as_bytes())
            .map_err(|e| e.to_string())?;
        stdin.write_all(b"\n").map_err(|e| e.to_string())?;
    }

    let output = child.wait_with_output().map_err(|e| e.to_string())?;
    let stderr = String::from_utf8_lossy(&output.stderr);

    if stderr.contains("Can't open affix or dictionary") {
        return Err(format!(
            "Dictionnaire « {dictionary} » introuvable. Installez le pack français fr_FR pour Hunspell."
        ));
    }

    if !output.status.success() && stderr.trim().is_empty() {
        return Err("Hunspell n'a pas pu analyser le texte.".to_string());
    }

    Ok(String::from_utf8_lossy(&output.stdout).to_string())
}

fn spellcheck_with_dictionary(
    text: &str,
    dictionary: &str,
) -> Result<Vec<SpellingIssueDto>, String> {
    let mut issues = Vec::new();

    for (line_index, line) in text.lines().enumerate() {
        if line.trim().is_empty() {
            continue;
        }

        let output = run_hunspell_line(line, dictionary)?;
        let line_start = char_offset_of_line(text, line_index);
        issues.extend(parse_hunspell_output(&output, line, line_start));
    }

    Ok(issues)
}

#[tauri::command]
pub fn is_hunspell_available() -> bool {
    is_hunspell_installed()
}

#[tauri::command]
pub fn spellcheck_text(
    text: String,
    lang: Option<String>,
) -> Result<Vec<SpellingIssueDto>, String> {
    let trimmed = text.trim();
    if trimmed.is_empty() {
        return Err("Aucun texte à corriger.".to_string());
    }

    if !is_hunspell_installed() {
        return Err(
            "Hunspell n'est pas installé ou introuvable. Installez Hunspell avec le dictionnaire français (fr_FR), puis relancez l'application.".to_string(),
        );
    }

    let lang = lang.unwrap_or_else(|| "fr".to_string());
    let dictionaries = resolve_dictionary(&lang);
    let mut last_error = String::from("Dictionnaire introuvable.");

    for dictionary in dictionaries {
        match spellcheck_with_dictionary(&text, &dictionary) {
            Ok(issues) => return Ok(issues),
            Err(error) => last_error = error,
        }
    }

    Err(last_error)
}
