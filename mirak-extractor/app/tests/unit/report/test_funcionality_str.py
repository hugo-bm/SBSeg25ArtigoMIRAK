import pytest
from app.report import Report


def teste_caso_obter_saida_classe_em_string():
    instance = Report()
    softwares = [
        {
            "type": "o",
            "vendor": "canonical",
            "product": "ubuntu",
            "version": "20.04",
            "cpeName": "cpe:2.3:o:canonical:ubuntu_linux:20.04:*:*:*:*:*:*:*",
        },
        {
            "type": "a",
            "vendor": "ubuntu-tag_rec-app",
            "product": "curl",
            "version": "7.68.0-1ubuntu2.23",
            "cpeName": "cpe:2.3:a:ubuntu-tag_rec-app:curl:7.68.0-1ubuntu2.23:*:*:*:amd64:*:*:*",
        },
    ]
    for software in softwares:
        instance.add_apps(
            software.get("type"),
            software.get("vendor"),
            software.get("product"),
            software.get("versio"),
            software.get("cpeName"),
        )

    rede = {
        "hostIP": "172.25.232.77",
        "openPorts": [8080, 22],
        "portsUseBy": {8080: "web", 22: "ssh"},
    }
    instance.add_rede_external(
        rede.get("hostIP"), rede.get("openPorts"), rede.get("portsUseBy")
    )

    result = str(instance).split("'")

    assert result[49] == "web"
    assert result[51] == "ssh"
    assert result[31] == "curl"
