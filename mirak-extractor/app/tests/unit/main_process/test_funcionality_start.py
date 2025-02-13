import pytest
from mock import patch
from app.main_process import Process
from app.report import Report


def teste_caso_inicializnado_processo():
    instance = Process()

    with patch('app.main_process.Process.extract_process') as mock_extract, \
         patch(
             'app.main_process.Process.export_data') as mock_export:
        instance.start(".mirak.json")
        mock_extract.assert_called_once()
        mock_export.assert_called_once()
