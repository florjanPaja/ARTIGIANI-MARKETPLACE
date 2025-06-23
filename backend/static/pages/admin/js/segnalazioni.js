
let segnalazioneCorrente = null;
let chatInterval = null;
let ultimiMessaggiSerializzati = '';
let segnalazioniInizializzato = false;

function initView() {
  if (segnalazioniInizializzato) return;
  segnalazioniInizializzato = true;
  caricaSegnalazioni();
  setupEventHandlers();
}

function badgeColor(stato) {
  return {
    aperta: 'warning',
    in_gestione: 'primary',
    attesa_risposta_utente: 'secondary',
    risolta: 'success'
  }[stato] || 'light';
}

function showErrore(msg) {
  $('#segnalazioni-alert').text(msg).removeClass('d-none');
}

function caricaSegnalazioni() {
  const token = sessionStorage.getItem('authToken');
  const filtroStato = $('#filtro-stato').val();
  const filtroUtente = $('#filtro-utente').val().toLowerCase();
  const tbody = $('#segnalazioni-table tbody').empty();
  $('#nessuna-segnalazione').addClass('d-none');
  $('#segnalazioni-alert').addClass('d-none');

  $.ajax({
    url: '/api/segnalazioni',
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
    success: (segnalazioni) => {
      const filtrate = segnalazioni.filter(s => {
        const statoOk = filtroStato ? s.stato_segnalazione === filtroStato : true;
        const utenteOk = filtroUtente ? s.id_utente.toLowerCase().includes(filtroUtente) : true;
        return statoOk && utenteOk;
      });

      if (filtrate.length === 0) {
        $('#nessuna-segnalazione').removeClass('d-none');
        return;
      }

      filtrate.forEach(s => {
        const statoBadge = badgeColor(s.stato_segnalazione);
        tbody.append(`
          <tr>
            <td>${s.id}</td>
            <td>${s.id_utente}</td>
            <td>${s.oggetto}</td>
            <td>
              <span class="badge bg-${statoBadge}">${s.stato_segnalazione}</span>
              <div class="mt-1">
                <select class="form-select form-select-sm stato-select" data-id="${s.id}">
                  <option disabled selected>Modifica stato</option>
                  <option value="aperta">Aperta</option>
                  <option value="in_gestione">In Gestione</option>
                  <option value="attesa_risposta_utente">Attesa Risposta</option>
                  <option value="risolta">Risolta</option>
                </select>
              </div>
            </td>
            <td><button class="btn btn-sm btn-info open-chat-btn" data-id="${s.id}">Chat</button></td>
          </tr>
        `);
      });
    },
    error: (xhr) => {
      const msg = xhr.responseJSON?.message || 'Errore nel caricamento delle segnalazioni.';
      showErrore(msg);
    }
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

function caricaMessaggi() {
  const token = sessionStorage.getItem('authToken');
  $.ajax({
    url: `/api/segnalazioni/${segnalazioneCorrente}/messaggi`,
    headers: { Authorization: `Bearer ${token}` },
    success: renderChatIfChanged,
    error: () => $('#chat-box').append(`<div class="text-danger">Errore nel caricamento dei messaggi</div>`)
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
    data: JSON.stringify({ messaggio: testo, mittente: 'admin' }),
    success: function () {
      $('#chat-input').val('');
      caricaMessaggi();
    },
    error: () => alert('Errore invio messaggio')
  });
}

function startChatPolling() {
  clearInterval(chatInterval);
  chatInterval = setInterval(() => {
    if ($('#chatModal').is(':visible') && segnalazioneCorrente) {
      caricaMessaggi();
    }
  }, 1000);
}

function stopChatPolling() {
  clearInterval(chatInterval);
  chatInterval = null;
}

function cambiaStatoSegnalazione(id, stato) {
  const token = sessionStorage.getItem('authToken');
  $.ajax({
    url: `/api/segnalazioni/${id}/stato`,
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    data: JSON.stringify({ stato }),
    success: () => caricaSegnalazioni(),
    error: () => alert('Errore aggiornamento stato.')
  });
}

function setupEventHandlers() {
  $('#applica-filtri').off().on('click', caricaSegnalazioni);

  $('#segnalazioni-table').off('click', '.open-chat-btn').on('click', '.open-chat-btn', function () {
    segnalazioneCorrente = $(this).data('id');
    ultimiMessaggiSerializzati = '';
    $('#chatModal').modal('show');
    caricaMessaggi();
    startChatPolling();
  });

  $('#chat-send').off().on('click', inviaMessaggioChat);

  $('#chat-input').off().on('keypress', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      inviaMessaggioChat();
    }
  });

  $('#segnalazioni-table').off('change', '.stato-select').on('change', '.stato-select', function () {
    const id = $(this).data('id');
    const stato = $(this).val();
    cambiaStatoSegnalazione(id, stato);
  });

  $('#chatModal').off('hidden.bs.modal').on('hidden.bs.modal', stopChatPolling);
}

