$(document).ready(function () {
  const utenteId = sessionStorage.getItem('userId');
  const token = sessionStorage.getItem('authToken');;

  if (!utenteId || !token) {
    alert('Sessione scaduta. Effettua di nuovo il login.');
    window.location.href = '/pages/home.html';
    return;
  }

  // 🔹 Carica dati profilo
  $.ajax({
    url: `/api/utenti/${utenteId}`,
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
    success: function (utente) {
      for (const key in utente) {
        $(`[name="${key}"]`).val(utente[key]);
      }
    },
    error: function () {
      alert('Errore durante il caricamento del profilo.');
    }
  });

  // 🔹 Aggiorna profilo
  $('#profilo-form').on('submit', function (e) {
    e.preventDefault();

    const data = {};
    $('#profilo-form')
      .serializeArray()
      .forEach(({ name, value }) => {
        data[name] = value;
      });

    $.ajax({
      url: `/api/utenti/${utenteId}`,
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(data),
      success: function (profilo) {
        alert('Profilo aggiornato con successo.');
      
        $('#vetrina-attivita').text(profilo.nome_attivita || '-');
        $('#vetrina-bio').text(profilo.bio || '-');
        $('#vetrina-localita').text(`${profilo.citta || ''}, ${profilo.stato || ''}`);
      
        if (profilo.sito_web) {
          $('#vetrina-sito').text(profilo.sito_web).attr('href', profilo.sito_web).parent().show();
        } else {
          $('#vetrina-sito').text('').attr('href', '#').parent().hide();
        }
      },
      
      error: function () {
        alert('Errore durante l’aggiornamento del profilo.');
      }
    });
  });

  // 🔹 Carica vetrina pubblica
  $.ajax({
    url: `/api/utenti/artigiani/${utenteId}/pubblico`,
    method: 'GET',
    success: function (profilo) {
      $('#vetrina-attivita').text(profilo.nome_attivita || '-');
      $('#vetrina-bio').text(profilo.bio || '-');
      $('#vetrina-localita').text(`${profilo.citta || ''}, ${profilo.stato || ''}`);
      if (profilo.sito_web) {
        $('#vetrina-sito').text(profilo.sito_web).attr('href', profilo.sito_web).parent().show();
      } else {
        $('#vetrina-sito').parent().hide();
      }
      
    },
    error: function () {
      $('#anteprima-vetrina').html('<em>Impossibile caricare la vetrina pubblica.</em>');
    }
  });

  // 🔹 Elimina profilo
  $('#elimina-profilo').on('click', function () {
    if (!confirm('Sei sicuro di voler eliminare il tuo profilo? L’operazione è irreversibile.')) return;

    $.ajax({
      url: `/api/utenti/${utenteId}`,
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
      success: function () {
        alert('Profilo eliminato. Verrai disconnesso.');
        localStorage.clear();
        window.location.href = '/login.html';
      },
      error: function () {
        alert('Errore durante l’eliminazione del profilo.');
      }
    });
  });
});
