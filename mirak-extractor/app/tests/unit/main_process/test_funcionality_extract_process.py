import pytest
from mock import patch
from app.main_process import Process
from app.report import Report


def teste_caso_criacao_processo_extração_correto_os_release():
    instance = Process()
    instance2 = Report()
    return_files = ["os-release"]
    return_os = ("ubuntu", "20.04")
    return_apps = [['ca-certificates', 'ubuntu-tag_rec-app', '20230311ubuntu0.20.04.1', 'all']]
    return_ip = "172.25.232.77"
    return_ports = ([8080, 53], {8080: 'WEB', 53: 'DNS'})

    with patch(
        'app.extract_os_info.ExtractOsInfo.is_there_access',
        return_value=return_files
          ), \
         patch(
             'app.extract_os_info.ExtractOsInfo.extract_from_os_release',
            return_value=return_os
            ), \
         patch(
            'app.apps_found.AppsFound.locate_apps',
            return_value=return_apps
            ), \
         patch(
            'app.extract_rede_info.ExtractRedeInfo.extract_ip',
            return_value=return_ip
            ), \
         patch(
            'app.extract_rede_info.ExtractRedeInfo.extract_ports',
            return_value=return_ports
            ):
        instance.extract_process(instance2)
        assert instance2.get_report_dict().get("appsFound")[0].get("product") == "ubuntu"
        assert instance2.get_report_dict().get("appsFound")[1].get("product") == "ca-certificates"
        assert instance2.get_report_dict().get("redeExternal").get("hostIP") == "172.25.232.77"
        assert instance2.get_report_dict().get("redeExternal").get("openPorts")[0] == 8080
        assert instance2.get_report_dict().get("redeExternal").get("portsUseBy")[53] == "DNS"

def teste_caso_criacao_processo_extração_correto_lsb_release():
    instance = Process()
    instance2 = Report()
    return_files = ["lsb-release"]
    return_os = ("ubuntu", "20.04")
    return_apps = [['ca-certificates', 'ubuntu-tag_rec-app', '20230311ubuntu0.20.04.1', 'all']]
    return_ip = "172.25.232.77"
    return_ports = ([8080, 53], {8080: 'WEB', 53: 'DNS'})

    with patch(
        'app.extract_os_info.ExtractOsInfo.is_there_access',
        return_value=return_files
          ), \
         patch(
             'app.extract_os_info.ExtractOsInfo.extract_from_lsb_release',
            return_value=return_os
            ), \
         patch(
            'app.apps_found.AppsFound.locate_apps',
            return_value=return_apps
            ), \
         patch(
            'app.extract_rede_info.ExtractRedeInfo.extract_ip',
            return_value=return_ip
            ), \
         patch(
            'app.extract_rede_info.ExtractRedeInfo.extract_ports',
            return_value=return_ports
            ):
        instance.extract_process(instance2)
        assert instance2.get_report_dict().get("appsFound")[0].get("product") == "ubuntu"
        assert instance2.get_report_dict().get("appsFound")[1].get("product") == "ca-certificates"
        assert instance2.get_report_dict().get("redeExternal").get("hostIP") == "172.25.232.77"
        assert instance2.get_report_dict().get("redeExternal").get("openPorts")[0] == 8080
        assert instance2.get_report_dict().get("redeExternal").get("portsUseBy")[53] == "DNS"

def teste_caso_criacao_processo_extração_correto_issue():
    instance = Process()
    instance2 = Report()
    return_files = ["issue"]
    return_os = ("ubuntu", "20.04.1")
    return_apps = [['ca-certificates', 'ubuntu-tag_rec-app', '20230311ubuntu0.20.04.1', 'all']]
    return_ip = "172.25.232.77"
    return_ports = ([8080, 53], {8080: 'WEB', 53: 'DNS'})

    with patch(
        'app.extract_os_info.ExtractOsInfo.is_there_access',
        return_value=return_files
          ), \
         patch(
             'app.extract_os_info.ExtractOsInfo.extract_from_issue',
            return_value=return_os
            ), \
         patch(
            'app.apps_found.AppsFound.locate_apps',
            return_value=return_apps
            ), \
         patch(
            'app.extract_rede_info.ExtractRedeInfo.extract_ip',
            return_value=return_ip
            ), \
         patch(
            'app.extract_rede_info.ExtractRedeInfo.extract_ports',
            return_value=return_ports
            ):
        instance.extract_process(instance2)
        assert instance2.get_report_dict().get("appsFound")[0].get("product") == "ubuntu"
        assert instance2.get_report_dict().get("appsFound")[1].get("product") == "ca-certificates"
        assert instance2.get_report_dict().get("redeExternal").get("hostIP") == "172.25.232.77"
        assert instance2.get_report_dict().get("redeExternal").get("openPorts")[0] == 8080
        assert instance2.get_report_dict().get("redeExternal").get("portsUseBy")[53] == "DNS"

def teste_caso_criacao_processo_extração_com_erro_os_release():
    instance = Process()
    instance2 = Report()
    return_files = ["os-release"]
    return_os = None
    return_apps = [['ca-certificates', 'ubuntu-tag_rec-app', '20230311ubuntu0.20.04.1', 'all']]
    return_ip = "172.25.232.77"
    return_ports = ([8080, 53], {8080: 'WEB', 53: 'DNS'})

    with patch(
        'app.extract_os_info.ExtractOsInfo.is_there_access',
        return_value=return_files
          ), \
         patch(
             'app.extract_os_info.ExtractOsInfo.extract_from_os_release',
            return_value=return_os
            ), \
         patch(
            'app.apps_found.AppsFound.locate_apps',
            return_value=return_apps
            ), \
         patch(
            'app.extract_rede_info.ExtractRedeInfo.extract_ip',
            return_value=return_ip
            ), \
         patch(
            'app.extract_rede_info.ExtractRedeInfo.extract_ports',
            return_value=return_ports
            ), \
            patch(
                'sys.exit'
            ) as mock_exit, \
            patch("builtins.print") as mock_print:
        instance.extract_process(instance2)
        mock_print.assert_any_call("Error: cannot unpack non-iterable NoneType object")
        mock_exit.assert_called_once_with(0)

def teste_caso_criacao_processo_extração_com_erro_lsb_release():
    instance = Process()
    instance2 = Report()
    return_files = ["lsb-release"]
    return_os = None
    return_apps = [['ca-certificates', 'ubuntu-tag_rec-app', '20230311ubuntu0.20.04.1', 'all']]
    return_ip = "172.25.232.77"
    return_ports = ([8080, 53], {8080: 'WEB', 53: 'DNS'})

    with patch(
        'app.extract_os_info.ExtractOsInfo.is_there_access',
        return_value=return_files
          ), \
         patch(
             'app.extract_os_info.ExtractOsInfo.extract_from_lsb_release',
            return_value=return_os
            ), \
         patch(
            'app.apps_found.AppsFound.locate_apps',
            return_value=return_apps
            ), \
         patch(
            'app.extract_rede_info.ExtractRedeInfo.extract_ip',
            return_value=return_ip
            ), \
         patch(
            'app.extract_rede_info.ExtractRedeInfo.extract_ports',
            return_value=return_ports
            ), \
            patch(
                'sys.exit'
            ) as mock_exit, \
            patch("builtins.print") as mock_print:
        instance.extract_process(instance2)
        mock_print.assert_any_call("Error: cannot unpack non-iterable NoneType object")
        mock_exit.assert_called_once_with(0)

def teste_caso_criacao_processo_extração_com_erro_issue():
    instance = Process()
    instance2 = Report()
    return_files = ["issue"]
    return_os = None
    return_apps = [['ca-certificates', 'ubuntu-tag_rec-app', '20230311ubuntu0.20.04.1', 'all']]
    return_ip = "172.25.232.77"
    return_ports = ([8080, 53], {8080: 'WEB', 53: 'DNS'})

    with patch(
        'app.extract_os_info.ExtractOsInfo.is_there_access',
        return_value=return_files
          ), \
         patch(
             'app.extract_os_info.ExtractOsInfo.extract_from_issue',
            return_value=return_os
            ), \
         patch(
            'app.apps_found.AppsFound.locate_apps',
            return_value=return_apps
            ), \
         patch(
            'app.extract_rede_info.ExtractRedeInfo.extract_ip',
            return_value=return_ip
            ), \
         patch(
            'app.extract_rede_info.ExtractRedeInfo.extract_ports',
            return_value=return_ports
            ), \
            patch(
                'sys.exit'
            ) as mock_exit, \
            patch("builtins.print") as mock_print:
        instance.extract_process(instance2)
        mock_print.assert_any_call("Error: cannot unpack non-iterable NoneType object")
        mock_exit.assert_called_once_with(0)

def teste_caso_criacao_processo_extração_com_erro_sem_arquivo():
    instance = Process()
    instance2 = Report()
    return_files = []
    return_apps = [['ca-certificates', 'ubuntu-tag_rec-app', '20230311ubuntu0.20.04.1', 'all']]
    return_ip = "172.25.232.77"
    return_ports = ([8080, 53], {8080: 'WEB', 53: 'DNS'})

    with patch(
        'app.extract_os_info.ExtractOsInfo.is_there_access',
        return_value=return_files
          ), \
         patch(
            'app.apps_found.AppsFound.locate_apps',
            return_value=return_apps
            ), \
         patch(
            'app.extract_rede_info.ExtractRedeInfo.extract_ip',
            return_value=return_ip
            ), \
         patch(
            'app.extract_rede_info.ExtractRedeInfo.extract_ports',
            return_value=return_ports
            ), \
            patch(
               "typer.confirm",
               return_value="y"
               ) as mock_confirm, \
            patch(
               "typer.prompt",
               return_value="2"
               ) as mock_prompt, \
            patch("builtins.print") as mock_print:
        instance.extract_process(instance2)
        mock_print.assert_any_call("Unable to find operating system information")
        mock_confirm.assert_called_once_with("Would you like to enter this host's operating system information manually?", abort=True)
        mock_prompt.assert_any_call("Enter the number of the desired option")

def teste_caso_processo_extração_com_erro_insercao_erronea(capsys):
    instance = Process()
    instance2 = Report()
    return_files = []
    return_apps = [['ca-certificates', 'ubuntu-tag_rec-app', '20230311ubuntu0.20.04.1', 'all']]
    return_ip = "172.25.232.77"
    return_ports = ([8080, 53], {8080: 'WEB', 53: 'DNS'})

    inputs = ["5", "2", "20.04"]

    with patch(
        'app.extract_os_info.ExtractOsInfo.is_there_access',
        return_value=return_files
          ), \
         patch(
            'app.apps_found.AppsFound.locate_apps',
            return_value=return_apps
            ), \
         patch(
            'app.extract_rede_info.ExtractRedeInfo.extract_ip',
            return_value=return_ip
            ), \
         patch(
            'app.extract_rede_info.ExtractRedeInfo.extract_ports',
            return_value=return_ports
            ), \
            patch(
               "typer.confirm",
               return_value="y"
               ) as mock_confirm, \
            patch(
               "typer.prompt",
               side_effect=inputs
               ) as mock_prompt, \
            patch("builtins.print") as mock_print:
        instance.extract_process(instance2)
        mock_print.assert_any_call("Unable to find operating system information")
        mock_confirm.assert_called_once_with("Would you like to enter this host's operating system information manually?", abort=True)
        mock_prompt.assert_any_call("Enter the number of the desired option")
        assert mock_prompt.call_count == 3

def teste_caso_processo_extração_insercao_erronea_na_versao(capsys):
    instance = Process()
    instance2 = Report()
    return_files = []
    return_apps = [['ca-certificates', 'ubuntu-tag_rec-app', '20230311ubuntu0.20.04.1', 'all']]
    return_ip = "172.25.232.77"
    return_ports = ([8080, 53], {8080: 'WEB', 53: 'DNS'})

    inputs = ["5", "2", "batata", "20.04"]

    with patch(
        'app.extract_os_info.ExtractOsInfo.is_there_access',
        return_value=return_files
          ), \
         patch(
            'app.apps_found.AppsFound.locate_apps',
            return_value=return_apps
            ), \
         patch(
            'app.extract_rede_info.ExtractRedeInfo.extract_ip',
            return_value=return_ip
            ), \
         patch(
            'app.extract_rede_info.ExtractRedeInfo.extract_ports',
            return_value=return_ports
            ), \
            patch(
               "typer.confirm",
               return_value="y"
               ) as mock_confirm, \
            patch(
               "typer.prompt",
               side_effect=inputs
               ) as mock_prompt, \
            patch("builtins.print") as mock_print:
        instance.extract_process(instance2)
        mock_print.assert_any_call("Unable to find operating system information")
        mock_confirm.assert_called_once_with("Would you like to enter this host's operating system information manually?", abort=True)
        mock_prompt.assert_any_call("Enter the number of the desired option")
        mock_print.assert_any_call("The version provided is not in a valid standard (1 or 1.0 or 1.0.0), please try again.")
        assert mock_prompt.call_count == 4
