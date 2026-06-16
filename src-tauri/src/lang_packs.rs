//! R?le : Module Rust Lang Packs : commandes natives et pont syst?me pour Accessible.
use std::fs;
use std::path::{Path, PathBuf};
use std::sync::Once;

use serde::{Deserialize, Serialize};
use tauri::Manager;

static SEED_ONCE: Once = Once::new();

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LanguagePackManifest {
    pub code: String,
    pub version: u32,
    #[serde(rename = "labelFr")]
    pub label_fr: String,
    pub native_name: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LanguagePackPayload {
    pub manifest: LanguagePackManifest,
    pub ui: serde_json::Value,
    pub dynamic: serde_json::Value,
}

fn portable_data_dir() -> Option<PathBuf> {
    if PathBuf::from("./data").is_dir() {
        return Some(PathBuf::from("./data"));
    }
    let exe = std::env::current_exe().ok()?;
    let parent = exe.parent()?;
    let data = parent.join("data");
    if data.is_dir() {
        Some(data)
    } else {
        None
    }
}

fn bundled_lang_packs_dir(app: &tauri::AppHandle) -> Option<PathBuf> {
    let dir = app.path().resource_dir().ok()?.join("lang-packs");
    if dir.is_dir() {
        Some(dir)
    } else {
        None
    }
}

fn is_pack_json(path: &Path) -> bool {
    path.extension().and_then(|e| e.to_str()) == Some("json")
        && path
            .file_stem()
            .and_then(|s| s.to_str())
            .is_some_and(|stem| stem != "catalog" && stem != "installed-languages")
}

fn dir_has_language_packs(dir: &Path) -> bool {
    let Ok(entries) = fs::read_dir(dir) else {
        return false;
    };
    entries.flatten().any(|e| is_pack_json(&e.path()))
}

fn should_seed_from_bundle(writable: &Path) -> bool {
    if !writable.exists() {
        return true;
    }
    if dir_has_language_packs(writable) {
        return false;
    }
    // Installateur a tourné mais aucune langue cochée — ne pas réinjecter tous les packs.
    if writable.join("installed-languages.json").is_file()
        || writable.join("catalog.json").is_file()
    {
        return false;
    }
    true
}

fn seed_lang_packs_from_bundle(bundled: &Path, writable: &Path) -> Result<(), String> {
    fs::create_dir_all(writable).map_err(|e| e.to_string())?;
    for entry in fs::read_dir(bundled).map_err(|e| e.to_string())? {
        let entry = entry.map_err(|e| e.to_string())?;
        let path = entry.path();
        if !path.is_file() || path.extension().and_then(|e| e.to_str()) != Some("json") {
            continue;
        }
        let Some(name) = path.file_name() else {
            continue;
        };
        let dest = writable.join(name);
        if !dest.exists() {
            fs::copy(&path, &dest).map_err(|e| e.to_string())?;
        }
    }
    Ok(())
}

fn ensure_lang_packs_seeded(app: &tauri::AppHandle, writable: &Path) {
    SEED_ONCE.call_once(|| {
        let Some(bundled) = bundled_lang_packs_dir(app) else {
            return;
        };
        if !should_seed_from_bundle(writable) {
            return;
        }
        let _ = seed_lang_packs_from_bundle(&bundled, writable);
    });
}

/// Dossier des packs installés (écriture) : à côté de l'exécutable ou `data/` portable.
pub fn language_packs_dir(app: &tauri::AppHandle) -> Result<PathBuf, String> {
    if let Some(data) = portable_data_dir() {
        let dir = data.join("lang-packs");
        ensure_lang_packs_seeded(app, &dir);
        fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
        return Ok(dir);
    }

    if let Ok(exe) = app.path().executable_dir() {
        let dir = exe.join("lang-packs");
        ensure_lang_packs_seeded(app, &dir);
        fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
        return Ok(dir);
    }

    if let Some(dir) = bundled_lang_packs_dir(app) {
        return Ok(dir);
    }

    Err("Impossible de déterminer le dossier des packs de langue.".to_string())
}

fn read_pack_file(path: &Path) -> Result<LanguagePackPayload, String> {
    let raw = fs::read_to_string(path).map_err(|e| format!("Lecture du pack : {e}"))?;
    serde_json::from_str(&raw).map_err(|e| format!("Pack JSON invalide : {e}"))
}

#[tauri::command]
pub fn get_language_packs_directory(app: tauri::AppHandle) -> Result<String, String> {
    language_packs_dir(&app).map(|p| p.to_string_lossy().to_string())
}

#[tauri::command]
pub fn list_installed_language_packs(app: tauri::AppHandle) -> Result<Vec<String>, String> {
    let dir = language_packs_dir(&app)?;
    let mut codes = Vec::new();

    if !dir.is_dir() {
        return Ok(codes);
    }

    for entry in fs::read_dir(&dir).map_err(|e| e.to_string())? {
        let entry = entry.map_err(|e| e.to_string())?;
        let path = entry.path();
        if path.extension().and_then(|e| e.to_str()) != Some("json") {
            continue;
        }
        let Some(stem) = path.file_stem().and_then(|s| s.to_str()) else {
            continue;
        };
        if stem == "catalog" || stem == "installed-languages" {
            continue;
        }
        if read_pack_file(&path).is_ok() {
            codes.push(stem.to_string());
        }
    }

    codes.sort();
    Ok(codes)
}

#[tauri::command]
pub fn read_language_pack(
    app: tauri::AppHandle,
    code: String,
) -> Result<LanguagePackPayload, String> {
    let safe = code
        .chars()
        .all(|c| c.is_ascii_alphanumeric() || c == '-' || c == '_');
    if !safe || code.is_empty() {
        return Err("Code de langue invalide.".to_string());
    }

    let dir = language_packs_dir(&app)?;
    let path = dir.join(format!("{code}.json"));
    if !path.is_file() {
        return Err(format!(
            "Pack de langue « {code} » absent. Réinstallez le pack via l'installateur Accessible."
        ));
    }
    read_pack_file(&path)
}
