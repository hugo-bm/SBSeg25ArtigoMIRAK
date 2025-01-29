import pytest
from app.apps import Apps


def teste_caso_converter_para_cpe():

    assert (
        Apps.parse_cpe("a", ["curl", "haxx", "3.3.4"])
        == "cpe:2.3:a:haxx:curl:3.3.4:" + "*:*:*:*:*:*:*"
    )

def teste_caso_converter_para_cpe_com_erro():
    # Forá removido informações essencias
    assert (
        Apps.parse_cpe("a", ["curl", "haxx"])
        == ""
    )
