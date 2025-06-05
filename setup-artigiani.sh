#!/bin/bash

PROJECT="/Users/florjanpaja/git/Artigiani-marketplace"

echo "🔧 Inizializzazione nella cartella $PROJECT..."

mkdir -p $PROJECT/{backend,frontend,database}

# docker-compose.yml
cat > $PROJECT/docker-compose.yml <<EOF
version: '3.8'

services:
  db:
    image: postgres:14
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: marketplace
    volumes:
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    depends_on:
      - db
    environment:
      DB_HOST: db
      DB_USER: user
      DB_PASSWORD: pass
      DB_NAME: marketplace

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
EOF

# backend
cat > $PROJECT/backend/Dockerfile <<EOF
FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["node", "index.js"]
EOF

cat > $PROJECT/backend/package.json <<EOF
{
  "name": "backend",
  "version": "1.0.0",
  "main": "index.js",
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.7.1"
  }
}
EOF

cat > $PROJECT/backend/index.js <<EOF
const express = require('express');
const { Pool } = require('pg');
const app = express();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

app.get('/api/products', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM products');
  res.json(rows);
});

app.listen(5000, () => {
  console.log('✅ Backend attivo su http://localhost:5000');
});
EOF

# database
cat > $PROJECT/database/init.sql <<EOF
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL
);

INSERT INTO products (name, price) VALUES 
('Borsa artigianale', 35.00),
('Orecchini in ceramica', 15.00);
EOF

# frontend
cat > $PROJECT/frontend/Dockerfile <<EOF
FROM nginx:alpine
COPY index.html /usr/share/nginx/html/index.html
EOF

cat > $PROJECT/frontend/index.html <<EOF
<!DOCTYPE html>
<html>
<head>
  <title>Artigiani Marketplace</title>
</head>
<body>
  <h1>Prodotti artigianali</h1>
  <ul id="list"></ul>

  <script>
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        const ul = document.getElementById('list');
        data.forEach(product => {
          const li = document.createElement('li');
          li.innerText = \`\${product.name} - €\${product.price}\`;
          ul.appendChild(li);
        });
      });
  </script>
</body>
</html>
EOF

echo "✅ Progetto popolato in $PROJECT"
echo "👉 Vai nella cartella: cd \"$PROJECT\""
echo "🚀 Avvia con: docker compose up --build"

