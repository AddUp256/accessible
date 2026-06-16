//! Rôle : détection des polices locales et dossier de polices ajouté par l'utilisateur.
use serde::Serialize;
use std::collections::BTreeMap;
use std::fs;
use std::path::{Path, PathBuf};
use std::process::Command;
use tauri::Manager;

#[derive(Serialize)]
pub struct DetectedFont {
    name: String,
    source: String,
    path: String,
}

fn is_portable_mode() -> bool {
    if PathBuf::from("./data").is_dir() {
        return true;
    }
    if let Ok(exe) = std::env::current_exe() {
        if let Some(parent) = exe.parent() {
            return parent.join("data").is_dir();
        }
    }
    false
}

fn custom_fonts_dir(app: &tauri::AppHandle) -> Result<PathBuf, String> {
    let dir = if is_portable_mode() {
        if PathBuf::from("./data").is_dir() {
            PathBuf::from("./data").join("fonts")
        } else {
            std::env::current_exe()
                .ok()
                .and_then(|exe| exe.parent().map(|parent| parent.join("data").join("fonts")))
                .ok_or_else(|| "Impossible de déterminer le dossier de polices portable.".to_string())?
        }
    } else {
        app.path()
            .app_data_dir()
            .map_err(|e| e.to_string())?
            .join("Accessible")
            .join("fonts")
    };
    fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    Ok(dir)
}

fn font_dirs(app: &tauri::AppHandle) -> Result<Vec<(PathBuf, String)>, String> {
    let mut dirs = Vec::new();
    dirs.push((custom_fonts_dir(app)?, "Dossier Accessible".to_string()));

    #[cfg(target_os = "windows")]
    {
        if let Ok(windir) = std::env::var("WINDIR") {
            dirs.push((PathBuf::from(windir).join("Fonts"), "Windows".to_string()));
        }
        if let Ok(local) = std::env::var("LOCALAPPDATA") {
            dirs.push((
                PathBuf::from(local).join("Microsoft").join("Windows").join("Fonts"),
                "Utilisateur Windows".to_string(),
            ));
        }
    }

    #[cfg(target_os = "macos")]
    {
        dirs.push((PathBuf::from("/System/Library/Fonts"), "macOS".to_string()));
        dirs.push((PathBuf::from("/Library/Fonts"), "macOS".to_string()));
        if let Ok(home) = std::env::var("HOME") {
            dirs.push((PathBuf::from(home).join("Library/Fonts"), "Utilisateur macOS".to_string()));
        }
    }

    #[cfg(target_os = "linux")]
    {
        dirs.push((PathBuf::from("/usr/share/fonts"), "Linux".to_string()));
        dirs.push((PathBuf::from("/usr/local/share/fonts"), "Linux".to_string()));
        if let Ok(home) = std::env::var("HOME") {
            dirs.push((PathBuf::from(home).join(".local/share/fonts"), "Utilisateur Linux".to_string()));
        }
    }

    Ok(dirs)
}

fn is_font_file(path: &Path) -> bool {
    matches!(
        path.extension()
            .and_then(|ext| ext.to_str())
            .map(|ext| ext.to_ascii_lowercase())
            .as_deref(),
        Some("ttf" | "otf" | "woff" | "woff2")
    )
}

fn scan_font_dir(dir: &Path, source: &str, found: &mut BTreeMap<String, DetectedFont>) {
    let Ok(entries) = fs::read_dir(dir) else {
        return;
    };

    for entry in entries.flatten() {
        let path = entry.path();
        if path.is_dir() {
            scan_font_dir(&path, source, found);
            continue;
        }
        if !is_font_file(&path) {
            continue;
        }
        let Some(stem) = path.file_stem().and_then(|s| s.to_str()) else {
            continue;
        };
        let name = stem.replace(['_', '-'], " ");
        let key = name.to_ascii_lowercase();
        found.entry(key).or_insert_with(|| DetectedFont {
            name,
            source: source.to_string(),
            path: path.to_string_lossy().to_string(),
        });
    }
}

#[tauri::command]
pub fn get_custom_fonts_directory(app: tauri::AppHandle) -> Result<String, String> {
    custom_fonts_dir(&app).map(|dir| dir.to_string_lossy().to_string())
}

#[tauri::command]
pub fn open_custom_fonts_directory(app: tauri::AppHandle) -> Result<String, String> {
    let dir = custom_fonts_dir(&app)?;

    #[cfg(target_os = "windows")]
    let mut command = {
        let mut cmd = Command::new("explorer");
        cmd.arg(&dir);
        cmd
    };

    #[cfg(target_os = "macos")]
    let mut command = {
        let mut cmd = Command::new("open");
        cmd.arg(&dir);
        cmd
    };

    #[cfg(target_os = "linux")]
    let mut command = {
        let mut cmd = Command::new("xdg-open");
        cmd.arg(&dir);
        cmd
    };

    command.spawn().map_err(|e| e.to_string())?;
    Ok(dir.to_string_lossy().to_string())
}

#[tauri::command]
pub fn list_installed_fonts(app: tauri::AppHandle) -> Result<Vec<DetectedFont>, String> {
    let mut found = BTreeMap::new();
    for (dir, source) in font_dirs(&app)? {
        scan_font_dir(&dir, &source, &mut found);
    }
    Ok(found.into_values().collect())
}
