import pytest
from mock import patch
from app.extract_os_info import ExtractOsInfo




def test_arquivos_acessiveis_todos_legiveis():
    instance = ExtractOsInfo()
    files = ["os-release", "file.txt", "file.csv"]

    # Simula que todos os arquivos são acessíveis
    with patch("os.access", return_value=True):
        result = instance.is_there_access(files)
        assert result == files  # Todos os arquivos devem estar na lista

def test_arquivos_acessiveis_ninguem_legivel():
    instance = ExtractOsInfo()
    files = ["os-release", "file.txt", "file.csv"]

    # Simula que nenhum arquivo é acessível
    with patch("os.access", return_value=False):
        result = instance.is_there_access(files)
        assert not result  # Lista vazia, nenhum arquivo acessível

def test_arquivos_acessiveis_alguns_legiveis():
    instance = ExtractOsInfo()
    files = ["os-release", "file.txt", "file.csv"]

    # Simula que apenas o arquivo2.txt é acessível
    def mock_os_access(path, mode):
        return path == "file.txt"

    with patch("os.access", side_effect=mock_os_access):
        result = instance.is_there_access(files)
        assert result == ["file.txt"]
