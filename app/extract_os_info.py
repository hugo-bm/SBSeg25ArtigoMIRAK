# ####################################################

# This code is part of the "Mirak-extractor" software and, consequently, is
# part of the "Mirak" project. It is expressly forbidden to copy, reproduce,
# distribute or make available this code or parts thereof in isolation, except
# under the terms expressly authorized by the rights holder.

# The provision of the complete software must strictly follow the guidelines
# established in the applicable license, as detailed in the license file
# included in this repository. Any unauthorized use may result in sanctions
# provided for in Brazilian law, including, but not limited to,
# Law No. 9.610/1998 (Copyright Law).

# For more information or specific requests, please contact the holder through
# the contact details present in the license file.

# ####################################################

"""
This module contains the "ExtractOsInfo" class, which is responsible for
providing methods that extract relevant information from the operating system.
"""


import os
import re


class ExtractOsInfo:
    """The class implements methods that extract relevant information
    from the operating system."""

    def extract_from_os_release(self):
        """Extract  information from 'os-release' file"""

        file = ""
        with open("/etc/os-release", "r") as file:
            file = file.read()

        info_dict = {}
        for line in file.strip().split("\n"):
            if line == "":
                break
            key, value = line.split("=", 1)  # Split on first occurrence of '='
            info_dict[key] = value.strip('"')  # Remove quotes if any

        if not info_dict.get("ID") or not info_dict.get("VERSION_ID"):
            raise Exception("Required information not found!")

        return tuple([info_dict.get("ID"), info_dict.get("VERSION_ID")])

    def extract_from_issue(self) -> "tuple":
        """Extract information from 'issue' file"""
        file = ""
        with open("/etc/issue", "r", encoding="utf8") as file:
            file = file.read()
        data = []
        pattern = r"^([A-Za-z]+)(?:[\w\s/]*)\s+(\d+(?:\.\d+){0,2})"
        match = re.search(pattern, file)

        #info = file.strip().split()
        #data.append(info[0].lower())
        #data.append(info[1])
        #if len(info) != 4:
        if match:
            data.append(match.group(1).lower())
            data.append(match.group(2))
        else:
            raise Exception("Required information not found!")
        return tuple(data)

    def extract_from_lsb_release(self) -> "tuple":
        """Extract information from 'lsb-release' file"""
        file = ""
        with open("/etc/lsb-release", "r", encoding="utf8") as file:
            file = file.read()

        info_dict = {}
        for line in file.strip().split("\n"):
            if line == "":
                break
            key, value = line.split("=", 1)  # Split on first occurrence of '='
            info_dict[key] = value.lower().strip('"')  # Remove quotes if any
        if not info_dict.get("DISTRIB_ID") or \
           not info_dict.get("DISTRIB_RELEASE"):
            raise Exception("Required information not found!")

        return tuple([info_dict.get("DISTRIB_ID"),
                      info_dict.get("DISTRIB_RELEASE")])

    def is_there_access(self, files: "list[str]") -> "list[str]":
        """This method performs an access authorization check for files or
        directories. It works by receiving a list of paths
        to the files and returning those that are authorized.
        Consequently, it also verifies the existence of the file."""
        released_files: "list[str]" = []
        for file in files:
            if os.access(file, os.R_OK):
                released_files.append(file)
        return released_files
