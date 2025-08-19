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

"""


import socket
import psutil


class ExtractRedeInfo:
    """The class implements methods that extract relevant information from the
    host about network communication."""

    def extract_ports(self) -> "tuple":
        """This method returns information about all ports in listening state.
        This information includes a list of ports and a dictionary that
        describes the port and process relationship."""
        open_ports: "list[int]" = []
        ports_by_porcess_name: "dict[int, str]" = {}
        # Get all connections
        connections = psutil.net_connections()
        # Filter connections in 'LISTEN' state
        for conn in connections:
            if conn.status == "LISTEN":
                pid = conn.pid  # Get the process identifier
                process_name = psutil.Process(pid).name() if pid else "N/A"
                if isinstance(conn.laddr, tuple):
                    port = conn.laddr[1]  # type: ignore
                else:
                    port = conn.laddr.port
                open_ports.append(port)
                ports_by_porcess_name[int(port)] = process_name
        return tuple([open_ports, ports_by_porcess_name])

    def extract_ip(self) -> str:
        """
        Returns the first valid IPv4 address of the host machine.
        Works with both legacy (eth0) and modern (enp0s3, ens33, etc.)
        network interface naming conventions.
        """
        nics = psutil.net_if_addrs()
        for nic_name, addrs in nics.items():
            # Skip loopback interface
            if nic_name == "lo":
                continue
            for addr in addrs:
                if addr.family == socket.AF_INET:  # Only IPv4
                    ip = addr.address
                    if ip and not ip.startswith("127."): # Ignore IP address "127.0.0.1"
                        return ip

        return ""  # No valid IPv4 found
