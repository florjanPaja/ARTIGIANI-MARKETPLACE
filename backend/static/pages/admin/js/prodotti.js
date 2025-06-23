$(document).ready(function () {
  const token = sessionStorage.getItem('authToken');
  if (!token) return window.location.href = '/pages/home.html';

  const tbody = $('#products-table tbody');
  const alertBox = $('#product-alert');
  const noProductsRow = $('#no-products');

  function showError(msg) {
    alertBox.text(msg).removeClass('d-none');
  }

  function hideError() {
    alertBox.addClass('d-none').text('');
  }

  function loadStats() {
    $.ajax({
      url: '/api/articoli/admin/stats',
      method: 'GET',
      headers: { Authorization: 'Bearer ' + token },
      success: function (data) {
        $('#product-stats').removeClass('d-none');
        $('#stat-totale').text(data.totale_prodotti);
        $('#stat-esauriti').text(data.esauriti);
        $('#stat-sconto').text(data.in_sconto);
      },
      error: () => {
        $('#product-stats').addClass('d-none');
      }
    });
  }

  function loadProducts() {
    hideError();
    $.ajax({
      url: '/api/articoli',
      method: 'GET',
      headers: { Authorization: 'Bearer ' + token },
      success: function (products) {
        tbody.find('tr:not(#no-products)').remove();

        if (!products.length) {
          noProductsRow.removeClass('d-none');
          return;
        }

        noProductsRow.addClass('d-none');

        products.forEach(p => {
          const prezzoRaw = (p.prezzo + '').trim(); // pulizia spazi
          const prezzoNum = Number(prezzoRaw);      // cast a numero
          const prezzo = isNaN(prezzoNum)
            ? 'N/A'
            : `€ ${prezzoNum.toFixed(2)}`;          // formato sicuro

          const row = $(`
            <tr>
              <td>${p.id}</td>
              <td>${p.nome || '-'}</td>
              <td>${prezzo}</td>
              <td>${p.disponibilita ?? '-'}</td>
              <td>${p.categoria || '-'}</td>
              <td>${p.in_sconto ? `${p.sconto_percentuale}%` : '–'}</td>
              <td>
                <button class="btn btn-sm btn-danger delete-btn" data-id="${p.id}">Elimina</button>
              </td>
            </tr>
          `);
          tbody.append(row);
        });
      },
      error: function (xhr) {
        showError(xhr.responseJSON?.message || 'Errore caricamento prodotti');
      }
    });
  }

  // Elimina prodotto
  tbody.on('click', '.delete-btn', function () {
    const id = $(this).data('id');
    if (!confirm("Vuoi eliminare questo prodotto?")) return;

    $.ajax({
      url: `/api/articoli/${id}`,
      method: 'DELETE',
      headers: { Authorization: 'Bearer ' + token },
      success: function () {
        loadProducts();
        loadStats();
      },
      error: function (xhr) {
        showError(xhr.responseJSON?.message || 'Errore durante l’eliminazione');
      }
    });
  });

  loadProducts();
  loadStats();
});
