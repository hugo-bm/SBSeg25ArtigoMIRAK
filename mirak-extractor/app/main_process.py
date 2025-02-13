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
This module contains the class responsible for managing the
application flow. The flow consists of extracting information and exporting it
to a file following the MIRAK standard. The class also maintains the
structured information during the process steps.
"""
import sys
import json
import re
import typer
from tqdm import tqdm
from app.apps_found import AppsFound
from app.apps import Apps
from app.result import Result
from app.report import Report
from app.extract_os_info import ExtractOsInfo
from app.extract_rede_info import ExtractRedeInfo


def progress_bar(total: float):
    """
    This function aims to create a progress bar. To do this, it uses the "tqdm"
    module to create an instance responsible for creating and managing the
    progress bar on the screen.
    Input: total -> max value of progress bar
    output: tqdm -> instance for control
    """
    return tqdm(total=total, bar_format="Progress: {percentage:3.0f}%")


class Process:
    """
    This class contains the methods responsible for managing the main
    application process.
    """
    def start(self, output: str):
        """Initialize the application process"""

        report = Report()
        self.extract_process(report)
        self.export_data(output, report)

    def extract_process(self, report: Report):
        """This method executes the process of extracting and analyzing the
        information present in the RPKI environment and persists the
        information in the Report object. The extraction process begins with
        the operating system information and if it is not possible to find it,
        the user will be contacted to provide such information or cancel the
        process."""

        # Host data collect #########################################
        host_extractor = ExtractOsInfo()
        print("\nStarting OS extraction")
        # ###################### mudança
        files_with_access = host_extractor.is_there_access(
             ["/etc/os-release", "/etc/lsb-release", "/etc/issue"]
        )

        result = Result()
        if len(files_with_access) != 0:
            for file in files_with_access:
                if "os-release" in file:
                    try:
                        product, version = host_extractor \
                            .extract_from_os_release()

                        result.set_os_info(product, version)
                        print(f"\nOperating system detected: {result.product}" +
                            f" version {result.version}\n")
                        break
                    except Exception as ex:
                        print(f"Error: {ex}")
                        continue
                elif "lsb-release" in file:
                    try:
                        product, version = host_extractor \
                            .extract_from_lsb_release()

                        result.set_os_info(product, version)
                        print(f"\nOperating system detected: {result.product}" +
                            f" version {result.version}\n")
                        break
                    except Exception as ex:
                        print(f"Error: {ex}")
                        continue
                elif "issue" in file:
                    try:
                        product, version = host_extractor \
                            .extract_from_issue()

                        result.set_os_info(product, version)
                        print(f"\nOperating system detected: {result.product}" +
                            f" version {result.version}\n")
                        break
                    except Exception as ex:
                        print(f"Error: {ex}")
                        break
        if result.product == "":
            try:
                print("Unable to find operating system information")
                typer.confirm("Would you like to enter this host's operating" +
                              " system information manually?", abort=True)
                product_list = ["enterprise", "ubuntu", "debian"]
                while True:
                    print("Please, select your distributor below:")
                    print("1) Redhat\n2) Canonical\n3) Debian")
                    vendor__number = typer.prompt("Enter the number of the" +
                                                  " desired option")
                    print(vendor__number)
                    if int(vendor__number) in [1, 2, 3]:
                        product = product_list[int(vendor__number) - 1]
                        break
                while True:
                    version = typer.prompt("Now enter the product version")

                    if re.match(r"^\d+(\.\d+){0,2}$", version):
                        break

                    print("The version provided is not in a valid standard (" +
                          "1 or 1.0 or 1.0.0), please try again.")

                result.set_os_info(product, version)
            except Exception:
                print(f"Error: user cancel the operation")
                sys.exit(0)

        report.add_apps(
            result.type,
            result.vendor,
            result.product,
            result.version,
            result.cpe_name
        )
        # Applications data collect ####################################
        app = AppsFound()
        print("Starting to extract the applications")
        softwares = app.locate_apps(report.get_os_product())

        apps = Apps()
        status_bar = progress_bar(len(softwares))
        for item in softwares:
            apps.add_app(item)
            status_bar.update(1)

        status_bar.close()
        for app in apps.get_apps_list():
            report.add_apps(
                app.get("type"),
                app.get("vendor"),
                app.get("product"),
                app.get("version"),
                app.get("cpe_name"),
            )

        #  external network information is extracted #################################
        rede = ExtractRedeInfo()
        result.set_host_ip(rede.extract_ip())
        ports, process_names = rede.extract_ports()
        result.set_ports(ports)
        result.set_ports_by_process(process_names)
        report.add_rede_external(
            result.host_ip, result.open_ports, result.process_by_ports
        )

    def export_data(self, output: str, report: Report):
        """
        This function exports the information contained in the Report object
        to a JSON file.
        """
        with open(output, "w") as json_file:
            json.dump(
                report.get_report_dict(),
                json_file,
                indent=4,
                ensure_ascii=False
            )
        print(f"\nFile exported on '{output}'")
