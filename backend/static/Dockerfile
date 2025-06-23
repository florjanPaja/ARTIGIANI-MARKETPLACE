# Usa un'immagine Nginx leggera
FROM nginx:stable-alpine

# Copia i file statici nella directory di Nginx
COPY . /usr/share/nginx/html

# Rimuove la configurazione di default e aggiunge una personalizzata
RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Espone la porta 80 (standard HTTP)
EXPOSE 80

# Avvia Nginx
CMD ["nginx", "-g", "daemon off;"]
