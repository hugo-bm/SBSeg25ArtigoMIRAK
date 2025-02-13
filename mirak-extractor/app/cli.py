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
This file contains the functions that allow initializing the CLI interface and
the main flow of the artifacts.
"""

import typer
from app.main_process import Process

app = typer.Typer()


@app.command()
def cli_start(
    output: str = typer.Option("./mirak.json", envvar="MIRAK_OUTPUT_REPORT")
):
    """
    This function loads the information received from the user to start the
    main process. If there is no information, the directory where the function
    starts and the file named mirak will be used. It also receives the
    information through environment variables.
    """
    core = Process()
    core.start(output)


def main():
    """
    This function initializes CLI interface
    """
    typer.run(cli_start)


if __name__ == "__main__":
    main()
