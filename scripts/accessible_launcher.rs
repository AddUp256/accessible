#![windows_subsystem = "windows"]

use std::env;
use std::fs::OpenOptions;
use std::io::Write;
use std::path::PathBuf;
use std::process::Command;

#[cfg(windows)]
use std::os::windows::process::CommandExt;

#[cfg(windows)]
const CREATE_NO_WINDOW: u32 = 0x08000000;

fn log_error(root: &PathBuf, message: &str) {
    let path = root.join("accessible-launcher.log");
    if let Ok(mut file) = OpenOptions::new().create(true).append(true).open(path) {
        let _ = writeln!(file, "{}", message);
    }
}

fn main() {
    let exe_path = match env::current_exe() {
        Ok(path) => path,
        Err(_) => return,
    };
    let Some(root) = exe_path.parent().map(|path| path.to_path_buf()) else {
        return;
    };

    let script = root.join("scripts").join("Launch-Accessible.ps1");
    if !script.exists() {
        log_error(&root, "scripts\\Launch-Accessible.ps1 introuvable.");
        return;
    }

    let mut command = Command::new("powershell.exe");
    command
        .arg("-NoProfile")
        .arg("-WindowStyle")
        .arg("Hidden")
        .arg("-ExecutionPolicy")
        .arg("Bypass")
        .arg("-File")
        .arg(&script)
        .current_dir(&root);

    #[cfg(windows)]
    command.creation_flags(CREATE_NO_WINDOW);

    let result = command.spawn();

    if let Err(error) = result {
        log_error(
            &root,
            &format!("Impossible de lancer PowerShell pour Accessible : {error}"),
        );
    }
}
