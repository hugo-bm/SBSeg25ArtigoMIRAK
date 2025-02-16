import pytest
from app.report import Report


def teste_caso_adicionar_softwares():
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
            software.get("version"),
            software.get("cpeName"),
        )

    assert instance.get_report_dict().get("appsFound")[0].get("product") == "ubuntu"
    assert instance.get_report_dict().get("appsFound")[1].get("product") == "curl"

def teste_caso_adicionar_softwares_com_correcao_estatica():
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
            "product": "routinator",
            "version": "0.14.0-rc3",
            "cpeName": "cpe:2.3:a:ubuntu-tag_rec-app:routinator:0.14.0-rc3:*:*:*:amd64:*:*:*",
        },
    ]
    for software in softwares:
        instance.add_apps(
            software.get("type"),
            software.get("vendor"),
            software.get("product"),
            software.get("version"),
            software.get("cpeName"),
        )

    assert instance.get_report_dict().get("appsFound")[0].get("product") == "ubuntu"
    assert instance.get_report_dict().get("appsFound")[1].get("vendor") == "nlnetlabs"

