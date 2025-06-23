$(document).ready(function () {
  const token = sessionStorage.getItem('authToken');
  if (!token) return location.href = '/pages/home.html';

  const $tbody = $('#orders-table tbody');
  const $noOrdersMessage = $('#no-orders-message');
  const $errorAlert = $('#order-alert');

  // Utility per mostrare messaggi di errore
  function showError(msg) {
    $errorAlert.text(msg).removeClass('d-none');
  }

  // Colori badge per stato ordine
  function getBadgeClass(stato) {
    return {
      in_attesa: 'secondary',
      pagato: 'success',
      spedito: 'info',
      annullato: 'danger'
    }[stato] || 'light';
  }

  // Popola la tabella con gli ordini ricevuti
  function renderOrdini(ordini) {
    $tbody.empty();

    if (ordini.length === 0) {
      $noOrdersMessage.removeClass('d-none');
      return;
    } else {
      $noOrdersMessage.addClass('d-none');
    }

    ordini.forEach(o => {
      const data = new Date(o.data_ordine).toLocaleString();
      const statoBadge = `<span class="badge bg-${getBadgeClass(o.stato)}">${o.stato}</span>`;

      const row = $(`
        <tr>
          <td>${o.id}</td>
          <td>${o.nome_cliente || o.email || '-'}</td>
          <td>${data}</td>
          <td>${statoBadge}</td>

        </tr>
      `);

      $tbody.append(row);
    });
  }

  // Recupera lista ordini
  function caricaOrdini() {
    $.ajax({
      url: '/api/ordini/admin/all',
      method: 'GET',
      headers: { Authorization: 'Bearer ' + token },
      success: renderOrdini,
      error: function (xhr) {
        showError(xhr.responseJSON?.message || 'Errore nel caricamento degli ordini.');
      }
    });
  }

  // Richiesta per aggiornare lo stato di un ordine
  function aggiornaStato(id) {
    const nuovoStato = prompt('Nuovo stato (in_attesa, pagato, spedito, annullato):');
    if (!nuovoStato) return;

    $.ajax({
      url: `/api/ordini/${id}`,
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({ stato: nuovoStato }),
      success: caricaOrdini,
      error: function (xhr) {
        showError(xhr.responseJSON?.message || 'Errore durante l\'aggiornamento dello stato.');
      }
    });
  }

  // Delegazione per pulsante "Aggiorna"
  $tbody.on('click', '.update-btn', function () {
    const id = $(this).data('id');
    aggiornaStato(id);
  });

  // Caricamento iniziale
  caricaOrdini();
});
