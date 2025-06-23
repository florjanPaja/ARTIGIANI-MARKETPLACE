$(function () {
    const token = sessionStorage.getItem('authToken');
    if (!token) return window.location.href = '/login.html';
  
    const $alert = $('#dash-alert');
    const $productsTbody = $('#products-table tbody');
    const $ordersTbody = $('#orders-table tbody');
  
    function showError(msg) {
      $alert.text(msg).removeClass('d-none');
    }
  
    function parseJwt(token) {
      try {
        return JSON.parse(atob(token.split('.')[1]));
      } catch {
        return null;
      }
    }
  
    function loadArticoli() {
      $.ajax({
        url: '/api/articoli/artigiano/me',
        headers: { Authorization: 'Bearer ' + token },
        success: res => {
          $productsTbody.empty();
          res.forEach(p => {
            $productsTbody.append(`
              <tr data-id="${p.id}">
                <td>${p.id}</td>
                <td>${p.nome}</td>
                <td>€${(p.prezzo_scontato ?? p.prezzo).toFixed(2)}</td>
                <td>${p.disponibilita > 0 ? '✅' : '❌'}</td>
                <td>
                  <button class="btn btn-sm btn-warning edit-btn">Modifica</button>
                  <button class="btn btn-sm btn-danger del-btn">Elimina</button>
                </td>
              </tr>`);
          });
        },
        error: xhr => showError(xhr.responseJSON?.message || 'Errore caricamento articoli.')
      });
    }
  
    function loadOrdini() {
      const userId = parseJwt(token)?.id;
      if (!userId) return showError('Token non valido.');
  
      $.ajax({
        url: `/api/ordini/utente/${userId}`,
        headers: { Authorization: 'Bearer ' + token },
        success: res => {
          $ordersTbody.empty();
          res.forEach(o => {
            const badge = o.stato === 'in attesa' ? 'warning' :
                          o.stato === 'completato' ? 'success' : 'secondary';
            $ordersTbody.append(`
              <tr>
                <td>${o.id}</td>
                <td>${new Date(o.data_ordine).toLocaleDateString()}</td>
                <td>€${o.totale?.toFixed(2) || 'n/a'}</td>
                <td><span class="badge bg-${badge}">${o.stato}</span></td>
                <td><a href="/pages/ordine.html?id=${o.id}" class="btn btn-sm btn-outline-primary">Dettagli</a></td>
              </tr>`);
          });
        },
        error: xhr => showError(xhr.responseJSON?.message || 'Errore caricamento ordini.')
      });
    }
  
    $('#products-table').on('click', '.del-btn', function () {
      const id = $(this).closest('tr').data('id');
      if (!confirm('Confermi eliminazione?')) return;
      $.ajax({
        url: `/api/articoli/${id}`,
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + token },
        success: loadArticoli,
        error: xhr => showError(xhr.responseJSON?.message || 'Errore eliminazione.')
      });
    });
  
    $('#addProductModal').on('shown.bs.modal', function () {
      $('#modal-articolo-container').load('/components/form-nuovo-articolo.html', function () {
        $('#new-articolo-form').on('submit', function (e) {
          e.preventDefault();
          this.classList.add('was-validated');
          if (!this.checkValidity()) return;
  
          const data = {
            nome: $('#nome').val().trim(),
            descrizione: $('#descrizione').val().trim(),
            prezzo: parseFloat($('#prezzo').val()),
            disponibilita: parseInt($('#disponibilita').val()),
            categoria: $('#categoria').val().trim(),
            sconto_percentuale: parseFloat($('#sconto').val()) || 0,
            immagini: $('#immagini').val().split(',').map(x => x.trim()).filter(Boolean)
          };
  
          $.ajax({
            url: '/api/articoli',
            method: 'POST',
            contentType: 'application/json',
            headers: { Authorization: 'Bearer ' + token },
            data: JSON.stringify(data),
            success: () => {
              bootstrap.Modal.getInstance($('#addProductModal')[0]).hide();
              loadArticoli();
            },
            error: xhr => $('#articolo-error').text(xhr.responseJSON?.message || 'Errore creazione articolo').show()
          });
        });
      });
    });
  
    $('#logout-btn').on('click', e => {
      e.preventDefault();
      sessionStorage.removeItem('authToken');
      location.href = '/login.html';
    });
  
    $('#articoli-section').load('/components/articoli.html', loadArticoli);
    $('#ordini-section').load('/components/ordini.html', loadOrdini);
  });
  