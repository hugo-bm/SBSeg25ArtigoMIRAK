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
This module contains the "Apps" class, which is intended to store a list of
tuples containing the most relevant information to describe a software and
generate a CPE String for each one.
"""


class Apps:
    """Its purpose is to store a list of tuples containing the most
    relevant information for describing a software and generates a CPE String
    for each one."""

    def __init__(self) -> None:
        self.__apps_list: "list[dict[str, str]]" = []

    @staticmethod
    def parse_cpe(part: str, software: "list[str]") -> str:
        """Receives the part/type and a list with the most
        relevant information (vendor, product, version and/or OS architecture)
        and returns this information in a CPE String in the CPE 2.3 standard"""
        if len(software) >= 3:
            return f"cpe:2.3:{part}:{software[1]}:{software[0]}:{software[2]}\
:*:*:*:{software[3] if len(software)>=4  else '*' }:*:*:*"
        return ""

    def add_app(self, software: "list[str]") -> None:
        """This method adds a dictionary-type object with the application data
        to the list. It also evaluates whether it meets the
        MIRAK Schema requirements."""

        if len(software) not in (3, 4):
            raise TypeError("The parameter content is not valid!" +
                            " Lack or excess of required information")

        self.__apps_list.append(
            {
                "type": "a",
                "vendor": software[1],
                "product": software[0],
                "version": software[2],
                "cpe_name": self.parse_cpe("a", software),
            }
        )

    def show(self):
        """Prints all information in object to stdout"""
        print("Aplicações encontradas:")
        if len(self.__apps_list) != 0:
            for app in self.__apps_list:
                print(
                    f"Tipo: {app.get('type')} Vendor: {app.get('vendor')}\
    \nProduct: {app.get('product')} Version: {app.get('version')}\
    \nCPE: {app.get('cpe_name')}\n"
                )

    def get_apps_list(self) -> "list[dict[str, str]]":
        """Returns the list of applications added so far"""
        return self.__apps_list
