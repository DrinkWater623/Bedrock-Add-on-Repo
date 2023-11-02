from pathlib import Path
import os
import stat
import shutil
import time

def clear_folders_starting_with_dot(branch: Path):

    for leaf in branch.iterdir():
        if leaf.is_dir():
            if leaf.stem.startswith('.'):
                print(f"* Removing Files from Folder: {leaf}")
                shutil.rmtree(leaf, ignore_errors = True)       
            else:
                clear_folders_starting_with_dot(leaf)

def delete_folders_starting_with_dot(branch: Path):    
    
    for leaf in branch.iterdir():        

        if leaf.is_dir():
            #print(f"Checking Folder: {leaf}")

            if leaf.stem.startswith('.'):
                print(color_format_yellow+f"* Removing Folder: {leaf}"+color_format_end)
                remove_branch(leaf,3)          
            else:
                delete_folders_starting_with_dot(leaf)

def remove_branch(branch: Path, retry_count: int = 5):  
    
    if branch.exists():
        if branch.is_dir():                        
            if len(os.listdir(branch)) > 0:
                print(f"** Deleting Empty Folders Under: {branch}")
                remove_empty_twigs_in_branch(branch,retry_count)
        
            if len(os.listdir(branch)) == 0:
                remove_empty_leaf(branch,retry_count)

def remove_files_in_branch(branch: Path):
    counter: int = 0
    if len(os.listdir(branch)) == 0:
        print(f"** Deleting Files in Folder: {branch}")
        for leaf in branch.iterdir():        

            if leaf.is_file():
                try: 
                    #print(f"**** Deleting File: {leaf}")               
                    os.remove(leaf)
                    counter += 1
                except Exception as e:
                    print(f"xx ERROR: Deleting File: {leaf}: {e}")
            else:           
                remove_files_in_branch(leaf)
        if counter > 0:
            print(f"   ==> {counter} Files Deleted")

def remove_empty_twigs_in_branch(branch: Path, retry_count: int = 5):    
    
    for twig in branch.iterdir():        

        if twig.is_dir():            

            if len(os.listdir(twig)) >= 1:
                remove_empty_twigs_in_branch(twig,retry_count)                
            
            if len(os.listdir(twig)) == 0:
                print(f"**** Deleting Empty Folder: {twig}")
                remove_empty_leaf(twig,retry_count)
                

def remove_empty_leaf(leaf: Path, retry_count: int = 5):      

    if leaf.exists():
        if leaf.is_dir():
            if len(os.listdir(leaf)) == 0:            
                try:
                    shutil.rmtree(leaf, onerror=remove_readonly)                    
                except Exception as e:
                    print(color_format_red+f"xxxx ERROR: {e}"+color_format_end)
                
def save_og_remove_empty_leaf(leaf: Path, retry_count: int = 5):      

    if leaf.is_dir():
        if len(os.listdir(leaf)) == 0:            
            try:
                #Renaming may help, esp when had stuff in it before - seems to be a hold on the file otherwise
                if leaf.exists():
                    shutil.rmtree(leaf, onerror=remove_readonly) #ignore_errors = True)                   
                    
            except Exception as e:
                if leaf.exists():
                    if not leaf.stem.startswith('.To_Delete_'):
                        newFolderName = str(leaf.parent) +"\.To_Delete_"+str(leaf.stem)
                        leaf.rename(newFolderName)                       
                        #if newFolderName.exists():
                        remove_empty_leaf(Path(newFolderName),10)
                    else:
                        if retry_count > 0:
                            time.sleep(0.005)
                            remove_empty_leaf(leaf,retry_count - 1)
                        else:
                            print(color_format_red+f"xxxx ERROR: {e}"+color_format_end)

            
                #print(f"xxxx ERROR: Deleting Empty Sub-Folder: {leaf}: {e}")    
def remove_readonly(func, path, _):
    "Clear the readonly bit and reattempt the removal"
    os.chmod(path, stat.S_IWRITE)
    func(path)

def list_files_in_branch(branch: Path):
    
    if len(os.listdir(branch)) >= 1:
        print(f"Files in : {branch}")  

    for leaf in branch.iterdir():
        if leaf.is_file():           
            print(f"File: {leaf.suffix}")
        else:           
            list_files_in_branch(leaf)
##################################################################################
if __name__ == "__main__":

    color_format_green = '\033[92m'
    color_format_yellow = '\033[93m'
    color_format_red = '\033[91m'
    color_format_end = '\033[0m'  

    clear_folders_starting_with_dot(Path('./BP'))
    clear_folders_starting_with_dot(Path('./RP'))
    
    delete_folders_starting_with_dot(Path('./BP'))
    delete_folders_starting_with_dot(Path('./RP'))