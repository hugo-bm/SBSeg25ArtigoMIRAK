import pytest
from app.report import Report


def teste_caso_obter_o_sistema_operacional():
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

    assert instance.get_os_product() == "ubuntu"

def teste_caso_obter_o_sistema_operacional_sem_sistema_armazenado():
    instance = Report()
    softwares = [
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

    assert instance.get_os_product() == ""
