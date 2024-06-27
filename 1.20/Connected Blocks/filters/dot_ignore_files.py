#This needs to be tested
from pathlib import Path
import os

def delete_files_starting_with_dot(branch: Path):    
    
    for leaf in branch.iterdir():        

        if leaf.is_file():
            if leaf.stem.startswith('.'):
                print(color_format_yellow+f"* Deleting File: {leaf}"+color_format_end)

                try:                    
                    os.remove(leaf)                    
                except Exception as e:
                        print(color_format_red+f"xx ERROR: {e}"+color_format_end)         
        else:
            delete_files_starting_with_dot(leaf)

##################################################################################
if __name__ == "__main__":

    color_format_green = '\033[92m'
    color_format_yellow = '\033[93m'
    color_format_red = '\033[91m'
    color_format_end = '\033[0m'  
    
    delete_files_starting_with_dot(Path('./BP'))
    delete_files_starting_with_dot(Path('./RP'))