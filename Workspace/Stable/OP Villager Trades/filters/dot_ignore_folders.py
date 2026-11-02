'''
=====================================================================
Copyright (C) 2024 DrinkWater623/PinkSalt623/Update Block Dev  
License: GPL-3.0-only (https://www.gnu.org/licenses/gpl-3.0.html)
CliffNotes: Using my files within Minecraft Bedrock MarketPlace is prohibited without written permission.  All code must remain freely visible and license passed along.
URL: https://github.com/DrinkWater623
======================================================================
Beware: Not intended for use outside of Regolith
'''
from pathlib import Path
import os
import stat
import shutil

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
                        print(COLOR_FORMAT_RED + f"xx ERROR: {e}" + COLOR_FORMAT_END)
            else:
                delete_folders_starting_with_dot(leaf)


def remove_readonly(func, path, _):
    "Clear the readonly bit and reattempt the removal"
    os.chmod(path, stat.S_IWRITE)
    func(path)


##################################################################################
if __name__ == "__main__":
    delete_folders_starting_with_dot(Path("./BP"))
    delete_folders_starting_with_dot(Path("./RP"))
