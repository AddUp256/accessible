//! R?le : Module Rust Ocr : commandes natives et pont syst?me pour Accessible.
use std::fs;
use std::path::{Path, PathBuf};
use std::process::Command;
use std::sync::atomic::{AtomicU64, Ordering};
use std::time::{SystemTime, UNIX_EPOCH};

#[cfg(windows)]
use std::os::windows::process::CommandExt;

use tauri::Manager;

const ALLOWED_EXTENSIONS: &[&str] = &["png", "jpg", "jpeg", "gif", "bmp", "tif", "tiff", "webp"];
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

fn tesseract_candidates() -> Vec<PathBuf> {
    let mut candidates = Vec::new();

    if let Ok(path) = std::env::var("TESSERACT_CMD") {
        if !path.trim().is_empty() {
            candidates.push(PathBuf::from(path.trim()));
        }
    }

    #[cfg(windows)]
    {
        for env_key in ["ProgramFiles", "ProgramFiles(x86)", "LOCALAPPDATA"] {
            if let Ok(root) = std::env::var(env_key) {
                candidates.push(
                    PathBuf::from(root)
                        .join("Tesseract-OCR")
                        .join("tesseract.exe"),
                );
            }
        }
        if let Ok(local_app_data) = std::env::var("LOCALAPPDATA") {
            candidates.push(
                PathBuf::from(local_app_data)
                    .join("Programs")
                    .join("Tesseract-OCR")
                    .join("tesseract.exe"),
            );
        }
    }

    candidates.extend(path_env_candidates("tesseract"));
    candidates
}

fn resolve_existing_binary(candidates: Vec<PathBuf>) -> Option<PathBuf> {
    candidates.into_iter().find(|path| path.is_file())
}

fn resolve_tesseract_data_dir(binary: &Path) -> Option<PathBuf> {
    if let Ok(path) = std::env::var("TESSDATA_PREFIX") {
        let trimmed = path.trim();
        if !trimmed.is_empty() {
            let dir = PathBuf::from(trimmed);
            if dir.is_dir() {
                return Some(dir);
            }
        }
    }

    binary
        .parent()
        .map(|parent| parent.join("tessdata"))
        .filter(|path| path.is_dir())
}

fn tesseract_command() -> Command {
    if let Some(binary) = resolve_existing_binary(tesseract_candidates()) {
        let mut command = hidden_path_command(&binary);
        if let Some(tessdata) = resolve_tesseract_data_dir(&binary) {
            command.env("TESSDATA_PREFIX", tessdata);
        }
        return command;
    }

    hidden_command("tesseract")
}

fn pdftoppm_command() -> Command {
    hidden_command("pdftoppm")
}

pub fn is_tesseract_installed() -> bool {
    tesseract_command()
        .arg("--version")
        .output()
        .map(|output| output.status.success())
        .unwrap_or(false)
}

fn available_tesseract_languages() -> Vec<String> {
    let output = match tesseract_command().arg("--list-langs").output() {
        Ok(output) if output.status.success() => output,
        _ => return Vec::new(),
    };

    let combined = format!(
        "{}\n{}",
        String::from_utf8_lossy(&output.stdout),
        String::from_utf8_lossy(&output.stderr)
    );

    combined
        .lines()
        .map(str::trim)
        .filter(|line| {
            !line.is_empty()
                && line
                    .chars()
                    .all(|ch| ch.is_ascii_alphanumeric() || ch == '_' || ch == '-')
        })
        .map(ToOwned::to_owned)
        .collect()
}

fn tesseract_languages_available(lang: &str) -> bool {
    let available = available_tesseract_languages();
    if available.is_empty() {
        return false;
    }

    lang.split('+')
        .map(str::trim)
        .filter(|part| !part.is_empty())
        .all(|requested| {
            available
                .iter()
                .any(|item| item.eq_ignore_ascii_case(requested))
        })
}

fn missing_tesseract_language_message(lang: &str) -> String {
    format!(
        "Tesseract est installé, mais le pack de langue requis ({lang}) est introuvable. Installez le pack français (fra), vérifiez avec `tesseract --list-langs`, puis relancez Accessible."
    )
}

fn is_pdftoppm_installed() -> bool {
    pdftoppm_command()
        .arg("-v")
        .output()
        .map(|output| output.status.success())
        .unwrap_or(false)
}

fn ocr_work_dir(app: &tauri::AppHandle) -> Result<PathBuf, String> {
    let dir = app
        .path()
        .app_cache_dir()
        .map_err(|e| e.to_string())?
        .join("ocr");
    fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    Ok(dir)
}

fn work_stamp() -> Result<String, String> {
    let millis = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map_err(|e| e.to_string())
        .map(|duration| duration.as_millis())?;
    let counter = WORK_COUNTER.fetch_add(1, Ordering::Relaxed);
    Ok(format!("{}-{}-{}", millis, std::process::id(), counter))
}

fn safe_image_path(work_dir: &Path, filename: &str) -> Result<PathBuf, String> {
    let ext = Path::new(filename)
        .extension()
        .and_then(|e| e.to_str())
        .map(|e| e.to_lowercase())
        .unwrap_or_else(|| "png".to_string());

    if !ALLOWED_EXTENSIONS.contains(&ext.as_str()) {
        return Err("Extension d'image non prise en charge.".to_string());
    }

    Ok(work_dir.join(format!("ocr_{}.{}", work_stamp()?, ext)))
}

fn run_tesseract_on_file(input_path: &Path, lang: &str) -> Result<String, String> {
    if !tesseract_languages_available(lang) {
        return Err(missing_tesseract_language_message(lang));
    }

    let output = tesseract_command()
        .arg(input_path)
        .arg("stdout")
        .arg("-l")
        .arg(lang)
        .arg("--dpi")
        .arg("300")
        .arg("-c")
        .arg("preserve_interword_spaces=1")
        .output()
        .map_err(|e| {
            format!(
                "Impossible d'exécuter Tesseract. Vérifiez qu'il est installé et dans le PATH : {e}"
            )
        })?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(if stderr.trim().is_empty() {
            "Tesseract n'a pas pu lire ce fichier.".to_string()
        } else {
            format!("Erreur Tesseract : {}", stderr.trim())
        });
    }

    Ok(String::from_utf8_lossy(&output.stdout).trim().to_string())
}

fn ocr_pdf_pages(work_dir: &Path, pdf_path: &Path, lang: &str) -> Result<String, String> {
    let stamp = work_stamp()?;
    let prefix = work_dir.join(format!("page_{stamp}"));

    let output = pdftoppm_command()
        .arg("-png")
        .arg("-r")
        .arg("300")
        .arg(pdf_path)
        .arg(&prefix)
        .output()
        .map_err(|e| format!("Impossible d'exécuter pdftoppm : {e}"))?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(if stderr.trim().is_empty() {
            "pdftoppm n'a pas pu convertir ce PDF.".to_string()
        } else {
            format!("Erreur pdftoppm : {}", stderr.trim())
        });
    }

    let prefix_name = prefix
        .file_name()
        .and_then(|name| name.to_str())
        .ok_or_else(|| "Impossible de nommer les pages PDF.".to_string())?
        .to_string();

    let mut page_paths: Vec<PathBuf> = fs::read_dir(work_dir)
        .map_err(|e| e.to_string())?
        .filter_map(|entry| entry.ok().map(|entry| entry.path()))
        .filter(|path| {
            path.extension()
                .and_then(|ext| ext.to_str())
                .is_some_and(|ext| ext.eq_ignore_ascii_case("png"))
                && path
                    .file_name()
                    .and_then(|name| name.to_str())
                    .is_some_and(|name| name.starts_with(&prefix_name))
        })
        .collect();

    page_paths.sort();

    if page_paths.is_empty() {
        return Err(
            "Aucune page extraite du PDF. Installez Poppler (pdftoppm) ou un Tesseract avec support PDF."
                .to_string(),
        );
    }

    let mut combined = String::new();
    for (index, page_path) in page_paths.iter().enumerate() {
        let page_text_result = run_tesseract_on_file(page_path, lang);
        let _ = fs::remove_file(page_path);
        let page_text = page_text_result?;
        if page_text.is_empty() {
            continue;
        }
        if !combined.is_empty() {
            combined.push_str("\n\n");
        }
        if page_paths.len() > 1 {
            combined.push_str(&format!("--- Page {} ---\n", index + 1));
        }
        combined.push_str(&page_text);
    }

    Ok(combined.trim().to_string())
}

fn ocr_pdf_bytes(app: &tauri::AppHandle, pdf_bytes: &[u8], lang: &str) -> Result<String, String> {
    if pdf_bytes.is_empty() {
        return Err("Fichier PDF vide.".to_string());
    }

    if !is_tesseract_installed() {
        return Err(
            "Tesseract OCR n'est pas installé ou introuvable. Installez Tesseract et le pack de langue français (fra), puis relancez l'application.".to_string(),
        );
    }

    if !tesseract_languages_available(lang) {
        return Err(missing_tesseract_language_message(lang));
    }

    let work_dir = ocr_work_dir(app)?;
    let pdf_path = work_dir.join(format!("ocr_{}.pdf", work_stamp()?));
    fs::write(&pdf_path, pdf_bytes).map_err(|e| e.to_string())?;

    let direct = run_tesseract_on_file(&pdf_path, lang);
    let _ = fs::remove_file(&pdf_path);

    if let Ok(text) = direct {
        if !text.is_empty() {
            return Ok(text);
        }
    }

    if !is_pdftoppm_installed() {
        return Err(
            "Ce PDF scanné n'a pas pu être lu directement. Installez Poppler (pdftoppm) pour convertir les pages, ou exportez le PDF en images.".to_string(),
        );
    }

    fs::write(&pdf_path, pdf_bytes).map_err(|e| e.to_string())?;
    let result = ocr_pdf_pages(&work_dir, &pdf_path, lang);
    let _ = fs::remove_file(&pdf_path);
    result
}

#[tauri::command]
pub fn is_tesseract_available() -> bool {
    is_tesseract_installed()
}

#[tauri::command]
pub fn is_tesseract_language_available(lang: Option<String>) -> bool {
    if !is_tesseract_installed() {
        return false;
    }
    tesseract_languages_available(lang.as_deref().unwrap_or("fra"))
}

#[tauri::command]
pub fn ocr_extract_text(
    app: tauri::AppHandle,
    image_bytes: Vec<u8>,
    filename: String,
    lang: Option<String>,
) -> Result<String, String> {
    if image_bytes.is_empty() {
        return Err("Fichier image vide.".to_string());
    }

    let lang = lang.unwrap_or_else(|| "fra".to_string());
    let lower = filename.to_lowercase();

    if lower.ends_with(".pdf") {
        return ocr_pdf_bytes(&app, &image_bytes, &lang);
    }

    if !is_tesseract_installed() {
        return Err(
            "Tesseract OCR n'est pas installé ou introuvable. Installez Tesseract et le pack de langue français (fra), puis relancez l'application.".to_string(),
        );
    }

    if !tesseract_languages_available(&lang) {
        return Err(missing_tesseract_language_message(&lang));
    }

    let work_dir = ocr_work_dir(&app)?;
    let input_path = safe_image_path(&work_dir, &filename)?;

    fs::write(&input_path, image_bytes).map_err(|e| e.to_string())?;

    let text_result = run_tesseract_on_file(&input_path, &lang);
    let _ = fs::remove_file(&input_path);
    let text = text_result?;

    if text.is_empty() {
        return Err("Aucun texte détecté dans l'image.".to_string());
    }

    Ok(text)
}
