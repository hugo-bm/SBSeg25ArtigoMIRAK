import os
import stat
import pwd
import grp


class ExtractFilesDirectoriesInfo:
    """
        Class responsible for collecting information about files and directories
        in the local file system.

        This class provides data such as type (file or directory), permissions,
        owner and group.

        Example:
        >>> files_info = FilesInfo()
        >>> resultado = files_info.get_file_infos(["/etc/passwd", "/home/usuario"])
        >>> from pprint import pprint
        >>> pprint(resultado)
        [
            {
                'type': 'file',
                'fileName': '/etc/passwd',
                'permission': {
                    'owner': 6,
                    'group': 4,
                    'others': 4,
                },
                'owner': {
                    'user': 'root',
                    'group': 'root'
                }
            },
            {
                'type': 'directory',
                'fileName': '/home/usuario',
                'permission': {
                    'owner': 7,
                    'group': 5,
                    'others': 5,
                },
                'owner': {
                    'user': 'usuario',
                    'group': 'usuario'
                }
            }
        ]
    """

    def __get_file_info(self, path: str) -> "dict":
        """
        Collects information about a file or directory.

    This method detects whether the given path points to a file or directory, 
    and retrieves its permissions, owner, and group.

    Args:
        path (str): The absolute or relative path to a file or directory.

    Returns:
        dict: A dictionary containing the keys:
              - 'type' (str): 'file' or 'directory'
              - 'fileName' (str): The file or directory name
              - 'permission' (dict): Permission details
              - 'owner' (dict): Contains 'user' and 'group'

    Raises:
        FileNotFoundError: If the provided path does not exist.
        """
        try:
            # Verificar se é arquivo ou diretório
            if os.path.isdir(path):
                tipo = "directory"
            elif os.path.isfile(path):
                tipo = "file"
            else:
                return None
            # Obter informações do arquivo/diretório
            file_stat = os.stat(path)
            # Converte o valor das permições para o formato octeto sem lixo
            permissions = str(oct(stat.S_IMODE(file_stat.st_mode))[-3:])

            # User of the file/directory owner.
            user_owner_name = pwd.getpwuid(file_stat.st_uid).pw_name
            
            # Group of the file/directory owner.
            group_owner_name = grp.getgrgid(file_stat.st_gid).gr_name
            
            dict_owner = {
                "user": user_owner_name,
                "group": group_owner_name
            }
            dict_perm = {
                "group": int(permissions[1]),
                "owner": int(permissions[0]),
                "others": int(permissions[2]),
            }
            return {"type": tipo, "fileName": path, "permission": dict_perm, "owner": dict_owner}

        except FileNotFoundError:
            print(f"O caminho {path} não foi encontrado.")

    def get_important_files_or_directories(
            self,
            paths: "list[str]"
            ) -> "list[dict]":
        """
            Collects file and directory information from a list of paths.

            Args:
                paths (List[str]): List of absolute paths to be analyzed.

            Returns:
                List([Dict[str, Any]]): List of dictionaries with information about
                each valid path.
        """
         
        files: "list[dict]" = []
        for path in paths:
            info = self.__get_file_info(path)
            if info is not None:
                files.append(info)
        return files

