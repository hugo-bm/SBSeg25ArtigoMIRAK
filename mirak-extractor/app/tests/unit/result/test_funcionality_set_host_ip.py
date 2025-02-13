import pytest
from app.result import Result


def teste_caso_adicionar_IPv4_host(capsys):
    instance = Result()
    instance.set_host_ip("172.17.0.2")
    instance.show()
    result = capsys.readouterr()
    assert result.out.split()[7] == "172.17.0.2"

def teste_caso_adicionar_IPv4_host_com_erro():
    instance = Result()
    with pytest.raises(ValueError, match="The ip provided is in an invalid format!"):
        instance.set_host_ip("172.17.0")
        instance.show()