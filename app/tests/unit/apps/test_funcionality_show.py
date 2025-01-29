import pytest
from mock import mock_open, patch
from app.apps import Apps


def teste_caso_show(capsys):

    instance = Apps()
    softwares = [["curl", "haxx", "3.3.4"], ["curl", "haxx", "3.3.4", "arm64"],
                 ["curl", "haxx", "3.3.4"]]
    expected_content = """Aplicações encontradas:
Tipo: a Vendor: haxx
Product: curl Version: 3.3.4
CPE: cpe:2.3:a:haxx:curl:3.3.4:*:*:*:*:*:*:*

Tipo: a Vendor: haxx
Product: curl Version: 3.3.4
CPE: cpe:2.3:a:haxx:curl:3.3.4:*:*:*:arm64:*:*:*

Tipo: a Vendor: haxx
Product: curl Version: 3.3.4
CPE: cpe:2.3:a:haxx:curl:3.3.4:*:*:*:*:*:*:*
"""

    for software in softwares:
        instance.add_app(software)
    instance.show()
    result = capsys.readouterr()

    assert result.out.split()[3].strip() == expected_content.split()[3].strip()

def teste_caso_show_vazio(capsys):

    instance = Apps()
    instance.show()
    result = capsys.readouterr()

    assert result.out.strip() == "Aplicações encontradas:"
