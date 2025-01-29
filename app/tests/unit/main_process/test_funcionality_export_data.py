import json
import pytest
from mock import mock_open, patch
from app.main_process import Process
from app.report import Report


def teste_caso_exportando_data():
    instance = Process()
    instance2 = Report()
    return_files = ["os-release"]
    return_os = ("ubuntu", "20.04")
    return_apps = [['ca-certificates', 'ubuntu-tag_rec-app', '20230311ubuntu0.20.04.1', 'all']]
    return_ip = "172.25.232.77"
    return_ports = ([8080, 53], {8080: 'WEB', 53: 'DNS'})
    output = "./mirak.json"

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
            'app.extract_rede_info.ExtractRedeInfo.extract_ports',
            return_value=return_ports
            ), \
            patch("builtins.open", mock_open()) as mocked_open:
        instance.extract_process(instance2)
        instance.export_data(output, instance2)
        mocked_open.assert_called_once_with(output, "w")
        handle = mocked_open()
        written_data = "".join(call.args[0] for call in handle.write.call_args_list)
        assert written_data == json.dumps(
            instance2.get_report_dict(),
            indent=4,
            ensure_ascii=False
            )
