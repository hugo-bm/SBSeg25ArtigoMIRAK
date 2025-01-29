import pytest
from app.result import Result


def teste_caso_adicionar_sistema_operacional_ubuntu(capsys):
    instance = Result()
    instance.set_os_info("ubuntu", "20.04")
    instance.show()
    result = capsys.readouterr()
    print(result)
    assert result.out.split()[3] == "canonical"

def teste_caso_adicionar_sistema_operacional_rhel(capsys):
    instance = Result()
    instance.set_os_info("rhel", "9")
    instance.show()
    result = capsys.readouterr()
    print(result)
    assert result.out.split()[3] == "redhat"

def teste_caso_adicionar_sistema_operacional_debian(capsys):
    instance = Result()
    instance.set_os_info("debian", "10")
    instance.show()
    result = capsys.readouterr()
    print(result)
    assert result.out.split()[3] == "debian"
