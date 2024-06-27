from pathlib import Path
import os
import shutil

def move_folder_up_one_if(current_dir: Path,search_name): 
    
    for folder_object in current_dir.iterdir():        

        if folder_object.is_dir():

            if len(os.listdir(folder_object)) >= 1:
                move_folder_up_one_if(folder_object,search_name)

            if folder_object.stem == search_name:
                move_files(folder_object, folder_object.parent,search_name)
                

def move_files(source_dir: Path,target_dir: Path,exclude_folder_name): 
    
    for folder_object in os.listdir(source_dir):        

        if folder_object != exclude_folder_name:

            fn_src = os.path.join(source_dir,folder_object)
            fn_dest = os.path.join(target_dir,folder_object)

            try:                    
                os.rename(fn_src, fn_dest)
                print(f"Moved {folder_object} from  {source_dir} to {target_dir}")
            except Exception as e:
                    print(f"Error while moving object {fn_src}: {e}")

if __name__ == "__main__":
    move_folder_up_one_if(Path('./BP'),'verified')
    move_folder_up_one_if(Path('./RP'),'verified')