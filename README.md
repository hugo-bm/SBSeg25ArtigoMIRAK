# MIRAK: Um Artefato para Robustecimento do Ambiente Relying Party RPKI

Resumo do artigo: O RPKI vem sendo discutido na literatura como principal forma de robustecimento do roteamento BGP. No entanto alguns trabalhos evidenciaram oportunidades de ataques ao próprio sistema de validação de rotas, justificando o esforço na resiliência desse ambiente. Este artigo apresenta o artefato MIRAK, que realiza de forma automatizada a identificação de vulnerabilidades conhecidas, contribuindo para reduzir o risco de ataques. Os resultados mostraram números animadores, motivando o investimento para aprimorar a sua eficiência. 

## Resumo

Resumo descrevendo o objetivo do artefato


# Estrutura do Repositório

- [Selos considerados](#selos-considerados)
- [Informações básicas](#informações-básicas)
    - [Mirak-extractor](#mirak-extractor)
        - [Funcionalidades](#funcionalidades)
        - [Tecnologias utilizadas](#tecnologias-utilizadas)
        - [Requisitos mínimos de Hardware e Software](#requisitos-mínimos-de-hardware-e-software)
    - [Mirak-app](#mirak-app)
        - [Funcionalidades](#funcionalidades-1)
        - [Tecnologias utilizadas](#tecnologias-utilizadas-1)
        - [Requisitos mínimos de Hardware e Software](#requisitos-mínimos-de-hardware-e-software-1)
        - [Descrição dos campos do relatório em CSV](#descrição-dos-campos-do-relatório-em-csv)
- [Dependências](#dependências)
    - [Mirak-extractor](#mirak-extractor-1)
        - [Dependências Gerais](#dependências-gerais)
        - [Dependências para execução](#dependências-de-produção)
        - [Dependências de desenvolvimento e construção](#dependências-de-desenvolvimento-e-construção)
    - [Mirak-app](#mirak-app-1)
        - [Dependências Gerais](#dependências-gerais-1)
        - [Dependências para execução](#dependências-de-produção-1)
        - [Dependências de desenvolvimento e construção](#dependências-de-desenvolvimento-e-construção-1)
- [Preocupações com segurança](#preocupações-com-segurança)
- [Instalação](#instalação)
    - [Mirak-extractor](#mirak-extractor-2)
        - [Acessar o código-fonte](#download-do-código-fonte)
        - [Construção do pacote](#construção-do-pacote)
        - [Instalação do pacote](#instalação-do-pacote)
        - [Processo automatizado de construção e instalação](#processo-automatizado-de-construção-e-instalação)
        - [Remoção do pacote](#remoção-do-pacote)
    - [Mirak-app](#mirak-app-2)
        - [Acessar o código-fonte](#download-do-código-fonte)
        - [Construção do pacote](#construção-do-pacote)
            - [Tanspilação](#transpilação-typescript--javascript)
            - [Empacotamento](#construção-do-pacote-deb)
        - [Instalação do pacote](#instalação-do-pacote)
- [Teste mínimo](#teste-mínimo)
- [Uso individual das aplicações](#uso-individual-das-aplicações)
    - [Mirak-extractor](#mirak-extractor-3)
        - [Testando com Docker](#testando-com-docker)
        - [Cuidados antes de começar](#cuidados-antes-de-começar)
        - [Usando o Mirak-extractor no Docker](#usando-o-mirak-extractor-no-docker)
        - [Remover imagem e contêiner gerados](#remover-imagem-e-contêiner-gerados)
    - [Mirak-app](#mirak-app-3)
        - [Testando com Docker](#testando-com-docker-1)
        - [Cuidados antes de começar](#cuidados-antes-de-começar-1)
        - [Usando o Mirak-extractor no Docker](#-usando-o-mirak-app-no-docker-1)
        - [Remover imagem e contêiner gerados](#remover-imagem-e-contêiner-gerados-1)
- [Experimentos](#experimentos)
    - [Objetivo do experimento A](#objetivo-do-experimento-a)
    - [Objetivo do experimento B](#objetivo-do-experimento-b)
    - [Requisitos mínimos para executar o experimento](#requisitos-mínimos-para-executar-o-experimento)
    - [Procedimentos para os experimentos](#procedimentos-para-os-experimentos)
- [Licence](#license)

</br>

# Selos Considerados

Os autores consideram, para fins de avaliação, os seguintes selos: o selo D - Artefatos Disponíveis; o selo F - Artefatos Funcionais; e o selo R - Artefatos Reprodutíveis. Para isso, foi fornecido um documento presente neste repositório, bem como códigos e scripts para obter os resultados em um ambiente simulado usando o Docker e o Docker Compose.

</br>

---
# Informações básicas

</br>

---
## Mirak-extractor

O Mirak-extractor é uma ferramenta prática e rápida que tem como objetivo diagnosticar as características do ecossistema hospedeiro Relying Party RPKI. É um sistema automatizado, que consegue avaliar uma grande quantidade de aplicações instaladas e configurações do ambiente em pouco tempo, gerando, ao final, um arquivo estruturado que permite análises futuras por outras aplicações, como o Mirak-app. Essa solução tem um pequeno impacto no ambiente de execução, uma vez que sua instalação e execução foram planejadas para consumir poucos recursos computacionais. Após a sua execução, o MIRAK-Extractor gera um arquivo estruturado denominado MIRAK, que contém as características do ambiente hospedeiro adequadas para a pesquisa de CVEs correspondentes.

</br>

### Funcionalidades

**Extração de informações**: Em suma, o usuário informa um caminho junto com o nome do arquivo, as informações do sistema operacional são obtidas de arquivos do sistema ou do usuário, inicia-se a busca por aplicativos instalados, as principais características e identificador para cada software são armazenados, são obtidas as informações de portas de rede e executa-se a transformação e exportação do arquivo. O processo tem como base as informações que definem o sistema operacional de forma que o permita selecionar qual algoritmo de extração de informações para a identificação de aplicações será utilizado. Os seguintes arquivos são utilizados, sendo apenas um destes necessário:

- os-release;
- lsb-release;
- issue.

Caso não sejam encontrados, o usuário é convidado a fornecer as informações necessárias para continuar com os procedimentos.

</br>

### Tecnologias utilizadas

O projeto utiliza as seguintes tecnologias e ferramentas:


#### **Linguagens e Runtime**

- **Python** – Linguagem de programação de alto nível, focada em legibilidade e produtividade.

#### **Frameworks e Bibliotecas**

- **Typer** – Framework para criação de CLIs em Python com base em Type Hints.

- **TQDM** – Biblioteca para exibir barras de progresso em loops e processos iterativos.

- **Psutil** – Fornece informações sobre processos e uso de recursos do sistema, como CPU e memória.

#### **Testes e Cobertura**

- **Pytest** – Estrutura de testes para Python que facilita a criação de testes unitários e funcionais.

- **Mock** – Ferramenta para criação de mocks em testes, permitindo simular objetos e comportamentos.

#### **Ferramentas de Qualidade e Formatação**

- **Flake8** – Ferramenta para análise de código Python, combinando PEP 8, Pyflakes e McCabe.

- **Black** – Formatador de código opinativo para Python, garantindo estilo consistente.

- **Pylint** – Ferramenta para análise estática de código Python, verificando erros e boas práticas.

#### **Gerenciamento e Empacotamento**

- **Setuptools** – Ferramenta para empacotamento e distribuição de projetos Python.

- **Wheel** – Formato de distribuição binária para pacotes Python, acelerando a instalação.

</br>

### Requisitos mínimos de Hardware e Software

- Sistema operacional: 
  - Ubuntu 16.04 ou superior;
  - Debian 10 ou superior;
  - Red Hat Enterprise Linux 9.5 ou superior;
- Processador: 1 núcleo;
- Memória: 60 MB;
- Armazenamento: 1 MB.

</br>

---
## Mirak-app

Este software integra o projeto MIRAK, e tem como objetivo auxiliar os profissionais de gestão de tecnologia da informação ou cibersegurança a identificar possíveis vulnerabilidades que possam ser exploradas por ameaças, causando impacto nas operações de soluções RPKI. O Mirak-app é uma ferramenta de processamento e análise que visa simplificar como os profissionais fazem a avaliação de segurança de sistemas computacionais com função de Relying Party RPKI, através de uma operação automatizada que pode avaliar uma série de vulnerabilidades e cenários de risco com rapidez. Esta solução utiliza para a busca de CVEs o arquivo MIRAK, gerado pelo software Mirak-extractor. Este arquivo contém os detalhes funcionais do ambiente de execução, permitindo uma busca direcionada por CVEs específicas para o ambiente Relying Party.

</br>

### Funcionalidades

**Avaliação do ambiente de execução RPKI**: as informações contidas no arquivo MIRAK são utilizadas para identificar se o ambiente que executa o RPKI está vulnerável ou não. Em primeiro lugar, é verificado se os dados dos identificadores estão corretos e, caso necessário, são aplicadas correções. Em seguida, são encontradas vulnerabilidades conhecidas para cada software, inclusive o sistema operacional. Com base nos resultados, analisa-se se essas vulnerabilidades se aplicam aos softwares encontrados. Em seguida, é identificada a importância desses softwares no contexto do RPKI e se eles possuem configurações de rede como portas abertas. Por fim, é apresentado o resultado em tela e, caso sejam encontradas vulnerabilidades, um relatório é exportado.

</br>

### Tecnologias utilizadas

O projeto utiliza as seguintes tecnologias e ferramentas:

#### **Linguagens e Runtime**

- **Node.js**: 12.0.0 ou superior - O Node.js se trata de um runtime JavaScript assíncrono e orientado a eventos baseado no motor V8 do Chrome.

- **TypeScript**: 5.6.2 ou superior - O TypeScript é um superset Javascript para prover maior qualidade no desenvolvimento da aplicação.

#### **Frameworks e Bibliotecas**

- **Commander**: 12.1.0 – Biblioteca para criação de interfaces CLI em Node.js.

- **Axios**: 1.7.7 – Cliente HTTP baseado em Promises (assíncrono) para fazer requisições web.

#### **Ferramentas de Qualidade e Produtividade**

- **ESLint**: 9.11.1 – Ferramenta de linting para JavaScript que analisa e impõe padrões de código.

- **Prettier**: 3.3.3 – Formatador de código opinativo para JavaScript e outras linguagens.

- **Husky**: 9.1.6 – Gerencia hooks de Git para executar verificações automáticas antes de commits e push.

- **Lint-staged**: 15.2.10 – Executa verificações de código apenas nos arquivos alterados no commit.

#### **Ferramentas de Desenvolvimento**
- **Nodemon**: 3.1.4 – Monitora arquivos e reinicia automaticamente aplicações Node.js durante o desenvolvimento.

- **Dotenv**: 16.4.7 – Carrega variáveis de ambiente de um arquivo `.env` para a aplicação.

#### **Manipulação de Dados**

- **CSV-Writer**: 1.6.0 – Biblioteca para escrita de arquivos CSV.

- **JSONStream**: 1.0.3 – Biblioteca para manipulação eficiente de grandes arquivos JSON como streams.

#### **Interface de Linha de Comando (CLI)**

- **CLI-Progress**: 3.12.0 – Biblioteca para exibir barras de progresso em terminais.

- **Kleur**: 4.1.5 – Biblioteca para adicionar cores e estilos ao terminal.

#### **Testes e Cobertura**

- **Jest**: 29.7.0 ou superior – Framework de testes em JavaScript com suporte a mocks, spies e snapshots.

- **Coverage**: 6.1.1 – Mede a cobertura de código dos testes, indicando quais partes foram executadas.

#### **Gerenciamento de Pacotes**

- **npm**: 10.7.0 ou superior – Gerenciador de pacotes padrão do Node.js.

#### **Ambiente virtualizado por contêiner**

- **Docker**: 27.2.0 ou superior – Plataforma para criação e gerenciamento de containers.

</br>

### Requisitos mínimos de Hardware e Software

- Sistema operacional:
  - Ubuntu 20.04 ou superior;
- Processador: 1 núcleo;
- Memória: 140 MB;
- Rede: conexão de 10 Mbps;
- Armazenamento: 15 MB.

</br>

### Descrição dos campos do relatório em CSV:


- **product** -> Apresenta a forma como o software vulnerável é nomeado junto a NVD;

- **vendor** -> Representa qual o produtor ou distribuidor do software vulnerável;

- **type** -> Informa se o software vulnerável é uma aplicação instalável ou se faz parte do sistema operacional;

- **version** -> Informa qual a versão do software com vulnerabilidades;

- **cve_id** -> Informa o código identificador da vulnerabilidade junto à Mitre. Sendo assim, pode ser utilizada como referência específica a vulnerabilidade em sites, manuais e documentos.

- **description** -> Apresenta a descrição simplificada da vulnerabilidade;

- **base_score** -> Valor de 0 até 10 que reflete o impacto potencial de uma vulnerabilidade seguindo o padrão CSSV 3.1;

- **base_severity** -> Representação escrita do valor base score, utilizando como base a seguinte tabela:

</br>

<div align="center">

| **Base Score** | **Gravidade**      |
|---------------|------------------|
| 0.0          | Sem impacto      |
| 0.1 - 3.9    | Baixa            |
| 4.0 - 6.9    | Média            |
| 7.0 - 8.9    | Alta             |
| 9.0 - 10.0   | Crítica          |

Fonte: [NVD - CVSS](https://nvd.nist.gov/vuln-metrics/cvss)

</div>

</br>

- **software_required**  ->  Informa se o software vulnerável é considerado essencial para o RPKI. Com exceção do sistema operacional.

- **related_port** -> Informa se uma porta de rede em estado de escuta está relacionada ao software;

- **port_required** -> Descreve se o software deve ter portas relacionadas para o correto funcionamento da solução RPKI;

- **notes** -> Apresenta informações relativas às portas de rede e seu possível impacto no funcionamento do RPKI.

</br>

---
# Dependências

Neste projeto, as dependências são divididas em dependências gerais, dependências de execução e dependências de desenvolvimento ou construção. As dependências de desenvolvimento ou construção são aquelas necessárias no contexto de desenvolvimento e construção. As dependências de execução, também conhecidas como dependências de produção, são as utilizadas pela aplicação em tempo de execução, ou seja, durante o seu funcionamento. As dependências gerais são aquelas essenciais para o funcionamento em todos os contextos apresentados anteriormente.

## Mirak-extractor

As dependências de produção são satisfeitas pelo processo de empacotamento, não sendo necessário o uso do comando para instalação. As dependências de desenvolvimento podem ser satisfeitas ao utilizar o script automático de instalação. Mais informações podem ser encontradas em [Processo automatizado de construção e instalação](#processo-automatizado-de-construção-e-instalação).

### Dependências gerais

- Python 3.8 ou superior

</br>

### Dependências de desenvolvimento e construção:

```bash
pytest>=8.3.4
psutil>=5.9.5
typer>=0.15.1
mock>=5.1.0
flake8>=7.1.1
black>=24.8.0
pylint>=3.2.7
wheel>=0.34.2
tqdm>=4.67.1
setuptools>=45.2.0
```

</br>

O comando para instalar estas dependências é apresentado a seguir.

```bash
$ pip install -r ./app/requirements_dev.txt
```

</br>

### Dependências de produção:

```bash
typer>=0.15.1
psutil>=5.9.5
tqdm>=4.67.1
```

</br>

Para fazer a instalação, é utilizado o comando abaixo.

```bash
$ pip install -r ./app/requirements_prod.txt
```

</br>

## Mirak-app

### Dependências gerais

- Node.js 12.0.0 ou superior;
- Npm 10.7.0 ou superior;

A instalação destas dependências pode ser encontrada na documentação oficial do Node.js através do link: [Node.js — Download Node.js®](https://nodejs.org/pt/download)

</br>

### Dependências para produção:

```json
{
    "ajv": "^8.17.1",
    "ajv-formats": "^3.0.1",
    "axios": "^1.7.7",
    "cli-progress": "^3.12.0",
    "commander": "^12.1.0",
    "csv-writer": "^1.6.0",
    "dotenv": "^16.4.7",
    "jsonstream": "^1.0.3",
    "kleur": "^4.1.5"
  }
```

</br>

A instalação é feita a partir do comando:

```bash
$ npm i --omit=dev
```

</br>

### Dependências de desenvolvimento e construção

```json
{
    "@eslint/js": "^9.11.1",
    "@types/cli-progress": "^3.11.6",
    "@types/jest": "^29.5.12",
    "@types/jsonstream": "^0.8.33",
    "@typescript-eslint/eslint-plugin": "^8.6.0",
    "@typescript-eslint/parser": "^8.6.0",
    "eslint": "^9.11.1",
    "eslint-config-google": "^0.14.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-prettier": "^5.2.1",
    "globals": "^15.10.0",
    "husky": "^9.1.6",
    "jest": "^29.7.0",
    "lint-staged": "^15.2.10",
    "nodemon": "^3.1.4",
    "prettier": "^3.3.3",
    "ts-jest": "^29.2.5",
    "ts-node": "^10.9.2",
    "typescript": "^5.6.2",
    "typescript-eslint": "^8.8.0"
  }
```

</br>

A instalação pode ser realizada com o uso do comando:

```bash
$ npm install --include=dev
```

</br>

---
# Preocupações com segurança

O artefato MIRAK foi criado visando ser minimamente invasivo, apenas extraindo as informações e as processando, sem modificar os arquivos do sistema. Sendo assim, não há riscos para aqueles que o examinarem.

</br>

---
# Instalação

## Mirak-extractor

Este processo envolve o **download do repositório**, **construção do pacote** e **instalação do pacote** gerado.

### Acessar o código-fonte  

</br>

Baixe o código-fonte acessando manualmente o repositório e clicando em **Code** e depois em **Download ZIP**.  

Após baixar, extraia os arquivos para um diretório de sua escolha. Ou, alternativamente, faça o download via wget ou curl (substitua <URL> pela URL do arquivo ZIP). Tenha atenção para ter wget  ou curl e unzip instalados previamente.

```bash
$ wget <URL> -O projeto.zip && unzip projeto.zip
```

### Construção do pacote

</br>

> **⚠️ Importante** Todas as dependências de desenvolvimento e gerais devem estar instaladas antes de continuar!

</br>

O processo de construção foi feito utilizando o "``setuptools``" para gerar um pacote com a extensão "``tar.gz``", que será usado pelo gerenciador de pacotes "``PIP``". O gerenciador PIP foi escolhido por ser o mais utilizado e ser o padrão para Python. A seguir, é apresentado o comando para a criação do pacote:

```bash
$ python3 raiz_do_projeto/setup.py sdist
```

O pacote final será criado na pasta "``dist``".

</br>

**Demonstração:**

<div align="center">
  <img src="./assets/mirak-extractor/construcao_total.gif" width="640">
</div>

</br>

### Instalação do pacote

</br>

Para realizar a instalação do Mirak-extractor, é necessário ter uma versão compatível do Python instalada. O processo de instalação será descrito a seguir:

</br>

> **⚠️ Importante** O procedimento foi realizado em um ambiente Ubuntu, utilizando o Python na versão 3.8. Dessa forma, os comandos apresentados utilizam ``python3.8``. Caso esteja utilizando uma versão diferente, substitua pelo comando correspondente à sua versão do Python.

</br>

1.	Primeiramente, é necessário atualizar o repositório e os pacotes do sistema operacional.

```bash
$ apt-get update

$ apt-get upgrade
```

</br>

2.	Em seguida, deve realizar a instalação seguindo o comando abaixo:

```bash
$ python3.8 -m pip install ./dist/mirak-extractor-1.0.0.tar.gz
```

- Caso não tenha instalado previamente as dependências gerais, deve instalar o Python seguindo este [tutorial](https://python.org.br/instalacao-linux/)

</br>

3.	Para verificar se a instalação foi concluída com sucesso, execute o seguinte comando.

```bash
$ mirak-extractor --help
```

</br>

**Demonstração:**

<div align="center">
  <img src="./assets/mirak-extractor/instalacao_manual_total.gif" width="640">
</div>

</br>

### Processo automatizado de construção e instalação

</br>

Na pasta “scripts” contém códigos automatizados para realizar os processos de instalação de dependências, construção do pacote e a instalação do mesmo. Existem scripts para cada sistema nos quais o Mirak-extractor fornece suporte.

Para Debian ou Ubuntu:

```bash
$ source ./scripts/install_ubuntu_debian.sh
```

Para o Red Hat Enterprise Linux:

```sh
$ ./scripts/install_rhel.sh
```

</br>

Os scripts realizam uma verificação por versões do Python instaladas, depois apresenta as versões compatíveis. O usuário deverá selecionar qual versão será utilizada para o restante do processo. Se não houver uma versão compatível, será perguntado se o usuário deseja instalar o Python na versão 3.8, que é a mais adequada para a compatibilidade.

Desta forma, o usuário pode executar automaticamente os passos descritos nos itens **Construção do pacote** e **Instalação do pacote**.

</br>

**Demonstração:**

<div align="center">
  <img src="./assets/mirak-extractor/instalacao_automatica_total.gif" width="640">
</div>

</br>

### Remoção do pacote

</br>

Para realizar a remoção, deve apenas executar o comando a seguir:

```bash
$ pip uninstall mirak-extractor
```

Por fim, deve inserir o caractere "**Y**" para confirmar a exclusão.

Para realizar a remoção da dependência ``Python`` quando instalada em conjunto, deve-se utilizar o comando para remoção apropriado da sua plataforma.

</br>

**Demonstração:**

<div align="center">
  <img src="./assets/mirak-extractor/remocao_total.gif" width="640">
</div>

</br>

## Mirak-app

Este processo envolve o **download do repositório**, **construção do pacote** e **instalação do pacote** gerado.


### Acessar o código-fonte 

</br>




Baixe o código-fonte manualmente acessando o repositório e clicando em **Código** e depois em **Download ZIP**.  

Após baixar, extraia os arquivos para um diretório de sua escolha.  

Ou, alternativamente, faça o download via wget ou curl (substitua <URL> pela URL do arquivo ZIP). Tenha atenção para ter wget ou curl e unzip instalados previamente.


```bash
$ wget <URL> -O projeto.zip && unzip projeto.zip
```

</br>

### Construção do pacote

</br>

> **⚠️ Importante:** Certifique-se de ter instalado o Node.js e o NPM

</br>

Antes de iniciar, deve ter todas as dependências de desenvolvimento instaladas. Para isso, insira o comando a seguir, caso ainda não tenha feito:

```bash
$ npm install --include=dev
```

O processo de construção possui duas etapas principais: transpilação e empacotamento.

</br>

#### Transpilação (TypeScript → JavaScript)

</br>

Realizar o processo de transpilação utilizando o script automatizado nomeado como ``build``.

Exemplo: 

```bash
$ npm run build
```

Será criada uma pasta chamada "``build``", contendo o código para execução em um ambiente de produção;


</br>


#### Empacotamento (.deb)

</br>

É necessário executar o processo de empacotamento utilizando o script automatizado "``packaging.sh``", disponível na pasta "``script``".

```bash
$ source ./packaging.sh
```

O pacote será criado na pasta "dist".

</br>

**Demonstração da transpilação e do empacotamento:**

<div align="center">
  <img src="./assets/mirak-app/trans_pack_total.gif" width="640">
</div>

</br>

### Instalação do pacote

</br>

Atualmente, a solução só foi portada para distribuições Debian, como o Ubuntu. É necessário ter uma conexão com a internet para continuar. O processo será descrito a seguir:

</br>

> **⚠️ Importante:** O procedimento foi feito usando o Ubuntu.

</br>

1.  Primeiramente, é necessário aplicar a atualização do repositório e a atualização dos pacotes instalados.

```bash
$ apt update

$ apt upgrade
```

</br>

2.  Em seguida, deve executar a instalação seguindo o comando indicado abaixo:

```bash

$ apt install ./dist/mirak-app.deb

```

 - Caso não tenha instalado previamente as dependências, será perguntado se gostaria de fazer essa instalação. Digite "**Y**" para confirmar a ação.

 </br>

3.  Para verificar se a instalação ocorreu corretamente, execute o comando abaixo:

```bash
$ mirak-app -V
```

</br>

**Demonstração da atualização e instalação:**

<div align="center">
  <img src="./assets/mirak-app/instalacao_total.gif" width="640">
</div>

</br>

</br>

4. Todas as configurações do aplicativo são feitas em variáveis de ambiente ou em um arquivo “.env”. Para facilitar o processo de configuração, pode ser utilizado o comando a seguir:

</br>

>  **❗ Aviso:** Para o melhor funcionamento, é necessário o uso de uma ``Chave de API`` da NVD.

Esta chave pode ser adquirida [clicando aqui](https://nvd.nist.gov/developers/request-an-api-key).

</br>

```bash
$ cat > /opt/mirak-app/.env <<EOL
API_NVD_KEY="Coloque_aqui_sua_chave_da_NVD"
EOL
```

</br>

**Demonstração da configuração do Mirak-app:**

<div align="center">
  <img src="./assets/mirak-app/configuracao_total.gif" width="640">
</div>

</br>

### Remoção do pacote

</br>

Para realizar a remoção, basta executar os comandos a seguir:

```bash
$ apt remove mirak-app
```

Por fim, deve inserir o caractere "**Y**" para confirmar a exclusão.

</br>

**Demonstração:**

<div align="center">
  <img src="./assets/mirak-app/remocao_total.gif" width="640">
</div>

</br>

</br>

No caso de instalar as dependências NodeJS e NPM junto à instalação do aplicativo, o processo de remoção não remove estas dependências. Para removê-las, deve executar este comando:

```bash
$ apt autoremove
```

Por fim, deve inserir o caractere "**Y**" para confirmar a exclusão.

</br>

> **⚠️ Importante:** O comando "`apt autoremove`" desinstala qualquer dependência órfã, caso esteja sendo utilizado por outra aplicação não será removido.

</br>

---
# Teste mínimo

Um teste básico de execução possibilita que os revisores verifiquem as funcionalidades do artefato e confirmem seu correto funcionamento. Esse teste é essencial para a identificação de problemas durante o processo de instalação, assegurando a correta instalação do artefato. Para verificar se o Mirak-app está instalado corretamente e se seu binário está funcionando adequadamente, basta executar o seguinte comando.

```bash
$ mirak-app --help
```

A opção "--help" que imprime uma explicação sucinta do funcionamento.

</br>

Para verificar a instalação e o funcionamento do Mirak-extractor, basta executar o comando apresentado abaixo.

```bash
$ mirak-extractor --help
```

</br>

---
# Uso individual das aplicações

## Mirak-extractor

</br>

Após a instalação da aplicação, o mesmo pode ser invocado digitando "``mirak-extractor``". 

A aplicação possui apenas um propósito, desta forma, não possui comandos CLI. Deve ser chamado passando a opção "--output" com o caminho relativo ao destino do arquivo, acrescido do nome e da extensão “.json”. Como ilustrado no exemplo abaixo:

```bash
$ mirak-extractor --output caminho_arquivo_mira/nome_do_arquivo.json
```

</br>

> **💡 Dica** Existe também a opção "**``--help``**" que imprime uma explicação sucinta do funcionamento.

</br>

Caso não seja informada nenhuma opção, será exportado o arquivo dentro do diretório ao qual o aplicativo foi chamado.

</br>

**Demonstração:**

<div align="center">
  <img src="./assets/mirak-extractor/uso_total.gif" width="640">
</div>

</br>

---
## Testando com Docker

</br>

É possível utilizar um ambiente Docker para testar o ``mirak-extractor`` sem precisar instalá-lo diretamente no sistema. Essa abordagem permite configurar de forma ágil um ambiente isolado, garantindo que todos os requisitos sejam atendidos.

</br>

> **⚠️ Importante:** Os exemplos a seguir foram elaborados com base no Ubuntu, porém, podem ser necessárias pequenas adaptações para outras distribuições suportadas.

</br>

### Cuidados antes de começar

</br>

> **❗ Aviso:** Os comandos a seguir fazem o uso de permissões privilegiadas. Certifique-se de rodar esses comandos como **superusuário** para evitar problemas de permissão.

</br>

Antes de começar, deve ter certeza de que o Docker daemon esteja em execução. O comando a seguir pode ser utilizado para este fim.

```bash
$ sudo service docker status
```

ou

```bash
$ sudo systemctl status docker
```

Caso o serviço se encontre desabilitado, pode utilizar os seguintes comandos:

```bash
$ sudo service docker start
```

ou

```bash
$ sudo systemctl enable docker.service
$ sudo systemctl enable containerd.service
```

Para mais informações, acesse a documentação oficial através do link: 

[Documentação oficial do Docker](https://docs.docker.com/engine/install/)

</br>

### Usando o Mirak-extractor no Docker

</br>

> **⚠️ Importante**  O tutorial a seguir foi feito no Ubuntu. Alguns passos devem ser minimamente alterados para compatibilidade com o RHEL.

</br>

Inicialmente, vamos criar uma pasta no host chamada "``output``". Na pasta output será onde vamos obter o arquivo MIRAK em formato JSON. Para realizar este passo, execute o comando a seguir:

```bash
$ mkdir output
```

</br>

Na próxima etapa, vamos construir a imagem, então tenha certeza de estar na raiz do projeto onde contém o arquivo "**``dockerfile.example``**". Em seguida, é necessário executar o comando de construção da imagem, conforme demonstrado abaixo:

```bash
$ docker build -f 'dockerfile.example' -t mirak-extractor-image .
```

</br>

Nesta etapa, será construído e executado um contêiner contendo o nosso ambiente de execução para este exemplo.

```bash
$ docker run -dit --name mirak-extractor-container -v $(pwd)/output:/workspaces/project/output  mirak-extractor-image
```

</br>

Essa etapa é muito importante, pois iremos nos conectar ao terminal do contêiner. Execute o seguinte comando:

```bash
$ docker exec -it mirak-extractor-container bash
```

</br>

Agora, você deve estar conectado ao terminal do contêiner. O próximo passo é executar os seguintes comandos para inicializar o routinator:

```bash
$ routinator init --accept-arin-rpa -f 

$ routinator server --http 0.0.0.0:8323 --rtr 0.0.0.0:3323 --http 0.0.0.0:9556 -d
```

</br>

No próximo passo, serão aplicadas as etapas descritas em **Construção do pacote** e **Instalação do pacote** para finalizar a instalação. Neste exemplo, iremos ilustrar o uso do script para instalação automatizada de dependências e do mirak-extractor. Execute o script abaixo:

```bash
$ source ./scripts/install_ubuntu_debian.sh
```

</br>

Neste exemplo, não há uma instalação prévia do Python, portanto, será perguntado se deseja instalar o Python.

Responda digitando no console o caractere "``y``". Vale ressaltar que o mesmo deve estar em minúsculo.

</br>

Após o Python ser instalado, será perguntado qual versão do software você deseja utilizar para construir e instalar o aplicativo. 

Responda digitando no console o numeral "``1``" para selecionar a versão instalada compatível.

</br>

Após finalizar, o aplicativo estará disponível para uso digitando “mirak-extractor” no console. Por fim, vamos executar o comando passando como opção o caminho até a pasta ``output``. A pasta é importante por estar "espelhada" com a pasta output no host. Dessa forma, o arquivo criado na pasta output do contêiner será copiado para a pasta output do host, permitindo que seja utilizado posteriormente. Para continuar, insira o seguinte comando no console:

```bash
$ mirak-extractor --output output/mirak.json
```

</br>

Após concluir o processo, você será notificado da localização do arquivo. Para verificar, insira o próximo comando:

```bash
$ ls output
```

</br>

Agora você verá que um arquivo com a extensão "``.json``" foi criado. Para finalizar a conexão com o contêiner, digite "``exit``" no console. Agora, estando no ``host``, execute o seguinte comando:

```bash
$ cat output/mirak.json
```

</br>

**Será escrito o conteúdo do arquivo em tela! Parabéns, você executou o processo deste exemplo com sucesso!**

</br>

### Remover imagem e contêiner gerados

</br>

Se for de interesse remover a imagem e o contêiner Docker criados no exemplo, digite os seguintes comandos:

```bash
# Parar a execução do contêiner

$ docker stop mirak-extractor-container

# Deletar o contêiner

$ docker rm mirak-extractor-container

# Remover a imagem 

$ docker image rm mirak-extractor-image
```

</br>

## Mirak-app

</br>

Após a instalação do aplicativo, o mesmo pode ser invocado digitando “mirak-app”. A aplicação possui dois comandos principais: evaluate e help. O comando help apresenta em tela uma explicação do funcionamento da aplicação.

```bash
$ mirak-app help
```

</br>

O comando ``evaluate`` executa a funcionalidade principal e pode ser executado utilizando a opção de escrita em tela ou não. É fortemente recomendado utilizar a opção "**-v**" para a aplicação apresentar as informações do processo em tela. A seguir, um exemplo de como utilizar:

```bash
$ mirak-app evaluate -v ./caminho_até_o_arquivo_mirak/mirak.json ./pasta_de_saída
```

</br>

**Demonstração:**

<div align="center">
  <img src="./assets/mirak-app/uso_total.gif" width="640">
</div>

</br>

## Testando com Docker

</br>

É possível utilizar um ambiente Docker para testar o `mirak-app` sem a necessidade de instalá-lo diretamente no sistema. Essa abordagem permite configurar rapidamente um ambiente isolado, garantindo que todos os requisitos estejam atendidos.

</br>

> **⚠️ Importante:** Os exemplos apresentados a seguir foram elaborados com base no Ubuntu, mas é possível que sejam necessárias pequenas alterações para outras distribuições suportadas.

</br>

### Cuidados antes de começar

</br>

> **❗ Aviso:** Os comandos a seguir fazem o uso de permissões privilegiadas. Certifique-se de rodar esses comandos como **superusuário** para evitar problemas de permissão.

</br>

Antes de começar, deve ter certeza de que o Docker daemon esteja em execução. O comando a seguir pode ser utilizado para este fim.

```bash
$ sudo service docker status
```

ou

```bash
$ sudo systemctl status docker
```

</br>

Caso o serviço se encontre desabilitado, pode utilizar os seguintes comandos:

```bash
$ sudo service docker start
```

ou

```bash
$ sudo systemctl enable docker.service
$ sudo systemctl enable containerd.service
```

</br>

Para mais informações, acesse a documentação oficial através do link: 

[Documentação oficial do Docker](https://docs.docker.com/engine/install/)

</br>

### Usando o Mirak-app no Docker

</br>

Inicialmente, vamos criar duas pastas no host chamadas "``input``" e "``output``". Na pasta input será colocado o arquivo **``mirak.json``** e a pasta output será onde vamos obter o relatório final em formato csv. Para realizar este passo, execute o comando a seguir:

```bash
$ mkdir input output
```

</br>

O arquivo mirak.json deve ser inserido na pasta input, conforme demonstrado na imagem a seguir.

<div align="center">
  <img src="./assets/mirak-app/input_folder_ex_docker.png" width="360">
</div>

</br>

A seguir, vamos construir o pacote com o mirak-app. Para realizar o processo, insira os seguintes comandos:

```bash
$ npm run build # Para realizar a transpilação
$ source ./packaging.sh # Para realizar  o processo de empacotamento
```

</br>

Na próxima etapa, vamos construir a imagem, então tenha certeza de estar na raiz do projeto onde contém o arquivo "``Dockerfile``". Depois, é necessário executar o comando de construção da imagem, como demonstrado abaixo:

```bash
$ docker build -t mirak-app-image .
```

</br>

Nesta etapa, será construído e executado um contêiner contendo o nosso ambiente de execução para este exemplo.

```bash
$ docker run -dit \
    --name mirak-app-container \
    -v $(pwd)/output:/app/output \
    -v $(pwd)/input:/app/input \
    mirak-app-image
```

</br>

Esta etapa é crucial, uma vez que nos conectaremos ao terminal do contêiner. Execute o seguinte comando:

```bash
$ docker exec -it mirak-app-container bash
```

</br>

Agora, estando no console conectado ao contêiner, é necessário seguir com os passos abaixo para finalizar a instalação e a configuração da ferramenta.

</br>

> **❗ Aviso:** Para o melhor funcionamento, é necessário o uso de uma ``Chave de API`` da NVD. Esta chave pode ser adquirida [clicando aqui](https://nvd.nist.gov/developers/request-an-api-key).

</br>

```bash
# Atualizar os repositórios do Sistema Operacional
$ apt update 

# Instalar o pacote e dependencias
$ apt install ./dist/mirak-app.deb 

# Digite Y para instalar as dependências

# Testar a instalação do Mirak-app
$ mirak-app -V 

# Realizar a configuração do Mirak-app
$ cat > /opt/mirak-app/.env <<EOL 
API_NVD_KEY="digite sua chave aqui"
EOL
```

</br>

Para finalmente executar a aplicação, utilize o comando abaixo: 

```bash
$ mirak-app evaluate -v ./input/mirak.json ./output
```

</br>

Por último, é possível retornar ao host utilizando o comando "exit" e obter o relatório em formato CSV na pasta "output".


<div align="center">
  <img src="./assets/mirak-app/output_folder_ex_docker.png" width="360">
</div>

</br>

### Remover imagem e contêiner gerados

</br>

Se for de interesse remover a imagem e o contêiner Docker criados no exemplo, digite os seguintes comandos:

```bash
# Parar a execução do contêiner
$ docker stop mirak-app-container

# Deletar o contêiner
$ docker rm mirak-app-container

# Remover a imagem 
$ docker image rm mirak-app-image
```

</br>

---
# Experimentos

</br>

> **⚠️ Importante** Para estes experiementos sera utilizado o Ubuntu em sua versão 20.04! Não serão feitas correções nestes sistemas visando manter homigeniedade do ambiente para ser possivel uma melhor comparação.

</br>

Para ser possível observar o potencial do projeto, foram estabelecidos dois experimentos simples de serem executados por meio de uma infraestrutura virtualizada. Nesses experimentos, é esperado que se tenham conhecimentos de operação de terminais CLI, conhecimentos em Docker básicos, conhecimentos em comandos Linux básicos e conexão com a internet.

### Requisitos mínimos para executar o experimento

</br>

> **💡Dica** É recomendado executar um experimento de cada vez para um melhor desempenho.

</br>

- CPU: 3 vCPUs
- RAM: 3 GB
- Armazenamento: 20 GB
- Rede: 100 Mbps+


### Descrição

Os experimentos têm como objetivo apresentar o processo do projeto em diferentes aspectos. O processo do projeto Mirak é dividido em duas etapas: ``extração de dados`` e ``avaliação dos dados``. Para cada etapa, é fornecido um contêiner que proporciona um ambiente único e isolado. Para obter os resultados de cada etapa, são disponibilizadas duas pastas nas quais será copiado o resultado obtido do ambiente isolado para o ``host``. Dessa maneira, os artefatos podem ser utilizados em um ambiente controlado e seus resultados são obtidos de forma simplificada.

#### Objetivo do Experimento A

É considerada boa prática no ramo da Cibersegurança manter apenas soluções vinculadas ao serviço executado e estas soluções sempre atualizadas. Portanto, no experimento A, o objetivo será avaliar a presença de inseguranças em um ambiente RPKI no qual estas boas práticas não foram seguidas.

O ambiente a ser avaliado tem o objetivo de fornecer as validações de rotas utilizando a solução RPKI da NLnet Labs o Routinator em versão desatualizada. Também está presente o NGINX da f5, como um servidor http.

#### Objetido Experimentonto B

É uma situação comum aplicar as boas práticas de forma errônea, atuando apenas na solução principal de um ambiente. Este caso leva uma falsa sensação de segurança, pois outros softwares contidos e utilizados pelo sistema operacional ou pela solução podem conter inseguranças. Dessa maneira, o experimento B terá o propósito de avaliar um ambiente RPKI com a solução devidamente atualizada e sem soluções terceiras executadas em conjunto. Este ambiente a ser avaliado tem o objetivo de fornecer as validações de rotas utilizando a solução RPKI da NLnet Labs o Routinator em versão atualizada.

### Procedimentos para os experimentos

Os comandos serão descritos por etapas. Iniciando com a etapa de "extração de dados" e finalizando com a etapa de "avaliação de dados". Os comandos que se diferem entre os experimentos serão apresentados ambos e os mesmos sinalizados para melhor compreensão.


### Começando os trabalhos

</br>

> **⚠️ Importante** Antes de começar tenha certeza de o docker estar instalado e em execução. Caso não tenha instalado acesse o tutorial [aqui](https://docs.docker.com/engine/install/).

</br>

O primeiro passo é executar o comando para início do docker compose como apresentado a seguir:

</br>

> **💡Dica** Algumas versões mais antigas do Docker Compose apresentam o inicio do comando utilizando hífen no lugar de espaço em branco ("``docker-compose``").

</br>

Para o experimento **A**

```bash
$ docker compose -f 'experiments/A/docker-compose.yaml' up -d --build
```




Para o experimento **B**

```bash
$ docker compose -f 'experiments/B/docker-compose.yaml' up -d --build
```

</br>

**Demonstração:** 

<div align="center">
  <img src="./assets/mirak-app/iniciar_exp.gif" width="640">
</div>

</br>


### Extraindo as informações

</br>

Agora vamos entrar na etapa de extração dos dados. Para isso, será necessário conectar-se ao terminal do contêiner que contém nosso ambiente de execução da solução RPKI, utilizando o comando abaixo:


Para o experimento **A**

```bash
$ docker exec -it a-extraction-1 bash
```


Para o experimento **B**

```bash
$ docker exec -it b-extraction-1 bash
```

</br>

**Demonstração:**

<div align="center">
  <img src="./assets/mirak-extractor/conect_experiment_cli.png" width="640">
</div>

</br>

</br>

Nesse momento, estamos no ambiente da solução RPKI, e agora é necessário fazer a instalação do software ``Mirak-extractor`` utilizando o seguinte comando:

```bash
$ source ./scripts/install_ubuntu_debian.sh
```

</br>

Você deve inserir a opção "``1``" para instalar corretamente o artefato.

</br>

**Demonstração:**

<div align="center">
  <img src="./assets/mirak-extractor/instalacao_automatica_total.gif" width="640">
</div>

</br>

</br>

Com o artefato instalado, podemos executá-lo inserindo "``mirak-extractor``" no terminal. Como demonstrado a seguir:

```bash
$ mirak-extractor --output ./output/mirak.json
```

</br>

> **💡 Dica** Existe também a opção "**``--help``**" que imprime uma explicação sucinta do funcionamento.

</br>

**Demonstração:**

<div align="center">
  <img src="./assets/mirak-extractor/uso_total.gif" width="640">
</div>

</br>

</br>

O resultado foi colocado na pasta ``output`` dentro do ambiente que, por sua vez, foi automaticamente copiado para a pasta ``mirak_data`` no host.


Demonstração da saída para o experimento A:

<div align="center">
  <img src="./assets/mirak-extractor/saida_experiment_extractor_cli.png" width="280">
</div>

</br>

Neste ponto, já finalizamos o uso deste contêiner. Utilize o comando ``exit`` para voltar ao host.

</br>

### Avaliando as informações

</br>

Vamos começar a etapa de "avaliação de dados", para isso é necessário conectar ao terminal do contêiner que possui o ambiente propício para realizar a avaliação.


Para o experimento **A**

```bash
$ docker exec -it a-evaluation-1 bash
```

</br>

Para o experimento **B**

```bash
$ docker exec -it b-evaluation-1 bash
```

</br>

**Demonstração:**

<div align="center">
  <img src="./assets/mirak-app/conect_experiment_cli.png" width="640">
</div>


</br>

</br>

Agora iremos fazer a preparação para construir e empacotar o Mirak-app, fazendo o uso deste comando:


</br>


```bash
$ npm install --include=dev
```

</br>

**Demonstração:**

<div align="center">
  <img src="./assets/mirak-app/instalar_dependencias_exp.gif" width="640">
</div>

</br>

</br>

Neste ponto, será feito o processo de construção do pacote para instalação do artefato. São feitos dois procedimentos automatizados pelo uso de dois scripts descritos a seguir:

- Script build: este script está atrelado ao processo de transpilação de TypeScript para Javascript. Também faz parte do processo a aplicação de um conjunto de testes unitários para garantir a confiabilidade do artefato.

    Comando a ser utilizado: 

    ```bash
    $ npm run build
    ```

- Script packaging.sh: este script está relacionado ao processo de formação de pacote para distribuições Debian, como o Ubuntu. Essa etapa visa simplificar o uso, instalação e remoção do artefato. Ao final, o pacote de instalação será exportado na pasta ``dist``.

    Comando a ser utilizado:

    ```bash
    $ source ./script/packaging.sh
    ```

</br>

**Demonstração:**

<div align="center">
  <img src="./assets/mirak-app/instalar_dependencias_exp.gif" width="640">
</div>

</br>

</br>

Agora, será feita a instalação do Mirak-app e sua configuração. Ao final, o software estará disponível ao inserir ``mirak-app`` no terminal.

Comandos para atualizar os repositórios e softwares do ambiente:

```bash
$ apt update
$ apt upgrade
```

Comando para instalar:

```bash
$ apt install ./dist/mirak-app.deb
```

</br>

**Demonstração:**

<div align="center">
  <img src="./assets/mirak-app/instalacao_total.gif" width="640">
</div>

</br>

</br>

Comando para configurar:

</br>

> **❗ Aviso:** Para o melhor funcionamento, é necessário o uso de uma ``Chave de API`` da NVD. Esta chave pode ser adquirida [clicando aqui](https://nvd.nist.gov/developers/request-an-api-key).

</br>

```bash
$ cat > /opt/mirak-app/.env <<EOL
API_NVD_KEY="Coloque_aqui_sua_chave_da_NVD"
EOL
```

</br>

Por fim, vamos iniciar a avaliação utilizando o comando ``evaluate`` do mirak-app. Para isso, digite os comandos abaixo:

```bash
$ mirak-app evaluate -v ./input/mirak.json ./output
```

</br>

**Demonstração:**

<div align="center">
  <img src="./assets/mirak-app/uso_total.gif" width="640">
</div>

</br>

</br>

O tempo de duração do processo pode variar em torno de 28 minutos, dependendo da velocidade de internet. Ao final, deve-se obter uma saída similar a esta:

<div align="center">
  <img src="./assets/mirak-app/sainda_experiment_app_cli.png" width="280">
</div>

</br>

---
# LICENSE

</br>

Leia as informações escritas no arquivo [LICENSE](./LICENSE)