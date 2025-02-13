import psutil
import pytest
from mock import MagicMock, patch
from app.extract_rede_info import ExtractRedeInfo


# Objeto simulando sconn do psutil
class MockSconn:
    def __init__(self, fd, family, type_, laddr, raddr, status, pid):
        self.fd = fd
        self.family = family
        self.type = type_
        self.laddr = laddr
        self.raddr = raddr
        self.status = status
        self.pid = pid


def test_caso_extract_ports():
    instance = ExtractRedeInfo()

    def mock_process(pid):
        process_mock = MagicMock()
        if pid == 13471:
            process_mock.name.return_value = "Processo1"
        elif pid == 13472:
            process_mock.name.return_value = "Processo2"
        else:
            raise psutil.NoSuchProcess(pid)
        return process_mock

    # Simula que todos os arquivos são acessíveis
    with patch(
        "psutil.net_connections",
        return_value=[
            MockSconn(
                4, "AF_INET", "SOCK_STREAM", ("0.0.0.0", 3323), (),
                   "LISTEN", 13471
            ),
            MockSconn(
                5, "AF_INET", "SOCK_STREAM", ("0.0.0.0", 8323), (),
                   "LISTEN", 13471
            ),
            MockSconn(
                6, "AF_INET", "SOCK_STREAM", ("0.0.0.0", 9323), (),
                   "CLOSE_WAIT", 13472
            ),
        ],
    ),  patch("psutil.Process", side_effect=mock_process):

        result_1, result_2 = instance.extract_ports()
        assert result_1[0] == 3323
        assert result_2.get(3323) == "Processo1"
