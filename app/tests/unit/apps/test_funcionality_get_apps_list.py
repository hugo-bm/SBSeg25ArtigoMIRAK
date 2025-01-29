import pytest
from mock import mock_open, patch
from app.apps import Apps


def teste_caso_obter_software():

    instance = Apps()
    softwares = [["curl", "haxx", "3.3.4"], ["curl", "haxx", "3.3.4", "arm64"],
                ["curl", "haxx", "3.3.4"]]

    for software in softwares:
        instance.add_app(software)
    result = instance.get_apps_list()
    assert len(result) == 3

def teste_caso_obter_software_vazio():

    instance = Apps()
    result = instance.get_apps_list()
    assert not result
