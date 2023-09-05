from pathlib import Path
import shutil

def delete_folders_starting_with_dot(current_dir: Path):    
    
    for folder_path in current_dir.iterdir():        

        if folder_path.is_dir():

            if folder_path.stem.startswith('.'):
                try:
                    # Remove the folder and its contents recursively
                    shutil.rmtree(folder_path, ignore_errors = True)
                    print(f"Deleted folder: {folder_path}")
                except Exception as e:
                    print(f"Error while deleting folder {folder_path}: {e}")
            else:
                delete_folders_starting_with_dot(folder_path)

if __name__ == "__main__":
    delete_folders_starting_with_dot(Path('./BP'))
    delete_folders_starting_with_dot(Path('./RP'))