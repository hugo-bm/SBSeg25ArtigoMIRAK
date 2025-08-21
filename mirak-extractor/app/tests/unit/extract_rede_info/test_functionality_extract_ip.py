import socket
import pytest
from mock import patch
from app.extract_rede_info import ExtractRedeInfo


# Mock the object returned by "psutil.net_if_addrs"
class MockSnicaddr:
    def __init__(self, family, address, netmask=None, broadcast=None, ptp=None):
        self.family = family
        self.address = address
        self.netmask = netmask
        self.broadcast = broadcast
        self.ptp = ptp


@pytest.mark.parametrize(
    "mock_interfaces,expected",
    [
        # 1. Expected case - valid IPv4
        (
            {
                "eth0": [
                    MockSnicaddr(socket.AF_INET, "172.17.0.2", "255.255.0.0", "172.17.255.255", None),
                    MockSnicaddr(socket.AF_PACKET, "02:42:ac:11:00:02", None, None, None),
                ]
            },
            "172.17.0.2",
        ),
        # 2. Case - Interface without IPv4 (MAC only)
        (
            {"eth0": [MockSnicaddr(socket.AF_PACKET, "02:42:ac:11:00:02")]},
            "",
        ),
        # 3. Case - Modern Interface (name enp0s3)
        (
            {"enp0s3": [MockSnicaddr(socket.AF_INET, "192.168.0.10", "255.255.255.0")]},
            "192.168.0.10",
        ),
        # 4. Case - Multiple interfaces (ignore loopback)
        (
            {
                "lo": [MockSnicaddr(socket.AF_INET, "127.0.0.1", "255.0.0.0")],
                "eth0": [MockSnicaddr(socket.AF_INET, "10.0.0.5", "255.0.0.0")],
            },
            "10.0.0.5",
        ),
        # 5. Case - Loopback only
        (
            {"lo": [MockSnicaddr(socket.AF_INET, "127.0.0.1", "255.0.0.0")]},
            "",
        ),
        # 6. Case - No interface
        (
            {},
            "",
        ),
        # 7. Case - Multiple IPv4 on the same interface (take the first one)
        (
            {
                "eth0": [
                    MockSnicaddr(socket.AF_INET, "192.168.0.10", "255.255.255.0"),
                    MockSnicaddr(socket.AF_INET, "10.0.0.5", "255.0.0.0"),
                ]
            },
            "192.168.0.10",
        ),
        # 8. Case - IPv6-only interface
        (
            {"eth0": [MockSnicaddr(socket.AF_INET6, "fe80::1ff:fe23:4567:890a")]},
            "",
        ),
    ],
)
def test_extract_ip(mock_interfaces, expected):

    instance = ExtractRedeInfo()

    with patch("psutil.net_if_addrs", return_value=mock_interfaces):
        result = instance.extract_ip()
        assert result == expected
