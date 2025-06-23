$(document).ready(function () {
    const token = sessionStorage.getItem('authToken');
    if (!token) return window.location.href = '/pages/home.html';
  
    function parseJwt(token) {
      try {
        return JSON.parse(atob(token.split('.')[1]));
      } catch (e) {
        return null;
      }
    }
  
    function showError(msg) {
      $('#admin-alert').text(msg).removeClass('d-none');
    }
  
    const payload = parseJwt(token);
    const currentId = payload?.id;
  
    $.ajax({
      url: '/api/utenti',
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + token },
      success: function (users) {
        const tbody = $('#users-table tbody').empty();
        users.forEach(u => {
          const isSelf = u.id === currentId;
          const rowClass = isSelf ? 'table-success' : '';
  
          const ruoloBadge = {
            cliente: '<span class="badge bg-secondary">Cliente</span>',
            artigiano: '<span class="badge bg-primary">Artigiano</span>',
            admin: '<span class="badge bg-danger">Admin</span>'
          }[u.ruolo] || u.ruolo;
  
          tbody.append(`
            <tr class="${rowClass}">
              <td>${u.id}</td>
              <td>${u.email}</td>
              <td>${u.nome || '-'}</td>
              <td>${ruoloBadge}</td>
              <td>
                <button class="btn btn-sm btn-info details-btn" data-id="${u.id}">Dettagli</button>
                ${!isSelf ? `<button class="btn btn-sm btn-danger delete-btn" data-id="${u.id}">Elimina</button>` : ''}
              </td>
            </tr>
          `);
        });
      },
      error: function (xhr) {
        showError(xhr.responseJSON?.message || 'Errore durante il caricamento utenti.');
      }
    });
  
    $('#users-table').on('click', '.details-btn', function () {
      const id = $(this).data('id');
      $.ajax({
        url: `/api/utenti/${id}`,
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token },
        success: function (user) {
          $('#detail-id').text(user.id);
          $('#detail-email').text(user.email);
          $('#detail-nome').text(user.nome || '-');
          $('#detail-ruolo').text(user.ruolo || '-');
          $('#detail-telefono').text(user.telefono || '-');
          $('#detail-indirizzo').text(user.indirizzo || '-');
          $('#detail-citta').text(user.citta || '-');
          $('#detail-stato').text(user.stato || '-');
  
          if (user.ruolo === 'artigiano') {
            $('#detail-piva').text(user.partita_iva || '-');
            $('#detail-bio').text(user.bio || '-');
            $('#detail-sito').text(user.sito_web || '-');
            $('#artigiano-extra').removeClass('d-none');
          } else {
            $('#artigiano-extra').addClass('d-none');
          }
  
          const modal = new bootstrap.Modal(document.getElementById('userDetailsModal'));
          modal.show();
        },
        error: function (xhr) {
          showError(xhr.responseJSON?.message || 'Errore nel recupero dei dettagli utente.');
        }
      });
    });
  
    $('#users-table').on('click', '.delete-btn', function () {
      const id = $(this).data('id');
      if (!confirm('Confermi eliminazione utente?')) return;
  
      $.ajax({
        url: `/api/admin/users/${id}`,
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token },
        success: () => location.reload(),
        error: xhr => showError(xhr.responseJSON?.message || 'Eliminazione fallita.')
      });
    });
  });
  