from pathlib import Path
import os
import json

def cross_join_jsonte_arrays(current_dir: Path):    
    
    for template_file in current_dir.iterdir():        

        if template_file.is_file() :

            if template_file.suffix == 'templ':
                try:
                    f = open(template_file)
                    data = json.load(f)
                                       

                    # print(f"Deleted folder: {folder_path}")
                except Exception as e:
                    print(f"Error : {e}")

if __name__ == "__main__":
    cross_join_jsonte_arrays(Path('./data/jsonte'))
