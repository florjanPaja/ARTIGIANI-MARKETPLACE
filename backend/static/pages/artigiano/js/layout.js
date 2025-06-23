$(document).ready(function () {
  // Logout
  $('#logout-btn').on('click', function (e) {
    e.preventDefault();
    sessionStorage.removeItem('authToken');
    window.location.href = '/pages/home.html';
  });

  // Imposta link attivo nella sidebar
  function setActiveLink(href) {
    $('.link-ajax').removeClass('active');
    $(`.link-ajax[href="${href}"]`).addClass('active');
  }

  // Carica contenuto e JS dinamicamente
  function loadPage(href) {
    $('#main-content').load(href, function () {
      const jsPath = `js/${href.replace('.html', '')}.js`;

      $.getScript(jsPath)
        .done(() => {
          if (typeof initView === 'function') {
            initView(); // esegue funzione iniziale se definita nel file JS
          }
        })
        .fail(() => {
          console.warn(`⚠️ File JS non trovato: ${jsPath}`);
        });
    });

    setActiveLink(href);
  }

  // Gestione click link sidebar
  $('.link-ajax').on('click', function (e) {
    e.preventDefault();
    const href = $(this).attr('href');
    loadPage(href);
  });

  // Carica prima voce del menu all'avvio
  const defaultHref = $('.link-ajax').first().attr('href');
  if (defaultHref) {
    loadPage(defaultHref);
  }
});
