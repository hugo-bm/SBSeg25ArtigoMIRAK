# Base da imagem
FROM node:latest

# Atualiza pacotes e instala ferramentas essenciais
RUN apt-get update && apt-get install -y \
    bash \
    curl \
    vim \
    && apt-get clean

# Define o diretório de trabalho
WORKDIR /app

# Criar a pasta output dentro do container
RUN mkdir -p /app/output

# Declarar a pasta output como volume
VOLUME /app/output

# Copia um arquivo para a imagem (opcional)
COPY ./dist/* /app/

# Comando padrão ao iniciar o container
CMD ["bash"]