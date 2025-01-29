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

import sys
from pathlib import Path
from app.cli import main as cli_main


def main():
    # Add the package directory to sys.path
    package_path = Path(__file__).resolve().parent / "src"
    if str(package_path) not in sys.path:
        sys.path.insert(0, str(package_path))

    # Import and run the main module
    cli_main()


if __name__ == "__main__":
    main()
