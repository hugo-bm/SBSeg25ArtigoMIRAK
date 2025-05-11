from typing import Dict, List
from app.routinator_schema import schema
from app.routinator_config_reader import RoutinatorConfigReader

def validate_config(config: Dict) -> List[str]:
    """
    Validates a Routinator configuration dictionary based on the defined schema.

    This function checks for:
    - Presence of mandatory keys ("repository-dir", "rtr-listen", "http-listen").
    - Existence of unexpected keys not defined in the schema.
    - Validation of values ​​based on the functions specified in the schema.

    Args:
        config (Dict): A dictionary containing the keys and values ​​loaded from the Routinator configuration file.

    Returns:
        List[str]: A list of error messages describing each problem found.
        The list will be empty if all configurations are valid.

    Example:
        >>> config = {
        ...     "repository-dir": "/var/lib/routinator",
        ...     "rtr-listen": ["127.0.0.1:3323"],
        ...     "http-listen": ["127.0.0.1:9556"],
        ... }
        >>> errors = validate_config(config)
        >>> if errors:
        ...     for err in errors:
        ...         print(err)
    """
    errors = []
    config_keys = list(config.keys())
    required_keys = ["repository-dir", "rtr-listen", "http-listen"]


    # Mandatory configuration
    for key in required_keys:
        if key not in config_keys:
            errors.append(f"Missing mandatory configuration: '{key}'")
    
    # Unexpected configuration
    unexpected_keys = set(config.keys()) - set(schema.keys())
    for key in unexpected_keys:
        errors.append(f"Unexpected configuration key: '{key}'")

    for key, validator in schema.items():
        if key not in config:
            continue  

        value = config[key]
        if not validator(value):
            errors.append(f"Invalid value for '{key}': {value}")

    return errors

def main():
    """
    Principal script for module test
    """
    reader = RoutinatorConfigReader()
    errors: List[str] = []
    config = reader.get_config("/etc/routinator/routinator.conf", errors)
    if config is not None:
        errors.extend(validate_config(config))
        if errors:
            print("Config validation failed:")
            for err in errors:
                print(f" - {err}")
        else:
            print("Configuration is valid!")
    else: 
        if errors:
            print("Config validation failed:")
            for err in errors:
                print(f" - {err}")

if __name__ == "__main__":
    main()