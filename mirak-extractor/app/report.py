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

class Report:
    """Construct the object to persiste result of extraction"""

    def __init__(self) -> None:
        self.apps_found: "list[dict]" = []
        self.rede_external: "dict" = {}
        self.strategic_files: "list[dict]" = []

    def get_os_product(self) -> str:
        """
        Returns the name of the operating system contained within the
        software found. Its purpose is to simplify the way of knowing
        which operating system is stored.
        """
        for app in self.apps_found:
            if app.get("type") == "o":
                return app.get("product")
        return ""

    def add_apps(
        self, _type: str, vendor: str, product: str, version: str,
        cpe_name: str
    ):
        """
        It allows you to store new software just by providing its
        data and identifier.
        """
        # Manually set the vendor value to the official routinator vendor
        if product == "routinator":
            vendor = "nlnetlabs"
        self.apps_found.append(
            {
                "type": _type,
                "vendor": vendor,
                "product": product,
                "version": version,
                "cpeName": cpe_name,
            }
        )
    def add_strategic_files(self, files: "list[dict]"):
        """
        Allows you to store information related to important RPKI files or directories.
        """
        self.strategic_files = files

    def add_rede_external(
        self, host_ip: str,
        open_ports: "list[int]",
        process_by_ports: "dict[int,str]"
    ):
        """
        Allows you to store information related to the host network.
        """
        self.rede_external.update(
            {
                "hostIP": host_ip,
                "openPorts": open_ports,
                "portsUseBy": process_by_ports}
        )

    def __str__(self) -> str:
        """This method creates a string with the contents of the object."""
        return (
            "{'appsFound':"
            + self.apps_found.__str__()
            + ", 'redeExternal': "
            + self.rede_external.__str__()
            + ", 'strategicFiles': "
            + self.strategic_files.__str__()
            + "}"
        )

    def get_report_dict(self):
        """
        Returns the information contained in the instance in data dictionary
        format following the MIRAK standard.

        """
        return {
            "appsFound": self.apps_found,
            "redeExternal": self.rede_external,
            "strategicFiles": self.strategic_files
        }
