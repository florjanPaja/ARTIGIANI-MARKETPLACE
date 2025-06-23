async function getTokenUtente() {
    const token = sessionStorage.getItem('authToken');
    const idUtente = sessionStorage.getItem('userId');
    if (!token || !idUtente) {
      window.location.href = 'login.html';
      return {};
    }
    return { token, idUtente };
  }
  
  async function verificaDatiSpedizione(idUtente, token) {
    try {
      const res = await fetch(`/api/utenti/${idUtente}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const utente = await res.json();
  
      const { indirizzo, cap, citta, stato } = utente;
      return !!(indirizzo && cap && citta && stato);
    } catch (err) {
      console.error('Errore verifica spedizione:', err);
      return false;
    }
  }
  
  async function aggiornaContatoreCarrello() {
    const { token, idUtente } = await getTokenUtente();
    try {
      const res = await fetch(`/api/carrello/${idUtente}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const righe = await res.json();
      const totale = righe.reduce((sum, r) => sum + (r.quantita || 0), 0);
      $('#cart-count').text(totale);
    } catch {
      $('#cart-count').text('0');
    }
  }
  
  async function caricaCarrello() {
    const { token, idUtente } = await getTokenUtente();
    const tbody = $('#carrello-table tbody').empty();
    let totale = 0;
    let risparmioTotale = 0;
  
    try {
      const res = await fetch(`/api/carrello/${idUtente}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const righe = await res.json();
  
      if (!righe.length) {
        tbody.append('<tr><td colspan="6" class="text-center text-muted">Il carrello è vuoto.</td></tr>');
        $('#checkout-btn').prop('disabled', true);
        $('#totale-carrello').text('0.00');
        $('#risparmio-carrello').text('');
        aggiornaContatoreCarrello();
        return;
      }
  
      righe.forEach(r => {
        const prezzo = parseFloat(r.prezzo_unitario || 0);
        const prezzoOriginale = parseFloat(r.prezzo_originale || prezzo);
        const quantita = parseInt(r.quantita || 1);
        const max = parseInt(r.disponibilita || 99);
  
        const subtotale = prezzo * quantita;
        const subtotaleOriginale = prezzoOriginale * quantita;
        const risparmio = subtotaleOriginale - subtotale;
  
        totale += subtotale;
        risparmioTotale += risparmio;
  
        tbody.append(`
          <tr>
            <td>${r.nome}</td>
            <td>
              ${prezzoOriginale > prezzo
                ? `<span class="text-danger text-decoration-line-through me-1">€${prezzoOriginale.toFixed(2)}</span>
                   <span class="fw-semibold text-success">€${prezzo.toFixed(2)}</span>`
                : `€${prezzo.toFixed(2)}`
              }
            </td>
            <td>
              <div class="d-flex justify-content-center gap-2">
                <button class="btn btn-outline-secondary btn-sm btn-minus" data-id="${r.id_articolo}" data-prezzo="${prezzo}"><i class="bi bi-dash"></i></button>
                <input type="text" class="form-control form-control-sm text-center qty-input" data-id="${r.id_articolo}" data-max="${max}" value="${quantita}" readonly style="width: 50px;" />
                <button class="btn btn-outline-secondary btn-sm btn-plus" data-id="${r.id_articolo}" data-prezzo="${prezzo}" data-max="${max}"><i class="bi bi-plus"></i></button>
              </div>
            </td>
            <td>€${subtotale.toFixed(2)}</td>
            <td>
              <button class="btn btn-sm btn-outline-danger remove-btn" data-id="${r.id_articolo}">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        `);
      });
  
      $('#totale-carrello').text(totale.toFixed(2));
      $('#risparmio-carrello').text(
        risparmioTotale > 0 ? `Hai risparmiato €${risparmioTotale.toFixed(2)}` : ''
      );
      $('#checkout-btn').prop('disabled', false);
  
      aggiornaContatoreCarrello();
    } catch (err) {
      console.error('Errore caricamento carrello:', err);
      tbody.html('<tr><td colspan="6" class="text-danger text-center">Errore durante il caricamento del carrello.</td></tr>');
    }
  }
  
  async function aggiornaQuantita(idArticolo, quantita, prezzoUnitario) {
    const { token, idUtente } = await getTokenUtente();
    try {
      await fetch('/api/carrello', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ id_utente: idUtente, id_articolo: idArticolo, prezzo_unitario: prezzoUnitario, quantita })
      });
      caricaCarrello();
    } catch {
      alert('Errore aggiornamento quantità');
    }
  }
  
  async function rimuoviArticolo(idArticolo) {
    const { token, idUtente } = await getTokenUtente();
    try {
      await fetch('/api/carrello/rimuovi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ id_utente: idUtente, id_articolo: idArticolo })
      });
      caricaCarrello();
    } catch {
      alert('Errore rimozione articolo');
    }
  }
  
  $(document).ready(() => {
    caricaCarrello();
  
    $('#carrello-table').on('click', '.remove-btn', function () {
      rimuoviArticolo($(this).data('id'));
    });
  
    $('#carrello-table').on('click', '.btn-plus', function () {
      const id = $(this).data('id');
      const prezzo = parseFloat($(this).data('prezzo'));
      const input = $(`.qty-input[data-id="${id}"]`);
      const max = parseInt(input.data('max'));
      let val = parseInt(input.val());
      if (val < max) aggiornaQuantita(id, val + 1, prezzo);
    });
  
    $('#carrello-table').on('click', '.btn-minus', function () {
      const id = $(this).data('id');
      const prezzo = parseFloat($(this).data('prezzo'));
      const input = $(`.qty-input[data-id="${id}"]`);
      let val = parseInt(input.val());
      if (val > 1) aggiornaQuantita(id, val - 1, prezzo);
    });
  
    $('#svuota-carrello-btn').on('click', async () => {
      const { token, idUtente } = await getTokenUtente();
      try {
        const res = await fetch(`/api/carrello/${idUtente}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const righe = await res.json();
        await Promise.all(righe.map(r => rimuoviArticolo(r.id_articolo)));
      } catch (err) {
        console.error('Errore svuotamento carrello:', err);
      }
    });
  
    $('#checkout-btn').on('click', async () => {
      const { token, idUtente } = await getTokenUtente();
      const spedizioneOk = await verificaDatiSpedizione(idUtente, token);
      if (!spedizioneOk) {
        alert('Completa prima i dati di spedizione nel tuo profilo per procedere all\'ordine.');
        window.location.href = 'profilo.html';
      }
    });
  });
  