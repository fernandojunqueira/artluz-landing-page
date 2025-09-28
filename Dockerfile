# Etapa 1: Build da aplicação
FROM node:20-alpine AS build

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar todo o código para o container
COPY . .

# Build da aplicação
RUN npm run build


# Etapa 2: Servir os arquivos estáticos com Nginx
FROM nginx:alpine

# Remover configs padrão
RUN rm -rf /usr/share/nginx/html/*

# Copiar os arquivos estáticos para a pasta do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuração customizada do Nginx (opcional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor a porta padrão
EXPOSE 80

# Rodar Nginx
CMD ["nginx", "-g", "daemon off;"]
