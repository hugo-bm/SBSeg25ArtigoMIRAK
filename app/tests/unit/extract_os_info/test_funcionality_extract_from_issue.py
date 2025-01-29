import pytest
from mock import mock_open, patch
from app.extract_os_info import ExtractOsInfo


def teste_caso_arquivo_com_dados_corretos():

    instance = ExtractOsInfo()
    # Conteúdo simulados
    content = """Ubuntu 16.04.6 LTS \n \\l"""

    with patch("builtins.open", mock_open(read_data=content)):
        result = instance.extract_from_issue()

        assert result == ("ubuntu", "16.04.6")

def teste_caso_arquivo_com_dados_incorretos_os():

    instance = ExtractOsInfo()
    # Conteúdo simulados - informação Ubuntu retirada
    content = """ 16.04.6 LTS \n \\l"""

    with patch("builtins.open", mock_open(read_data=content)):
        with pytest.raises(Exception, match="Required information not found!"):
            instance.extract_from_issue()

def teste_caso_arquivo_com_dados_incorretos_version():

    instance = ExtractOsInfo()
    # Conteúdo simulados - informação 16.04.6 retirada
    content = """Ubuntu  LTS \n \\l"""
    with patch("builtins.open", mock_open(read_data=content)):
        with pytest.raises(Exception, match="Required information not found!"):
            instance.extract_from_issue()

