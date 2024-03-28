# This needs to be tested
from pathlib import Path
import os

COLOR_FORMAT_GREEN = "\033[92m"
COLOR_FORMAT_YELLOW = "\033[93m"
COLOR_FORMAT_RED = "\033[91m"
COLOR_FORMAT_END = "\033[0m"


def delete_files_starting_with_dot(branch: Path):
    """Recursive"""
    for leaf in branch.iterdir():
        if leaf.is_file():
            if leaf.stem.startswith("."):
                print(
                    COLOR_FORMAT_YELLOW + f"* Deleting File: {leaf}" + COLOR_FORMAT_END
                )

                try:
                    os.remove(leaf)
                except Exception as e:
                    print(COLOR_FORMAT_RED + f"xx ERROR: {e}" + COLOR_FORMAT_END)
        else:
            delete_files_starting_with_dot(leaf)


##################################################################################
if __name__ == "__main__":
    delete_files_starting_with_dot(Path("./BP"))
    delete_files_starting_with_dot(Path("./RP"))
