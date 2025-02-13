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
This module contains the "AppsFound" class, which is responsible for providing
the functionality to query information about software installed on systems,
whether Ubuntu, RHEL or Debian.
"""

import re
import subprocess


class AppsFound:
    """Responsible for providing the functionality to query information
    about software installed on systems, whether Ubuntu, RHEL or Debian."""

    # For Debian/Ubuntu
    def __get_installed_apps_debian(self) -> "list[list[str]]":
        """This method uses the "dpkg-query" package manager to locate
        the applications installed on the host. It returns the
        manufacturer/distributor name, version and architecture
        for each software found."""
        app: "list[str]" = ["", "", "", ""]
        apps: "list[list[str]]" = []

        result = subprocess.run(
            [
                "dpkg-query",
                "-W",
                "-f=${binary:Package}\
|${Maintainer}|${Version}\
|${Architecture}\n",
            ],
            check=False,
            capture_output=True,
            text=True,
        )
        for line in result.stdout.splitlines():
            app = line.split("|")
            if ":" in app[0]:
                app[0] = app[0].split(":")[0]
            apps.append(app)
            app = ["", "", "", ""]
        return apps

    # For RHEL
    def __get_installed_apps_rhel(self) -> "list[list[str]]":
        """This method uses the "rpm" package manager to locate
        the applications installed on the host. It returns the
        manufacturer/distributor name, version and architecture
        for each software found."""
        apps: "list[list[str]]" = []
        result = subprocess.run(
            [
                "rpm",
                "-qa",
                "--queryformat",
                "%{NAME}\
    |%{VENDOR}|%{VERSION}\
    |%{ARCH}\n",
            ],
            check=False,
            capture_output=True,
            text=True,
        )
        for line in result.stdout.splitlines():
            info = line.split("|")
            list_info: "list[str]" = []
            for data in info:
                list_info.append(data.strip(" "))
            apps.append(list_info)
        return apps

    def locate_apps(self, os: str):
        """This method uses the package manager of the operating system
        to obtain a list of installed applications and separates the name
        and version. Only software installed by the package managers of each
        operating system is detected, while other manually installed or
        third-party software is not detected in this version of the software.
        """

        apps: "list[list[str]]" = []

        if os == "enterprise":
            apps = self.__get_installed_apps_rhel()
        elif os == "ubuntu" or os == "debian":
            apps = self.__get_installed_apps_debian()

        # Exclude vendor information and sanitize version
        for app in apps:
            # Cleaning unwanted characters for WEB URL in version part in CPE
            app[2] = self.sanitize_cpe_chunk(app[2])
            # Cleaning unwanted characters for WEB URL in product part in CPE
            app[0] = self.sanitize_cpe_chunk(app[0])
            # Manual correction of software information (These software are
            # part of the requirements)
            if app[0] == "routinator":
                app[1] = "nlnetlabs"
            elif app[0] == "python3":
                app[0] = "python"
                app[1] = "python"
            else:
                app[1] = f"{os}-tag_rec-app"

        return apps

    def sanitize_cpe_chunk(self, chunk: str) -> str:
        """
        Removes special characters from a CPE chunk except -, _, /, and .
        Also removes the ':' character.
        """
        return re.sub(r"[^a-zA-Z0-9\-_\/\.]", "", chunk)
