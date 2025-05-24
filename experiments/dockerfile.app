FROM node:20 AS build_stage

RUN apt update && apt upgrade -y

ENV DEBIAN_FRONTEND=noninteractive

# Define o diretório de trabalho
WORKDIR /workspaces/project

COPY "./mirak-app/__tests__" "./__tests__"
COPY "./mirak-app/script" "./script"
COPY "./mirak-app/src" "./src"
COPY [ "./mirak-app/tsconfig.json", "./mirak-app/jest.config.js","./mirak-app/mirak-app","./mirak-app/package.json","./"]

RUN npm install --include=dev && npm run build && ./script/packaging.sh

FROM ubuntu:20.04

# Atualiza pacotes e instala ferramentas essenciais
RUN apt-get update && apt-get install -y \
    bash \
    curl \
    && apt-get clean

RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean

# Define o diretório de trabalho
WORKDIR /workspaces/project


# Declarar a pasta output e input como volume
VOLUME /output /workspaces/project/output
VOLUME /input /workspaces/project/input

# Obter pacote Mirak-app da fase de construção

# COPY "./mirak-app/__tests__" "./__tests__"
# COPY "./mirak-app/script" "./script"
# COPY "./mirak-app/src" "./src"
# COPY [ "./mirak-app/tsconfig.json", "./mirak-app/jest.config.js","./mirak-app/mirak-app","./mirak-app/package.json","./"]

COPY --from=build_stage /workspaces/project/dist/mirak-app.deb .

# Instalar o Mirak-app e remover o pacote

RUN apt install -y ./mirak-app.deb && rm mirak-app.deb

# Comando padrão ao iniciar o container
CMD ["/bin/bash"]