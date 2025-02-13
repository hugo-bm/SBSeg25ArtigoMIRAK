import pytest
from app.result import Result

def teste_caso_adicionar_portas_logicas():
    instance = Result()
    instance.set_ports([22, 3333, 8080])
    result = instance.open_ports
    assert len(result) == 3
