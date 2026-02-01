// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

#[tauri::command]
fn get_computer_name() -> String {
    #[cfg(windows)]
    {
        std::env::var("COMPUTERNAME").unwrap_or_else(|_| "Unknown".into())
    }
    #[cfg(not(windows))]
    {
        std::env::var("HOSTNAME").unwrap_or_else(|_| "Unknown".into())
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_computer_name])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
