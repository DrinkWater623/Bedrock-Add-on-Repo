from pathlib import Path
import os
import shutil


def delete_empty_folders(branch: Path):
    """Recursive"""
    for twig in branch.iterdir():
        if twig.is_dir():
            if len(os.listdir(twig)) >= 1:
                delete_empty_folders(twig)

            # Not Else, because when done above, the folder may be empty
            if len(os.listdir(twig)) == 0:
                try:
                    shutil.rmtree(twig, onerror=remove_readonly)
                    print(f"Deleted empty folder: {twig}")
                except Exception as e:
                    print(f"Error: Empty Folder {twig}: {e}")


def remove_readonly(func, path, _):
    "Clear the readonly bit and reattempt the removal"    
    os.chmod(path, stat.S_IWRITE)
    func(path)


if __name__ == "__main__":
    delete_empty_folders(Path("./BP"))
    delete_empty_folders(Path("./RP"))
