import pytest
from app.report import Report


def teste_caso_adicionar_informacoes_de_rede():
    instance = Report()
    rede = {
        "hostIP": "172.25.232.77",
        "openPorts": [8080, 22],
        "portsUseBy": {8080: "web", 22: "ssh"},
    }
    instance.add_rede_external(
        rede.get("hostIP"), rede.get("openPorts"), rede.get("portsUseBy")
    )

    assert (
        instance.get_report_dict().get("redeExternal").get("hostIP")
        == "172.25.232.77"
    )
    assert (
        instance.get_report_dict().get("redeExternal")
        .get("portsUseBy").get(8080)
        == "web"
    )
