$(document).ready(function () {
  // logout
  $('#logout-btn').on('click', function (e) {
    e.preventDefault();
    sessionStorage.removeItem('authToken');
    window.location.href = '/pages/home.html';
  });

  // gestione menu attivo
  function setActiveLink(href) {
    $('.link-ajax').removeClass('active');
    $(`.link-ajax[href="${href}"]`).addClass('active');
  }

  // caricamento contenuto dinamico con script e inizializzazione
  function loadPage(href) {
    const jsFile = `js/${href.split('.')[0]}.js`;

    $('#main-content').load(href, function () {
      $.getScript(jsFile)
        .done(() => {
          console.log(`✅ ${jsFile} caricato`);
          // tenta di chiamare initView() se definita
          if (typeof initView === 'function') {
            initView();
          }
        })
        .fail(() => {
          console.warn(`⚠️ JS ${jsFile} non trovato o errore di caricamento`);
        });
    });

    setActiveLink(href);
  }

  // click su link
  $('.link-ajax').on('click', function (e) {
    e.preventDefault();
    const href = $(this).attr('href');
    loadPage(href);
  });

  // carica la prima voce di menu come default
  const defaultHref = $('.link-ajax').first().attr('href');
  loadPage(defaultHref);
});
