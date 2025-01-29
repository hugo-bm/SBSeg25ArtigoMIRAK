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

Module responsible for creating the artifact setup process.

"""

from setuptools import setup, find_packages


setup(
    # Package name
    name="mirak-extractor",
    # Package version
    version="1.0.0",
    # Author name
    author="Hugo Batalha Moreno",
    # Author e-mail
    author_email="hugomb123@hotmail.com",
    # Project Description
    description="Este software extrai informações relevantes sobre o ambiente \
          de execução e da Solução RPKI (Foco no Routinator)",
    # Long description (usually the README)
    long_description=open("./README.md", encoding="utf8").read(),
    # Long Description Content Type
    long_description_content_type="text/markdown",
    # Project URL
    # url="https://github.com/seuusuario/myproject",
    include_package_data=True,
    py_modules=["start", "app"],
    # Automates discovery of Python packages in the project
    packages=find_packages(),
    install_requires=["typer", "psutil", "tqdm"],
    entry_points={
        "console_scripts": [
            "mirak-extractor=start:main",  # Run 'main' in 'my_package.cli'
        ],
    },
    # Classifications for the package (e.g., supported Python version)
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    # Minimum Python version required
    python_requires=">=3.8",
)
