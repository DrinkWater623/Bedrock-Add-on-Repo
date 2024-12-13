from pathlib import Path
import os
import stat
import shutil

# Constants
COLOR_FORMAT_GREEN = "\033[92m"
COLOR_FORMAT_YELLOW = "\033[93m"
COLOR_FORMAT_RED = "\033[91m"
COLOR_FORMAT_END = "\033[0m"

def delete_folders_starting_with_dot(branch: Path):
    """Recursive"""
    for leaf in branch.iterdir():
        if leaf.is_dir():
            if leaf.stem.startswith("."):
                print(
                    COLOR_FORMAT_YELLOW
                    + f"* Removing Folder: {leaf}"
                    + COLOR_FORMAT_END
                )

                shutil.rmtree(leaf, ignore_errors=True)

                if leaf.exists():
                    try:
                        shutil.rmtree(leaf, onerror=remove_readonly)
                    except Exception as e:
                        print(COLOR_FORMAT_RED + f"xxxx ERROR: {e}" + COLOR_FORMAT_END)
            else:
                delete_folders_starting_with_dot(leaf)
        else:
            if leaf.stem.startswith("."):
                print(
                    COLOR_FORMAT_YELLOW + f"* Deleting File: {leaf}" + COLOR_FORMAT_END
                )

                try:
                    os.remove(leaf)
                except Exception as e:
                    print(COLOR_FORMAT_RED + f"xxxx ERROR: {e}" + COLOR_FORMAT_END)


def remove_readonly(func, path, _):
    "Clear the readonly bit and reattempt the removal"
    os.chmod(path, stat.S_IWRITE)
    func(path)


##################################################################################
if __name__ == "__main__":  

    delete_folders_starting_with_dot(Path("./BP"))
    delete_folders_starting_with_dot(Path("./RP"))
