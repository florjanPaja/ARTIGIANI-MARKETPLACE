(() => {
  if (window.__segnalazioniInizializzato) return;
  window.__segnalazioniInizializzato = true;

  let segnalazioneCorrente = null;
  let chatInterval = null;
  let ultimiMessaggiSerializzati = '';

  function badgeColor(stato) {
    return {
      'aperta': 'warning',
      'in_gestione': 'primary',
      'attesa_risposta_utente': 'secondary',
      'risolta': 'success'
    }[stato] || 'light';
  }

  function showAlert(msg) {
    $('#segnalazioni-alert').text(msg).removeClass('d-none');
  }

  function caricaSegnalazioniArtigiano() {
    const token = sessionStorage.getItem('authToken');
    const userId = sessionStorage.getItem('userId');
    const tbody = $('#segnalazioni-table tbody').empty();
    $('#nessuna-segnalazione').addClass('d-none');

    $.ajax({
      url: `/api/segnalazioni/utente/${userId}`,
      headers: { Authorization: `Bearer ${token}` },
      success: function (segnalazioni) {
        if (segnalazioni.length === 0) {
          $('#nessuna-segnalazione').removeClass('d-none');
          return;
        }

        segnalazioni.forEach(s => {
          tbody.append(`
            <tr>
              <td>${s.id}</td>
              <td>${s.oggetto}</td>
              <td><span class="badge bg-${badgeColor(s.stato_segnalazione)}">${s.stato_segnalazione}</span></td>
              <td><button class="btn btn-sm btn-outline-primary open-chat-btn" data-id="${s.id}">Chat</button></td>
            </tr>
          `);
        });
      },
      error: () => showAlert('Errore durante il caricamento delle segnalazioni.')
    });
  }

  function inviaNuovaSegnalazione() {
    const oggetto = $('#oggetto-segnalazione').val().trim();
    const messaggio = $('#messaggio-iniziale').val().trim();
    const token = sessionStorage.getItem('authToken');
    const btn = $('#btn-invia-segnalazione');

    if (!oggetto || !messaggio || messaggio.length < 10) {
      showAlert('Compila oggetto e messaggio (minimo 10 caratteri).');
      return;
    }

    btn.prop('disabled', true).html(`<span class="spinner-border spinner-border-sm me-2"></span>Invio...`);

    $.ajax({
      url: '/api/segnalazioni',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({ oggetto, messaggio }),
      success: function () {
        $('#oggetto-segnalazione').val('');
        $('#messaggio-iniziale').val('');
        caricaSegnalazioniArtigiano();
        new bootstrap.Toast(document.getElementById('toast-success')).show();
      },
      error: (xhr) => {
        const msg = xhr.responseJSON?.error || 'Errore durante l\'invio della segnalazione.';
        showAlert(msg);
      },
      complete: () => btn.prop('disabled', false).text('Invia Segnalazione')
    });
  }

  function renderChatIfChanged(messaggi) {
    const serializzato = JSON.stringify(messaggi);
    if (serializzato === ultimiMessaggiSerializzati) return;
    ultimiMessaggiSerializzati = serializzato;

    const box = $('#chat-box').empty();
    if (messaggi.length === 0) {
      box.append(`<div class="text-muted">Nessun messaggio.</div>`);
      return;
    }

    messaggi.forEach(m => {
      const align = m.mittente === 'admin' ? 'text-end' : 'text-start';
      const color = m.mittente === 'admin' ? 'primary' : 'secondary';
      const orario = new Date(m.data_invio).toLocaleTimeString('it-IT', {
        hour: '2-digit', minute: '2-digit'
      });

      box.append(`
        <div class="mb-2 ${align}">
          <div><span class="badge bg-${color}">${m.messaggio}</span></div>
          <small class="text-muted">${orario}</small>
        </div>
      `);
    });

    box.scrollTop(box[0].scrollHeight);
  }

  function caricaChatArtigiano() {
    const token = sessionStorage.getItem('authToken');
    $.ajax({
      url: `/api/segnalazioni/${segnalazioneCorrente}/messaggi`,
      headers: { Authorization: `Bearer ${token}` },
      success: renderChatIfChanged,
      error: () => $('#chat-box').append(`<div class="text-danger">Errore nel caricamento dei messaggi.</div>`)
    });
  }

  function inviaMessaggioChat() {
    const testo = $('#chat-input').val().trim();
    const token = sessionStorage.getItem('authToken');
    if (!testo || !segnalazioneCorrente) return;

    $.ajax({
      url: `/api/segnalazioni/${segnalazioneCorrente}/messaggi`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({ messaggio: testo, mittente: 'utente' }),
      success: function () {
        $('#chat-input').val('');
        caricaChatArtigiano();
      },
      error: () => alert('Errore invio messaggio')
    });
  }

  function startChatPolling() {
    clearInterval(chatInterval);
    chatInterval = setInterval(() => {
      if ($('#chatModal').is(':visible') && segnalazioneCorrente) {
        caricaChatArtigiano();
      }
    }, 1000);
  }

  function stopChatPolling() {
    clearInterval(chatInterval);
    chatInterval = null;
  }

  function setupSegnalazioniArtigiano() {
    $('#btn-invia-segnalazione').off().on('click', inviaNuovaSegnalazione);

    $('#segnalazioni-table').off().on('click', '.open-chat-btn', function () {
      segnalazioneCorrente = $(this).data('id');
      ultimiMessaggiSerializzati = '';
      $('#chatModal').modal('show');
      caricaChatArtigiano();
      startChatPolling();
    });

    $('#chat-send').off().on('click', inviaMessaggioChat);

    $('#chat-input').off().on('keypress', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        inviaMessaggioChat();
      }
    });

    $('#chatModal').on('hidden.bs.modal', stopChatPolling);
  }

  window.initView = function () {
    caricaSegnalazioniArtigiano();
    setupSegnalazioniArtigiano();
  };
})();

