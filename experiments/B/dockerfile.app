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


# # Declarar a pasta output e input como volume
VOLUME /output /workspaces/project/output
VOLUME /input /workspaces/project/input


COPY "./mirak-app/__tests__" "./__tests__"
COPY "./mirak-app/script" "./script"
COPY "./mirak-app/src" "./src"
COPY [ "./mirak-app/tsconfig.json", "./mirak-app/jest.config.js","./mirak-app/mirak-app","./mirak-app/package.json","./"]

# Comando padrão ao iniciar o container
CMD ["/bin/bash"]