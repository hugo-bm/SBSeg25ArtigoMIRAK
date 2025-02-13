import pytest
from mock import mock_open, patch
from app.extract_os_info import ExtractOsInfo


def test_caso_arquivo_com_dados_corretos():

    instance = ExtractOsInfo()
    # Conteúdo simulados
    content = """DISTRIB_ID=Ubuntu
DISTRIB_RELEASE=16.04
DISTRIB_CODENAME=focal
DISTRIB_DESCRIPTION="Ubuntu 16.04.6 LTS"
"""
    with patch("builtins.open", mock_open(read_data=content)):
        result = instance.extract_from_lsb_release()

        assert result == ("ubuntu", "16.04")

def test_caso_arquivo_com_dados_incorretos_DISTRIB_ID():

    instance = ExtractOsInfo()
    # Conteúdo simulados - informação DISTRIB_ID retirada
    content = """
DISTRIB_RELEASE=16.04
DISTRIB_CODENAME=focal
DISTRIB_DESCRIPTION="Ubuntu 16.04.6 LTS"
"""
    with patch("builtins.open", mock_open(read_data=content)):
        with pytest.raises(Exception, match="Required information not found!"):
            instance.extract_from_lsb_release()

def test_caso_arquivo_com_dados_incorretos_DISTRIB_RELEASE():

    instance = ExtractOsInfo()
    # Conteúdo simulados - informação DISTRIB_RELEASE retirada
    content = """DISTRIB_ID=Ubuntu
DISTRIB_CODENAME=focal
DISTRIB_DESCRIPTION="Ubuntu 16.04.6 LTS"

"""
    with patch("builtins.open", mock_open(read_data=content)):
        with pytest.raises(Exception, match="Required information not found!"):
            instance.extract_from_lsb_release()


def test_caso_arquivo_com_dados_incorretos_DISTRIB_RELEASE_linhas_vazias():

    instance = ExtractOsInfo()
    # Conteúdo simulados - informação DISTRIB_RELEASE retirada
    content = """DISTRIB_ID=Ubuntu
DISTRIB_CODENAME=focal

DISTRIB_DESCRIPTION="Ubuntu 16.04.6 LTS"
"""
    with patch("builtins.open", mock_open(read_data=content)):
        with pytest.raises(Exception, match="Required information not found!"):
            instance.extract_from_lsb_release()
