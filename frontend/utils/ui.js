// frontend/utils/ui.js
export function loadHeaderFooter() {
  $('#header').html(`
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="/index.html">Artigianato Online</a>
        <div class="collapse navbar-collapse">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item"><a class="nav-link" href="/catalogo.html">Catalogo</a></li>
            <li class="nav-item"><a class="nav-link" href="/carrello.html">Carrello</a></li>
            <li class="nav-item"><a class="nav-link" href="/login.html">Login</a></li>
          </ul>
        </div>
      </div>
    </nav>
  `);

  $('#footer').html(`
    <div class="container text-center py-3 text-white bg-dark">
      &copy; 2025 Artigianato Online
    </div>
  `);
}
