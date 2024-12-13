from pathlib import Path
import os
import stat
import shutil

def delete_folders_with_beta_in_name(branch: Path):    
    
    for leaf in branch.iterdir():        

        if leaf.is_dir():
            if leaf.stem.find('beta') > 0:
                print(color_format_yellow+f"* Removing Folder: {leaf}"+color_format_end)

                shutil.rmtree(leaf, ignore_errors = True)

                if leaf.exists():
                    try:                    
                        shutil.rmtree(leaf, onerror=remove_readonly)                    
                    except Exception as e:
                        print(color_format_red+f"xxxx ERROR: {e}"+color_format_end)         
            else:
                delete_folders_with_beta_in_name(leaf)
        else:
            if leaf.stem.find('beta') > 0:
                print(color_format_yellow+f"* Deleting File: {leaf}"+color_format_end)

                try:                    
                    os.remove(leaf)                    
                except Exception as e:
                        print(color_format_red+f"xxxx ERROR: {e}"+color_format_end)

def remove_readonly(func, path, _):
    "Clear the readonly bit and reattempt the removal"
    os.chmod(path, stat.S_IWRITE)
    func(path)

##################################################################################
if __name__ == "__main__":

    color_format_green = '\033[92m'
    color_format_yellow = '\033[93m'
    color_format_red = '\033[91m'
    color_format_end = '\033[0m'  
    
    delete_folders_with_beta_in_name(Path('./BP/scripts'))