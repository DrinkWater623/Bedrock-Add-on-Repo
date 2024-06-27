from pathlib import Path
import os

def delete_empty_folders(current_dir: Path):    
    
    for folder_path in current_dir.iterdir():        

        if folder_path.is_dir():
            
            if len(os.listdir(folder_path)) >= 1:
                delete_empty_folders(folder_path)

            #Not Else, because when done above, the folder may be empty
            if len(os.listdir(folder_path)) == 0: 
                try:                    
                    os.rmdir(folder_path)
                    print(f"Deleted empty folder: {folder_path}")
                except Exception as e:
                    print(f"Error while deleting empty folder {folder_path}: {e}")

if __name__ == "__main__":
    delete_empty_folders(Path('./BP'))
    delete_empty_folders(Path('./RP'))