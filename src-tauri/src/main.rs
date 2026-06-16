//! R?le : Point d?entr?e natif qui d?marre la biblioth?que Tauri de l?application.
// Emp?che une fen?tre console suppl?mentaire sous Windows en release. Ne pas supprimer.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    app_lib::run();
}
