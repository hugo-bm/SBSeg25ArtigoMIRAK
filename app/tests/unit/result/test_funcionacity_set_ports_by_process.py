import pytest
from app.result import Result

def test_caso_adicionar_portas_e_processos():
    instance = Result()
    instance.set_ports_by_process({22: "ssh", 8080: "http"})
    result = instance.process_by_ports
    assert result.get(22) == "ssh"

def test_caso_mostrar_portas_e_processos(capsys):
    instance = Result()
    instance.set_ports_by_process({22: "ssh", 8080: "http"})
    ports = instance.process_by_ports
    instance.show()
    result = capsys.readouterr()
    assert result.out.split()[14] == ports.get(8080)
