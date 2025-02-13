import psutil
import pytest
from mock import MagicMock, patch
from app.extract_rede_info import ExtractRedeInfo


# Objeto simulando sconn do psutil
class MockSnicaddr:
    def __init__(self, family, address, netmask, broadcast, ptp):
        self.family = family
        self.address = address
        self.netmask = netmask
        self.broadcast = broadcast
        self.ptp = ptp


def test_caso_extract_ports():
    instance = ExtractRedeInfo()

    mock_interfaces = {
        "eth0": [
            MockSnicaddr(
                "AF_INET", "172.17.0.2", "255.255.0.0", "172.17.255.255", None
            ),
            MockSnicaddr(
                "AF_PACKET", "02:42:ac:11:00:02", None, "ff:ff:ff:ff:ff:ff", None
            ),
        ]
    }
    with patch(
        "psutil.net_if_addrs",
        return_value=mock_interfaces,
    ):

        result = instance.extract_ip()
        assert result == "172.17.0.2"

def test_caso_extract_ports_com_retorno_nulo():
    instance = ExtractRedeInfo()

    mock_interfaces = {
        "eth0": None
    }
    with patch(
        "psutil.net_if_addrs",
        return_value=mock_interfaces,
    ):

        result = instance.extract_ip()
        assert result == ""
