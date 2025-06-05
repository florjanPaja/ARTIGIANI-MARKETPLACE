# Usa un'immagine ufficiale di Node
FROM node:20-alpine

# Crea directory di lavoro
WORKDIR /app

# Copia i file package*
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia tutto il codice sorgente
COPY . .

# Espone la porta configurata (di default 3000)
EXPOSE 3000

# Variabile di ambiente di default (può essere sovrascritta con docker-compose)
ENV PORT=3000

# Comando di avvio
CMD [ "npm", "start" ]
