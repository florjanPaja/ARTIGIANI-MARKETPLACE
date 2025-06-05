#!/bin/bash

set -e

echo "🛠️ Inizializzazione struttura frontend con jQuery + Bootstrap..."

# Crea struttura cartelle
mkdir -p frontend/{assets/{css,js,img},components,pages,utils}

# index.html con Bootstrap + jQuery
cat > frontend/index.html <<EOF
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Artigianato Online</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="./assets/css/style.css">
</head>
<body>

  <header id="header"></header>

  <main class="container my-4" id="main-content">
    <!-- Contenuto dinamico -->
  </main>

  <footer id="footer" class="bg-dark text-white text-center py-3"></footer>

  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  <script src="./assets/js/main.js" type="module"></script>
</body>
</html>
EOF

# style.css base
cat > frontend/assets/css/style.css <<EOF
body {
  background-color: #f8f9fa;
}
EOF

# main.js
cat > frontend/assets/js/main.js <<EOF
import { loadHeaderFooter } from "../../utils/ui.js";

$(document).ready(() => {
  loadHeaderFooter();
});
EOF

# ui.js
cat > frontend/utils/ui.js <<EOF
export function loadHeaderFooter() {
  $('#header').html(\`
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="index.html">Artigianato Online</a>
      </div>
    </nav>
  \`);

  $('#footer').html(\`
    <div class="container">
      &copy; 2025 Artigianato Online - Tutti i diritti riservati
    </div>
  \`);
}
EOF

# Placeholder pagine
touch frontend/pages/{catalogo.html,login.html,register.html,carrello.html,checkout.html,dashboard.html,admin.html,profilo.html,ordine.html,prodotto.html}

# Placeholder componenti (HTML riusabili)
touch frontend/components/{product-card.html,product-filter.html,login-form.html,order-row.html}

echo "✅ Frontend creato in 'frontend/' con Bootstrap + jQuery"
