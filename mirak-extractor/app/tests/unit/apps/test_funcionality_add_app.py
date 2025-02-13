import pytest
from app.apps import Apps


def teste_caso_adicionar_aplicativo():

    instance = Apps()
    software = ["curl", "haxx", "3.3.4"]

    instance.add_app(software)
    softwares = instance.get_apps_list()
    assert softwares[0].get("product") == "curl"
    assert softwares[0].get("cpe_name") == "cpe:2.3:a:haxx:curl:3.3.4:" +\
                                           "*:*:*:*:*:*:*"

def teste_caso_adicionar_aplicativo_com_erro():

    instance = Apps()
    software = ["curl", "haxx"]
    with pytest.raises(TypeError, match="The parameter content is not valid!" +
                       " Lack or excess of required information"):
        instance.add_app(software)

def teste_caso_adicionar_aplicativo_vazio():

    instance = Apps()
    software = []
    with pytest.raises(TypeError, match="The parameter content is not valid!" +
                       " Lack or excess of required information"):
        instance.add_app(software)

def teste_caso_adicionar_aplicativo_mais_informação():

    instance = Apps()
    software = ["curl", "haxx", "3.3.4", "arm64"]

    instance.add_app(software)
    softwares = instance.get_apps_list()
    assert softwares[0].get("cpe_name") == 'cpe:2.3:a:haxx:curl:3.3.4:*:*:*:arm64:*:*:*'
