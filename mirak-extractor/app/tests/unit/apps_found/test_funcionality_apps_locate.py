import pytest
from mock import patch
from app.apps_found import AppsFound


class MockStdout:
    def __init__(self, stdout):
        self.stdout = stdout

def teste_caso_localizar_apps_ubuntu():
    instance = AppsFound()
    content = MockStdout("""usbutils|Ubuntu Developers <ubuntu-devel-discuss@lists.ubuntu.com>|1:012-2|amd64
util-linux|Ubuntu Developers <ubuntu-devel-discuss@lists.ubuntu.com>|2.34-0.1ubuntu9.6|amd64
uuid-runtime|Ubuntu Developers <ubuntu-devel-discuss@lists.ubuntu.com>|2.34-0.1ubuntu9.6|amd64
vim|Ubuntu Developers <ubuntu-devel-discuss@lists.ubuntu.com>|2:8.1.2269-1ubuntu5.23|amd64
vim-common|Ubuntu Developers <ubuntu-devel-discuss@lists.ubuntu.com>|2:8.1.2269-1ubuntu5.23|all
vim-runtime|Ubuntu Developers <ubuntu-devel-discuss@lists.ubuntu.com>|2:8.1.2269-1ubuntu5.23|all
vim-tiny|Ubuntu Developers <ubuntu-devel-discuss@lists.ubuntu.com>|2:8.1.2269-1ubuntu5.23|amd64
wamerican|Ubuntu Developers <ubuntu-devel-discuss@lists.ubuntu.com>|2018.04.16-1|all
wget|Ubuntu Developers <ubuntu-devel-discuss@lists.ubuntu.com>|1.20.3-1ubuntu2.1|amd64
whiptail|Ubuntu Developers <ubuntu-devel-discuss@lists.ubuntu.com>|0.52.21-4ubuntu2|amd64
whois|Ubuntu Developers <ubuntu-devel-discuss@lists.ubuntu.com>|5.5.6|amd64
whoopsie-preferences|Evan Dandrea <evan.dandrea@canonical.com>|22|amd64
wireless-regdb|Ubuntu Developers <ubuntu-devel-discuss@lists.ubuntu.com>|2022.06.06-0ubuntu1~20.04.1|all
wpasupplicant|Ubuntu Developers <ubuntu-devel-discuss@lists.ubuntu.com>|2:2.9-1ubuntu4.4|amd64
wslu|Balint Reczey <rbalint@ubuntu.com>|2.3.6-0ubuntu2~20.04.0|all
""")
    with patch("subprocess.run", return_value=content):
        softwares = instance.locate_apps("ubuntu")
        assert len(softwares) == 15
        assert softwares[0][0] == "usbutils"

def teste_caso_localizar_apps_ubuntu_icoerente_caractere():
    instance = AppsFound()
    content = MockStdout("""usbutils:fd|Ubuntu Developers <ubuntu-devel-discuss@lists.ubuntu.com>|1:012-2|amd64
util-linux|Ubuntu Developers <ubuntu-devel-discuss@lists.ubuntu.com>|2.34-0.1ubuntu9.6|amd64
uuid-runtime|Ubuntu Developers <ubuntu-devel-discuss@lists.ubuntu.com>|2.34-0.1ubuntu9.6|amd64
vim:add|Ubuntu Developers <ubuntu-devel-discuss@lists.ubuntu.com>|2:8.1.2269-1ubuntu5.23|amd64
vim-common|Ubuntu Developers <ubuntu-devel-discuss@lists.ubuntu.com>|2:8.1.2269-1ubuntu5.23|all
vim-runtime|Ubuntu Developers <ubuntu-devel-discuss@lists.ubuntu.com>|2:8.1.2269-1ubuntu5.23|all
vim-tiny|Ubuntu Developers <ubuntu-devel-discuss@lists.ubuntu.com>|2:8.1.2269-1ubuntu5.23|amd64
wamerican|Ubuntu Developers <ubuntu-devel-discuss@lists.ubuntu.com>|2018.04.16-1|all
wget:333|Ubuntu Developers <ubuntu-devel-discuss@lists.ubuntu.com>|1.20.3-1ubuntu2.1|amd64
whiptail|Ubuntu Developers <ubuntu-devel-discuss@lists.ubuntu.com>|0.52.21-4ubuntu2|amd64
whois|Ubuntu Developers <ubuntu-devel-discuss@lists.ubuntu.com>|5.5.6|amd64
whoopsie-preferences|Evan Dandrea <evan.dandrea@canonical.com>|22|amd64
wireless-regdb|Ubuntu Developers <ubuntu-devel-discuss@lists.ubuntu.com>|2022.06.06-0ubuntu1~20.04.1|all
wpasupplicant|Ubuntu Developers <ubuntu-devel-discuss@lists.ubuntu.com>|2:2.9-1ubuntu4.4|amd64
wslu|Balint Reczey <rbalint@ubuntu.com>|2.3.6-0ubuntu2~20.04.0|all
""")
    with patch("subprocess.run", return_value=content):
        softwares = instance.locate_apps("ubuntu")
        assert len(softwares) == 15
        assert softwares[0][0] == "usbutils"

def teste_caso_localizar_apps_ubuntu_com_python_e_rpki_corecao_manual():
    instance = AppsFound()
    content = MockStdout("""usbutils:fd|Ubuntu Developers <ubuntu-devel-discuss@lists.ubuntu.com>|1:012-2|amd64
util-linux|Ubuntu Developers <ubuntu-devel-discuss@lists.ubuntu.com>|2.34-0.1ubuntu9.6|amd64
uuid-runtime|Ubuntu Developers <ubuntu-devel-discuss@lists.ubuntu.com>|2.34-0.1ubuntu9.6|amd64
vim:add|Ubuntu Developers <ubuntu-devel-discuss@lists.ubuntu.com>|2:8.1.2269-1ubuntu5.23|amd64
vim-common|Ubuntu Developers <ubuntu-devel-discuss@lists.ubuntu.com>|2:8.1.2269-1ubuntu5.23|all
vim-runtime|Ubuntu Developers <ubuntu-devel-discuss@lists.ubuntu.com>|2:8.1.2269-1ubuntu5.23|all
vim-tiny|Ubuntu Developers <ubuntu-devel-discuss@lists.ubuntu.com>|2:8.1.2269-1ubuntu5.23|amd64
wamerican|Ubuntu Developers <ubuntu-devel-discuss@lists.ubuntu.com>|2018.04.16-1|all
wget:333|Ubuntu Developers <ubuntu-devel-discuss@lists.ubuntu.com>|1.20.3-1ubuntu2.1|amd64
whiptail|Ubuntu Developers <ubuntu-devel-discuss@lists.ubuntu.com>|0.52.21-4ubuntu2|amd64
whois|Ubuntu Developers <ubuntu-devel-discuss@lists.ubuntu.com>|5.5.6|amd64
whoopsie-preferences|Evan Dandrea <evan.dandrea@canonical.com>|22|amd64
wireless-regdb|Ubuntu Developers <ubuntu-devel-discuss@lists.ubuntu.com>|2022.06.06-0ubuntu1~20.04.1|all
wpasupplicant|Ubuntu Developers <ubuntu-devel-discuss@lists.ubuntu.com>|2:2.9-1ubuntu4.4|amd64
wslu|Balint Reczey <rbalint@ubuntu.com>|2.3.6-0ubuntu2~20.04.0|all
python3|Ubuntu Developers <ubuntu-devel-discuss@lists.ubuntu.com>|3.9.4|amd64
routinator|Ubuntu Developers <ubuntu-devel-discuss@lists.ubuntu.com>|0.9.0-rc3|amd64
""")
    with patch("subprocess.run", return_value=content):
        softwares = instance.locate_apps("ubuntu")
        assert len(softwares) == 17
        assert softwares[0][0] == "usbutils"

def teste_caso_localizar_apps_rhel():
    instance = AppsFound()
    content = MockStdout("""dnf|Red Hat, Inc.|4.14.0|noarch
python3-dnf-plugins-core|Red Hat, Inc.|4.3.0|noarch
python3-subscription-manager-rhsm|Red Hat, Inc.|1.29.42|x86_64
subscription-manager|Red Hat, Inc.|1.29.42|x86_64
yum|Red Hat, Inc.|4.14.0|noarch
cryptsetup-libs|Red Hat, Inc.|2.7.2|x86_64
dbus-common|Red Hat, Inc.|1.12.20|noarch
gobject-introspection|Red Hat, Inc.|1.68.0|x86_64
rpm-plugin-selinux|Red Hat, Inc.|4.16.1.3|x86_64
crypto-policies-scripts|Red Hat, Inc.|20240828|noarch
openldap-compat|Red Hat, Inc.|2.6.6|x86_64
findutils|Red Hat, Inc.|4.8.0|x86_64
tar|Red Hat, Inc.|1.34|x86_64
vim-minimal|Red Hat, Inc.|8.2.2637|x86_64
gdb-gdbserver|Red Hat, Inc.|14.2|x86_64
gmp|Red Hat, Inc.|6.2.0|x86_64
libnl3|Red Hat, Inc.|3.9.0|x86_64
gpg-pubkey|(none)|08c4cc43|(none)
rsync|Red Hat, Inc.|3.2.3|x86_64
routinator|(none)|0.14.0|x86_64
""")
    with patch("subprocess.run", return_value=content):
        softwares = instance.locate_apps("enterprise")
        assert len(softwares) == 20
        assert softwares[0][0] == "dnf"
