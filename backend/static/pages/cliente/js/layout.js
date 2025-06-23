// Mostra i dettagli di un articolo nella modale
function mostraDettagli(p) {
    $('#modal-title').text(p.nome);
    $('#modal-desc').text(p.descrizione || '—');
    $('#modal-prezzo').text(p.disponibilita === 0 ? 'Esaurito' : parseFloat(p.prezzo_scontato ?? p.prezzo).toFixed(2));
    $('#modal-disp').text(p.disponibilita);
    $('#modal-cat').text(p.categoria || '—');
  
    const imgSrc = Array.isArray(p.immagini) && p.immagini.length > 0
      ? p.immagini[0]
      : 'https://via.placeholder.com/600x400?text=Nessuna+immagine';
  
    $('#modal-img').attr('src', imgSrc);
  
    $('#btn-aggiungi-dettaglio')
      .data('id', p.id)
      .data('prezzo', parseFloat(p.prezzo_scontato ?? p.prezzo))
      .data('max', p.disponibilita)
      .prop('disabled', p.disponibilita === 0);
  
    $('#modal-quantita').val(1);
    $('#btn-qty-increase').data('max', p.disponibilita);
    $('#btn-qty-increase').prop('disabled', p.disponibilita <= 1);
    $('#btn-qty-decrease').prop('disabled', true);
  
    new bootstrap.Modal('#productModal').show();
  }
  
  // Aggiorna il contatore carrello nella navbar
  async function aggiornaContatoreCarrello(righe = null) {
    const token = sessionStorage.getItem('authToken');
    const idUtente = sessionStorage.getItem('userId');
    if (!token || !idUtente) return $('#cart-count').text('0');
  
    try {
      if (!righe) {
        const res = await fetch(`/api/carrello/${idUtente}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error();
        righe = await res.json();
      }
  
      const totale = righe.reduce((sum, r) => sum + (r.quantita || 0), 0);
      $('#cart-count').text(totale);
  
      righe.forEach(r => {
        const input = $(`.qty-input[data-id="${r.id_articolo}"]`);
        input.val(r.quantita);
        const max = parseInt(input.data('max'));
        input.siblings('.btn-plus').prop('disabled', r.quantita >= max);
        input.siblings('.btn-minus').prop('disabled', r.quantita <= 1);
      });
    } catch (err) {
      console.error('Errore aggiornamento contatore carrello:', err);
      $('#cart-count').text('0');
    }
  }
  
  // Aggiunge un articolo al carrello
  async function aggiungiAlCarrello(idArticolo, prezzo, quantita = 1) {
    const idUtente = sessionStorage.getItem('userId');
    const token = sessionStorage.getItem('authToken');
    if (!idUtente || !token) return alert('Devi essere autenticato');
  
    try {
      const res = await fetch('/api/carrello', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ id_utente: idUtente, id_articolo: idArticolo, prezzo_unitario: prezzo, quantita })
      });
      if (!res.ok) throw new Error();
      await res.json();
      aggiornaContatoreCarrello();
    } catch (err) {
      console.error('Errore aggiunta carrello:', err);
    }
  }
  
  // Carica e filtra gli articoli
  async function loadArticoli() {
    try {
      $('#product-grid').html('<div class="text-center w-100"><div class="spinner-border text-info" role="status"></div></div>');
  
      const [resArt, resCart] = await Promise.all([
        fetch('/api/articoli'),
        fetch(`/api/carrello/${sessionStorage.getItem('userId')}`, {
          headers: { Authorization: `Bearer ${sessionStorage.getItem('authToken')}` }
        })
      ]);
  
      const articoli = await resArt.json();
      const carrello = await resCart.json();
      const carrelloMap = Object.fromEntries(carrello.map(r => [r.id_articolo, r.quantita]));
  
      const grid = $('#product-grid').empty();
      const ricerca = $('#search-input').val()?.trim().toLowerCase() || '';
      const categorieAttive = $('input[name="cat-filter"]:checked')
        .map(function () { return this.value.toLowerCase(); })
        .get();
  
      const filtrati = articoli.filter(p => {
        const matchTesto = p.nome.toLowerCase().includes(ricerca) || p.descrizione?.toLowerCase().includes(ricerca);
        const matchCategoria = categorieAttive.length === 0 || categorieAttive.includes((p.categoria || '').toLowerCase());
        return matchTesto && matchCategoria;
      });
  
      if (filtrati.length === 0) {
        grid.html('<p class="text-center text-muted">Nessun articolo corrispondente.</p>');
        return;
      }
  
      filtrati.forEach(p => {
        const prezzo = parseFloat(p.prezzo) || 0;
        const sconto = parseFloat(p.sconto_percentuale) || 0;
        const prezzoScontato = parseFloat(p.prezzo_scontato) || prezzo;
        const haSconto = p.in_sconto === true && sconto > 0;
  
        const imgSrc = Array.isArray(p.immagini) && p.immagini.length > 0
          ? p.immagini[0]
          : 'https://via.placeholder.com/300x200?text=Nessuna+immagine';
  
        const prezzoHtml = p.disponibilita === 0
          ? `<span class="fw-semibold text-danger">Esaurito</span>`
          : haSconto
            ? `<span class="text-danger text-decoration-line-through me-2">€${prezzo.toFixed(2)}</span>
               <span class="fw-semibold text-success">€${prezzoScontato.toFixed(2)}</span>
               <span class="badge bg-warning text-dark ms-2">-${sconto}%</span>`
            : `<span class="fw-semibold">€${prezzo.toFixed(2)}</span>`;
  
        const btnAdd = p.disponibilita === 0
          ? `<button class="btn btn-secondary btn-sm w-100" disabled><i class="bi bi-cart-x"></i> Non disponibile</button>`
          : `<button class="btn btn-success btn-sm w-100 add-cart-btn" 
                      data-id="${p.id}" 
                      data-prezzo="${prezzoScontato}">
                <i class="bi bi-cart-plus"></i> Aggiungi al carrello
             </button>`;
  
        const quantitaInCarrello = carrelloMap[p.id] ?? 1;
  
        grid.append(`
          <div class="col-md-4 mb-4">
            <div class="card h-100 shadow-sm">
              <img src="${imgSrc}" class="card-img-top" alt="${p.nome}" />
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">${p.nome}</h5>
                <p class="card-text small">${p.descrizione || '—'}</p>
                <div class="mb-2">${prezzoHtml}</div>
                <div class="d-flex align-items-center justify-content-center gap-2 mb-2">
                  <button class="btn btn-outline-secondary btn-sm btn-minus" data-id="${p.id}"><i class="bi bi-dash"></i></button>
                  <input type="text" class="form-control form-control-sm text-center qty-input" data-id="${p.id}" data-max="${p.disponibilita}" value="${quantitaInCarrello}" readonly style="width: 50px;" />
                  <button class="btn btn-outline-secondary btn-sm btn-plus" data-id="${p.id}" data-max="${p.disponibilita}"><i class="bi bi-plus"></i></button>
                </div>
                <div class="mt-auto">
                  ${btnAdd}
                </div>
              </div>
            </div>
          </div>`);
      });
  
      aggiornaContatoreCarrello(carrello);
    } catch (err) {
      console.error('Errore caricamento articoli:', err);
      $('#product-grid').html('<p class="text-danger text-center">Errore nel caricamento degli articoli.</p>');
    }
  }
  
  // Init
  $(document).ready(() => {
    $('#logout-btn').on('click', () => {
      sessionStorage.clear();
      location.href = '/';
    });
  
    $('#search-input').on('input', loadArticoli);
    $('#modal-filtri').on('hidden.bs.modal', loadArticoli);
    $('#categorie-box').on('change', 'input[name="cat-filter"]', loadArticoli);
  
    $('#product-grid')
      .on('click', '.btn-plus', function () {
        const id = $(this).data('id');
        const input = $(`.qty-input[data-id="${id}"]`);
        const max = parseInt(input.data('max'));
        let val = parseInt(input.val()) || 1;
        if (val < max) {
          val += 1;
          input.val(val);
          $(this).prop('disabled', val >= max);
          input.siblings('.btn-minus').prop('disabled', val <= 1);
        }
      })
      .on('click', '.btn-minus', function () {
        const id = $(this).data('id');
        const input = $(`.qty-input[data-id="${id}"]`);
        let val = parseInt(input.val()) || 1;
        if (val > 1) {
          val -= 1;
          input.val(val);
          $(this).prop('disabled', val <= 1);
          input.siblings('.btn-plus').prop('disabled', false);
        }
      })
      .on('click', '.add-cart-btn', function () {
        const id = $(this).data('id');
        const prezzo = parseFloat($(this).data('prezzo'));
        const qty = parseInt($(`.qty-input[data-id="${id}"]`).val()) || 1;
        aggiungiAlCarrello(id, prezzo, qty);
      });
  
    loadArticoli();
  });
  