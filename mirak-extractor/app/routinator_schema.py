from app.validators import is_enum,is_ip_port,is_list_of, is_path, is_string
"""
    Responsible for defining and validating the Routinator configuration schema.

    This class stores a dictionary (`schema`) that maps each configuration key allowed in the `routinator.conf` file to a corresponding validation function.
    Each function is responsible for verifying whether the value associated with the key conforms to the expected type or set of values.

    The class can be used to validate configuration objects loaded from files, ensuring compliance with Routinator requirements.

    Attributes:
        schema (dict): Dictionary where the keys are configuration names and the values ​​are functions that receive a value and return True if the value is valid, or False otherwise.

    Example:
        >>> schema = RoutinatorSchema()
        >>> config = load_config("/etc/routinator/routinator.conf")
        >>> for key, value in config.items():
        >>>     if key in schema.schema:
        >>>         if not schema.schema[key](value):
        >>>             print(f"Valor inválido para '{key}': {value}")
        >>>     else:
        >>>         print(f"Chave desconhecida: {key}")
    """
schema = {
    "repository-dir": is_path,
    "no-rir-tals": lambda v: isinstance(v, bool),
    "tals": is_list_of(is_string),
    "extra-tals-dir": is_path,
    "exceptions": is_list_of(is_path),
    "strict": lambda v: isinstance(v, bool),
    "stale": is_enum(["reject", "warn", "accept"]),
    "allow-dubious-hosts": lambda v: isinstance(v, bool),
    "disable-rsync": lambda v: isinstance(v, bool),
    "rsync-command": is_string,
    "rsync-args": is_list_of(is_string),
    "rsync-count": lambda v: isinstance(v, int),
    "validation-threads": lambda v: isinstance(v, int),
    "refresh": lambda v: isinstance(v, int),
    "retry": lambda v: isinstance(v, int),
    "expire": lambda v: isinstance(v, int),
    "history-size": lambda v: isinstance(v, int),
    "rtr-listen": is_list_of(is_ip_port),
    "http-listen": is_list_of(is_ip_port),
    "log-level": is_enum(["off", "error", "warn", "info", "debug"]),
    "log": is_enum(["stderr", "syslog", "file", "default"]),
    "syslog-facility": is_string,
    "log-file": is_path,
    "pid-file": is_path,
    "working-dir": is_path,
    "chroot": is_path,
    "tal-labels": lambda v: isinstance(v, list),
    "tal-dir":   is_path,
}