# Usa l'immagine ufficiale di PostgreSQL
FROM postgres:14

# Variabili d’ambiente per il database
ENV POSTGRES_USER=user
ENV POSTGRES_PASSWORD=pass
ENV POSTGRES_DB=marketplace

# Copia lo script di inizializzazione nel path usato da PostgreSQL
COPY init.sql /docker-entrypoint-initdb.d/init.sql
