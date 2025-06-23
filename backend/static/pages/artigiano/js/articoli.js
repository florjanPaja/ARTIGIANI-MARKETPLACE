$(document).ready(function () {
  const API_URL = '/api/articoli';
  const token = sessionStorage.getItem('authToken');
  if (!token) {
    alert('Sessione scaduta. Effettua il login.');
    window.location.href = '/pages/home.html';
    return;
  }

  let immaginiEsistenti = [];
  let immaginiRimosse = [];
  let editSelectedFiles = [];

  function parseJwt(token) {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return {};
    }
  }

  async function caricaArticoli() {
    try {
      const res = await fetch(`${API_URL}/artigiano/${parseJwt(token).id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const articoli = await res.json();
      const tbody = $('#articoli-table tbody').empty();

      if (!articoli.length) {
        $('#articoli-tabella-container').addClass('d-none');
        $('#articoli-vuoti').removeClass('d-none');
        return;
      }

      $('#articoli-tabella-container').removeClass('d-none');
      $('#articoli-vuoti').addClass('d-none');

      articoli.forEach(a => {
        const prezzoScontato = a.in_sconto
          ? (a.prezzo - (a.prezzo * a.sconto_percentuale / 100)).toFixed(2)
          : '-';
        const dataInizio = a.data_inizio_sconto?.split('T')[0] || '-';
        const dataFine = a.data_fine_sconto?.split('T')[0] || '-';

        tbody.append(`
          <tr>
            <td>${a.nome}</td>
            <td>€ ${parseFloat(a.prezzo).toFixed(2)}</td>
            <td>${a.sconto_percentuale || '-'}</td>
            <td>${prezzoScontato}</td>
            <td>${a.disponibilita}</td>
            <td>${a.categoria || '-'}</td>
            <td>${a.in_sconto ? "Sì" : "No"}</td>
            <td>${dataInizio}</td>
            <td>${dataFine}</td>
            <td>
              <div class="btn-group btn-group-sm">
                <button class="btn btn-outline-primary btn-dettagli" data-id="${a.id}"><i class="bi bi-eye"></i></button>
                <button class="btn btn-outline-warning btn-modifica" data-id="${a.id}"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-outline-danger btn-elimina" data-id="${a.id}"><i class="bi bi-trash"></i></button>
              </div>
            </td>
          </tr>
        `);
      });

      $('.btn-dettagli').on('click', mostraDettagliArticolo);
      $('.btn-modifica').on('click', apriModificaArticolo);
      $('.btn-elimina').on('click', eliminaArticolo);
    } catch {
      $('#articoli-alert').removeClass('d-none').text('Errore nel caricamento articoli.');
    }
  }

  async function caricaStatistiche() {
    try {
      const userId = parseJwt(token).id;
      const res = await fetch(`/api/articoli/artigiano/${userId}/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const stats = await res.json();
      $('#stat-totale').text(stats.totale);
      $('#stat-esauriti').text(stats.esauriti);
      $('#stat-sconto').text(stats.in_sconto);
      $('#articoli-stats').removeClass('d-none');
    } catch {
      $('#articoli-stats').addClass('d-none');
    }
  }

  async function mostraDettagliArticolo() {
    const id = $(this).data('id');
    const res = await fetch(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const a = await res.json();
    $('#detail-nome').text(a.nome);
    $('#detail-descrizione').text(a.descrizione || '-');
    $('#detail-prezzo').text(parseFloat(a.prezzo).toFixed(2));
    $('#detail-disponibilita').text(a.disponibilita);
    $('#detail-categoria').text(a.categoria || '-');
    $('#detail-sconto').text(a.sconto_percentuale || '0');
    $('#detail-prezzo-scontato').text(a.in_sconto ? (a.prezzo - (a.prezzo * a.sconto_percentuale / 100)).toFixed(2) : '-');
    $('#detail-in-sconto').text(a.in_sconto ? 'Sì' : 'No');
    $('#detail-periodo-sconto').text((a.data_inizio_sconto?.split('T')[0] || '-') + ' → ' + (a.data_fine_sconto?.split('T')[0] || '-'));
    $('#detail-immagine').attr('src', a.immagini?.[0] || 'https://via.placeholder.com/600x400?text=Articolo');
    new bootstrap.Modal('#articoloDetailsModal').show();
  }

  async function apriModificaArticolo() {
    const id = $(this).data('id');
    const res = await fetch(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const a = await res.json();
    $('#edit-index').val(a.id);
    $('#edit-nome').val(a.nome);
    $('#edit-prezzo').val(a.prezzo);
    $('#edit-disponibilita').val(a.disponibilita);
    $('#edit-categoria').val(a.categoria);
    $('#edit-descrizione').val(a.descrizione);
    $('#edit-sconto-percentuale').val(a.sconto_percentuale || '');
    $('#edit-in-sconto').prop('checked', a.in_sconto);
    $('#edit-data-inizio-sconto').val(a.data_inizio_sconto?.split('T')[0] || '');
    $('#edit-data-fine-sconto').val(a.data_fine_sconto?.split('T')[0] || '');
    immaginiEsistenti = a.immagini || [];
    immaginiRimosse = [];
    editSelectedFiles = [];
    mostraImmaginiEsistenti();
    $('#edit-immagini').val('');
    $('#edit-preview-immagini').empty();
    new bootstrap.Modal('#editArticoloModal').show();
  }

  async function eliminaArticolo() {
    const id = $(this).data('id');
    if (!confirm('Confermi l\'eliminazione dell\'articolo?')) return;
    await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    caricaArticoli();
    caricaStatistiche();
  }

  $('#edit-articolo-form').on('submit', async function (e) {
    e.preventDefault();

    const inSconto = $('#edit-in-sconto').is(':checked');
    const dataInizio = $('#edit-data-inizio-sconto').val();
    const dataFine = $('#edit-data-fine-sconto').val();

    if (inSconto && (!dataInizio || !dataFine)) {
      alert('Se "In sconto" è selezionato, devi specificare le date di inizio e fine.');
      return;
    }

    if (immaginiEsistenti.length + editSelectedFiles.length === 0) {
      alert('Devi caricare almeno una immagine.');
      return;
    }

    const id = $('#edit-index').val();
    const isNew = !id;
    const formData = new FormData();
    formData.append('nome', $('#edit-nome').val());
    formData.append('prezzo', $('#edit-prezzo').val());
    formData.append('disponibilita', $('#edit-disponibilita').val());
    formData.append('categoria', $('#edit-categoria').val());
    formData.append('descrizione', $('#edit-descrizione').val());
    formData.append('sconto_percentuale', $('#edit-sconto-percentuale').val());
    formData.append('in_sconto', inSconto);
    formData.append('data_inizio_sconto', dataInizio);
    formData.append('data_fine_sconto', dataFine);
    formData.append('immaginiEsistenti', JSON.stringify(immaginiEsistenti));
    formData.append('immaginiDaRimuovere', JSON.stringify(immaginiRimosse));
    editSelectedFiles.forEach(file => formData.append('immagini', file));

    const url = isNew ? API_URL : `${API_URL}/${id}`;
    const method = isNew ? 'POST' : 'PUT';

    await fetch(url, {
      method,
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    bootstrap.Modal.getInstance(document.getElementById('editArticoloModal')).hide();
    caricaArticoli();
    caricaStatistiche();
  });

  $('#btn-nuovo-articolo').on('click', function () {
    $('#edit-articolo-form')[0].reset();
    $('#edit-index').val('');
    immaginiEsistenti = [];
    immaginiRimosse = [];
    editSelectedFiles = [];
    $('#edit-immagini-esistenti, #edit-preview-immagini').empty();
  });

  $('#edit-immagini').on('change', function () {
    editSelectedFiles = Array.from(this.files);
    const container = $('#edit-preview-immagini').empty();
    editSelectedFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        container.append(`
          <div class="position-relative">
            <img src="${e.target.result}" class="img-thumbnail" style="width:100px;height:100px;object-fit:cover;">
            <button type="button" class="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 btn-remove-edit" data-index="${index}">×</button>
          </div>
        `);
      };
      reader.readAsDataURL(file);
    });
  });

  $(document).on('click', '.btn-remove-edit', function () {
    const index = $(this).data('index');
    editSelectedFiles.splice(index, 1);
    $('#edit-immagini').trigger('change');
  });

  $(document).on('click', '.btn-remove-esistente', function () {
    const index = $(this).data('index');
    immaginiRimosse.push(immaginiEsistenti[index]);
    immaginiEsistenti.splice(index, 1);
    mostraImmaginiEsistenti();
  });

  function mostraImmaginiEsistenti() {
    const container = $('#edit-immagini-esistenti').empty();
    immaginiEsistenti.forEach((url, i) => {
      container.append(`
        <div class="position-relative">
          <img src="${url}" class="img-thumbnail" style="width:100px;height:100px;object-fit:cover;">
          <button type="button" class="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 btn-remove-esistente" data-index="${i}">×</button>
        </div>
      `);
    });
  }

  caricaArticoli();
  caricaStatistiche();
});
