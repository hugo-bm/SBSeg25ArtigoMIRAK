import pytest
from mock import mock_open, patch
from app.extract_os_info import ExtractOsInfo


def teste_caso_arquivo_com_dados_corretos():

    instance = ExtractOsInfo()
    # Conteúdo simulados
    content = """NAME="Ubuntu"
VERSION="16.04.7 LTS (Xenial Xerus)"
ID=ubuntu
ID_LIKE=debian
PRETTY_NAME="Ubuntu 16.04.7 LTS"
VERSION_ID="16.04"
HOME_URL="http://www.ubuntu.com/"
SUPPORT_URL="http://help.ubuntu.com/"
BUG_REPORT_URL="http://bugs.launchpad.net/ubuntu/"
VERSION_CODENAME=xenial
UBUNTU_CODENAME=xenial
"""
    with patch("builtins.open", mock_open(read_data=content)):
        result = instance.extract_from_os_release()

        assert result == ("ubuntu", "16.04")

def teste_caso_arquivo_com_dados_incorretos():

    instance = ExtractOsInfo()
    # Conteúdo simulados - informação ID retirada
    content = """NAME="Ubuntu"
VERSION="16.04.7 LTS (Xenial Xerus)"
ID_LIKE=debian
PRETTY_NAME="Ubuntu 16.04.7 LTS"
VERSION_ID="16.04"
HOME_URL="http://www.ubuntu.com/"
SUPPORT_URL="http://help.ubuntu.com/"
BUG_REPORT_URL="http://bugs.launchpad.net/ubuntu/"
VERSION_CODENAME=xenial
UBUNTU_CODENAME=xenial
"""
    with patch("builtins.open", mock_open(read_data=content)):
        with pytest.raises(Exception, match="Required information not found!"):
            instance.extract_from_os_release()

def teste_caso_arquivo_com_dados_incorretos_linhas_vazias():

    instance = ExtractOsInfo()
    content = """NAME="Ubuntu"
VERSION="16.04.7 LTS (Xenial Xerus)"
ID_LIKE=debian
PRETTY_NAME="Ubuntu 16.04.7 LTS"
VERSION_ID="16.04"

HOME_URL="http://www.ubuntu.com/"
SUPPORT_URL="http://help.ubuntu.com/"
BUG_REPORT_URL="http://bugs.launchpad.net/ubuntu/"
VERSION_CODENAME=xenial
UBUNTU_CODENAME=xenial
"""
    with patch("builtins.open", mock_open(read_data=content)):
        with pytest.raises(Exception, match="Required information not found!"):
            instance.extract_from_os_release()
