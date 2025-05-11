from typing import List, Optional
import tomli
import os

class RoutinatorConfigReader:
    """
    Responsible for reading and interpreting the Routinator configuration file.

    This class provides methods to load and validate the contents of the Routinator
    configuration file, returning structured data in dictionary form. If errors occur during
    reading or validation, they are stored in a list provided by the user.

    Example:
        >>> errors = []
        >>> reader = RoutinatorConfigReader()
        >>> config = reader.get_config("/etc/routinator/routinator.conf", errors)
        >>> if errors:
        ...     print("Erros encontrados:", errors)
        >>> else:
        ...     print("Configurações carregadas com sucesso:", config)
    """

    def get_config(self, path: str,errors: List[str]) -> Optional[dict]:
        """
    Reads and parses the Routinator configuration file.

    Reads the specified file, validates its basic contents, and returns a dictionary
    representing the settings found. Any errors encountered during
    reading or validation are added to the provided list.

    Args:
        path (str): Absolute path to the configuration file.
        errors (list): List where detected errors will be stored.

    Returns:
        dict: A dictionary representing valid Routinator settings.

    Raises:
        FileNotFoundError: If the file is not found.
        ValueError: If the file contents are invalid.

    Example:
        >>> errors = []
        >>> reader = RoutinatorConfigReader()
        >>> config = reader.get_config("/etc/routinator/routinator.conf", errors)
        >>> if errors:
        ...     print("Erros encontrados:", errors)
        >>> else:
        ...     print("Configurações carregadas com sucesso:", config)

    """
        if not os.path.exists(path):
            errors.append(f"Config file for Routinator not found on {path}")
            return None

        try:
            with open(path, "rb") as f:
                return tomli.load(f)
        except tomli.TOMLDecodeError as e:
            errors.append(f"Error on parsing TOML: {e}")
            return None