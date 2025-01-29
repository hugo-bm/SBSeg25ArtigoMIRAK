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
This module contains the "Result" class, which is responsible for maintaining
information about the host, organizing it and validating it to match the
MIRAK file schema.
"""
import re


class Result:
    """This class maintains information about the host, and organizes
    and validates the data to match the MIRAK file Schema."""
    def __init__(self) -> None:
        self.type: str = ""
        self.vendor: str = ""
        self.product: str = ""
        self.version: str = ""
        self.cpe_name: str = ""
        self.host_ip: str = ""
        self.open_ports: 'list[int]' = []
        self.process_by_ports: 'dict[int,str]' = {}

    def set_os_info(self, product: str, version: str):
        """This method sets the operating system information
        extract for the object. It also formats and validates
        this information."""

        self.type = "o"
        self.product = product
        self.version = version
        if product == "ubuntu":
            self.vendor = "canonical"
        if product == "debian":
            self.vendor = "debian"
        if product == "rhel":
            self.vendor = "redhat"
            self.product = "enterprise"

        self.cpe_name = f"cpe:2.3:o:{self.vendor}:{self.product}\
_linux:{self.version}:*:*:*:*:*:*:*"

    def set_host_ip(self, ip: str):
        """Sets the IP related to the Host. Usually, the primary NIC"""
        if re.match(r"\b((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\b", ip):
            self.host_ip = ip
        else:
            raise ValueError("The ip provided is in an invalid format!")

    def set_ports(self, ports: 'list[int]'):
        """Sets the ports open for connection on LISTEN state"""
        self.open_ports = ports

    def set_ports_by_process(self, data: 'dict[int, str]'):
        """Sets process name by network port. Network port is set to 'key'
        and process name as 'value'"""
        self.process_by_ports = data

    def show(self):
        "Prints all information in object to stdout"
        print(
            f'Tipo: {self.type}\nFabricante: {self.vendor}\n\
Produto: {self.product}\nVersão: {self.version}\n\
CPE: "{self.cpe_name}"'
        )
        print(f"IP: {self.host_ip}")
        for item in self.process_by_ports.items():
            print(f"Porta: {item[0]} Nome: {item[1]}")
        print(f"Portas abertas: {self.open_ports}")
