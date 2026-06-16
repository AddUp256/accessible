//! R?le : Noyau Tauri : migrations SQLite, stockage profil et enregistrement des commandes natives.
use std::fs;
use std::path::PathBuf;
use tauri::Manager;
use tauri_plugin_sql::{Migration, MigrationKind};

mod dictation;
mod espeak;
mod fonts;
mod grammar;
mod lang_packs;
mod ocr;
mod piper;
mod spellcheck;
mod transcribe;

const PROFILE_FILE: &str = "profile.json";

fn is_portable_mode() -> bool {
    if PathBuf::from("./data").is_dir() {
        return true;
    }
    if let Ok(exe) = std::env::current_exe() {
        if let Some(parent) = exe.parent() {
            if parent.join("data").is_dir() {
                return true;
            }
        }
    }
    false
}

fn profile_dir(app: &tauri::AppHandle) -> Result<PathBuf, String> {
    if is_portable_mode() {
        let base = if PathBuf::from("./data").is_dir() {
            PathBuf::from("./data")
        } else if let Ok(exe) = std::env::current_exe() {
            exe.parent()
                .map(|p| p.join("data"))
                .ok_or_else(|| "Impossible de déterminer le dossier portable.".to_string())?
        } else {
            return Err("Impossible de déterminer le dossier portable.".to_string());
        };
        fs::create_dir_all(&base).map_err(|e| e.to_string())?;
        return Ok(base);
    }

    let dir = app
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?
        .join("Accessible");
    fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    Ok(dir)
}

#[tauri::command]
fn detect_portable_mode() -> bool {
    is_portable_mode()
}

#[tauri::command]
fn get_storage_path(app: tauri::AppHandle) -> Result<String, String> {
    profile_dir(&app).map(|dir| dir.join(PROFILE_FILE).to_string_lossy().to_string())
}

#[tauri::command]
fn load_profile_file(app: tauri::AppHandle) -> Result<Option<String>, String> {
    let path = profile_dir(&app)?.join(PROFILE_FILE);
    if !path.exists() {
        return Ok(None);
    }
    fs::read_to_string(path)
        .map_err(|e| e.to_string())
        .map(Some)
}

#[tauri::command]
fn save_profile_file(app: tauri::AppHandle, content: String) -> Result<(), String> {
    let path = profile_dir(&app)?.join(PROFILE_FILE);
    fs::write(path, content).map_err(|e| e.to_string())
}

#[tauri::command]
fn delete_profile_file(app: tauri::AppHandle) -> Result<(), String> {
    let path = profile_dir(&app)?.join(PROFILE_FILE);
    if path.exists() {
        fs::remove_file(path).map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
fn enable_portable_mode(_app: tauri::AppHandle) -> Result<String, String> {
    let dir = if PathBuf::from("./data").is_dir() {
        PathBuf::from("./data")
    } else if let Ok(exe) = std::env::current_exe() {
        exe.parent()
            .map(|p| p.join("data"))
            .ok_or_else(|| "Impossible de créer le dossier portable.".to_string())?
    } else {
        return Err("Impossible de créer le dossier portable.".to_string());
    };
    fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    Ok(dir.join(PROFILE_FILE).to_string_lossy().to_string())
}

fn data_dir_for_portable() -> Option<PathBuf> {
    if !is_portable_mode() {
        return None;
    }
    if PathBuf::from("./data").is_dir() {
        return Some(PathBuf::from("./data"));
    }
    if let Ok(exe) = std::env::current_exe() {
        return exe.parent().map(|parent| parent.join("data"));
    }
    None
}

fn portable_sqlite_key() -> Option<String> {
    let dir = data_dir_for_portable()?;
    let db_path = dir.join("accessible.db");
    Some(format!(
        "sqlite:{}",
        db_path.to_string_lossy().replace('\\', "/")
    ))
}

fn sqlite_migrations() -> Vec<Migration> {
    vec![
        Migration {
            version: 1,
            description: "create accessible profile storage",
            sql: "
                CREATE TABLE IF NOT EXISTS storage_meta (
                    key TEXT PRIMARY KEY NOT NULL,
                    value TEXT NOT NULL
                );
                CREATE TABLE IF NOT EXISTS profile (
                    id INTEGER PRIMARY KEY CHECK (id = 1),
                    content TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                );
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "normalized notes and flashcard tables",
            sql: "
                CREATE TABLE IF NOT EXISTS notes (
                    id TEXT PRIMARY KEY NOT NULL,
                    title TEXT NOT NULL,
                    body TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                );
                CREATE TABLE IF NOT EXISTS flashcard_decks (
                    id TEXT PRIMARY KEY NOT NULL,
                    title TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                );
                CREATE TABLE IF NOT EXISTS flashcard_cards (
                    id TEXT PRIMARY KEY NOT NULL,
                    deck_id TEXT NOT NULL,
                    front TEXT NOT NULL,
                    back TEXT NOT NULL,
                    schedule_json TEXT,
                    created_at TEXT NOT NULL,
                    FOREIGN KEY (deck_id) REFERENCES flashcard_decks(id) ON DELETE CASCADE
                );
                CREATE INDEX IF NOT EXISTS idx_flashcard_cards_deck_id ON flashcard_cards(deck_id);
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 3,
            description: "normalized organizer and communicator tables",
            sql: "
                CREATE TABLE IF NOT EXISTS checklists (
                    id TEXT PRIMARY KEY NOT NULL,
                    title TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                );
                CREATE TABLE IF NOT EXISTS checklist_items (
                    id TEXT PRIMARY KEY NOT NULL,
                    checklist_id TEXT NOT NULL,
                    label TEXT NOT NULL,
                    done INTEGER NOT NULL DEFAULT 0,
                    created_at TEXT NOT NULL,
                    FOREIGN KEY (checklist_id) REFERENCES checklists(id) ON DELETE CASCADE
                );
                CREATE TABLE IF NOT EXISTS kanban_tasks (
                    id TEXT PRIMARY KEY NOT NULL,
                    title TEXT NOT NULL,
                    column_id TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                );
                CREATE TABLE IF NOT EXISTS personal_cards (
                    id TEXT PRIMARY KEY NOT NULL,
                    label TEXT NOT NULL,
                    message TEXT NOT NULL,
                    pictogram_id INTEGER,
                    created_at TEXT NOT NULL
                );
                CREATE TABLE IF NOT EXISTS saved_pictograms (
                    id INTEGER PRIMARY KEY NOT NULL,
                    label TEXT NOT NULL,
                    imported_at TEXT NOT NULL
                );
                CREATE INDEX IF NOT EXISTS idx_checklist_items_checklist_id ON checklist_items(checklist_id);
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 4,
            description: "multi-user profiles",
            sql: "
                CREATE TABLE IF NOT EXISTS user_profiles (
                    id TEXT PRIMARY KEY NOT NULL,
                    name TEXT NOT NULL,
                    content TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                );
                INSERT INTO user_profiles (id, name, content, created_at, updated_at)
                SELECT 'profile-default', 'Profil principal', content, updated_at, updated_at
                FROM profile
                WHERE id = 1
                AND NOT EXISTS (SELECT 1 FROM user_profiles LIMIT 1);
                INSERT OR IGNORE INTO storage_meta (key, value)
                VALUES ('active_profile_id', 'profile-default');
            ",
            kind: MigrationKind::Up,
        },
    ]
}

#[tauri::command]
fn get_sqlite_db_uri() -> String {
    if let Some(key) = portable_sqlite_key() {
        if let Some(dir) = data_dir_for_portable() {
            let _ = fs::create_dir_all(&dir);
        }
        return key;
    }
    "sqlite:accessible.db".to_string()
}

#[tauri::command]
fn get_sqlite_db_path(app: tauri::AppHandle) -> Result<String, String> {
    if let Some(dir) = data_dir_for_portable() {
        fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
        return Ok(dir.join("accessible.db").to_string_lossy().to_string());
    }

    let dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
    Ok(dir.join("accessible.db").to_string_lossy().to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
#[tauri::command]
fn quit_application(app: tauri::AppHandle, window: tauri::Window) -> Result<(), String> {
    window.close().map_err(|e| e.to_string())?;
    app.exit(0);
    Ok(())
}

pub fn run() {
    let mut sql_plugin = tauri_plugin_sql::Builder::default()
        .add_migrations("sqlite:accessible.db", sqlite_migrations());

    if let Some(key) = portable_sqlite_key() {
        if let Some(dir) = data_dir_for_portable() {
            let _ = fs::create_dir_all(&dir);
        }
        sql_plugin = sql_plugin.add_migrations(&key, sqlite_migrations());
    }

    tauri::Builder::default()
        .plugin(sql_plugin.build())
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            detect_portable_mode,
            get_storage_path,
            load_profile_file,
            save_profile_file,
            delete_profile_file,
            enable_portable_mode,
            get_sqlite_db_path,
            get_sqlite_db_uri,
            espeak::get_espeak_status,
            espeak::espeak_synthesize,
            fonts::get_custom_fonts_directory,
            fonts::open_custom_fonts_directory,
            fonts::list_installed_fonts,
            ocr::is_tesseract_available,
            ocr::is_tesseract_language_available,
            ocr::ocr_extract_text,
            spellcheck::is_hunspell_available,
            spellcheck::spellcheck_text,
            grammar::is_grammalecte_available,
            grammar::grammar_check_text,
            piper::get_piper_status,
            piper::list_piper_voices_cmd,
            piper::piper_synthesize,
            dictation::get_dictation_status,
            dictation::dictation_recognize_once,
            lang_packs::get_language_packs_directory,
            lang_packs::list_installed_language_packs,
            lang_packs::read_language_pack,
            transcribe::get_whisper_status,
            transcribe::is_whisper_available,
            transcribe::transcribe_media_file,
            quit_application
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
