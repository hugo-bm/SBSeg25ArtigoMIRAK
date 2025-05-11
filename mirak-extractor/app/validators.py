import ipaddress
from typing import Callable, List

def is_string(value: str) -> bool:
    """
    Checks if the given value is a string.

    Args:
        value (str): Value to be checked.

    Returns:
        bool: True if it is a string, False otherwise.
"""
    return isinstance(value, str)

def is_path(value: str) -> bool:
    """
    Checks if the value is a string representing a valid (non-empty) path.

    Args:
        value (str): Path to be validated.

    Returns:
        bool: True if it is a non-empty string, False otherwise.
    """
    return isinstance(value, str) and bool(value.strip())

def is_enum(valid_values: List[str]) -> Callable[[str], bool]:
    """
    Generates a validator function to check if the value belongs to an allowed set.

    Args:
        valid_values (List[str]): List of allowed valid values.

    Returns:
        Callable([[List], bool]): A function that returns True if the value is among the valid values.

"""
    def _inner(value: str) -> bool:
        return value in valid_values
    return _inner

def is_ip_port(value: str) -> bool:
    """
    Checks if the string is in the format 'IP:port' and is valid.

    Args:
        value (str): String containing the IP and port, separated by ':'.

    Returns:
        bool: True if it is a valid IP with port between 1 and 65535, False otherwise.
        
    Example:
        >>> is_ip_port("192.168.0.1:8080")
        True
        >>> is_ip_port("localhost:80")
        False
    """
    if ':' not in value:
        return False
    ip_str, port_str = value.rsplit(':', 1)
    try:
        ipaddress.ip_address(ip_str)
        port = int(port_str)
        return 0 < port < 65536
    except ValueError:
        return False

def is_list_of(fn: Callable[[str], bool]) -> Callable[[List], bool]:
    """
    Generates a validator function for lists, where all items must pass the provided function.

    Args:
        fn (Callable[[str], bool]): Validation function for each item in the list.

    Returns:
        Callable([[List], bool]): Function that returns True if all items in the list are valid.

    Example:
        >>> is_list_of(is_string)(["a", "b", "c"])
        True
        >>> is_list_of(is_string)(["a", 2])
        False
    """
    def _inner(value: List) -> bool:
        return isinstance(value, list) and all(fn(item) for item in value)
    return _inner