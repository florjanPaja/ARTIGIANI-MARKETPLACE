$(document).ready(async () => {
    const token = sessionStorage.getItem('authToken');
    const idUtente = sessionStorage.getItem('userId');
  
    if (!token || !idUtente) return location.href = '/';
  
    try {
      const res = await fetch(`/api/ordini/utente/${idUtente}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const ordini = await res.json();
  
      const tbody = $('#ordini-body').empty();
      if (!ordini.length) {
        tbody.html('<tr><td colspan="5" class="text-center text-muted">Nessun ordine trovato.</td></tr>');
        return;
      }
  
      ordini.forEach(o => {
        const riga = $(
          `<tr>
            <td>${o.id}</td>
            <td>${new Date(o.data_ordine).toLocaleString()}</td>
            <td>€${parseFloat(o.totale).toFixed(2)}</td>
            <td>${o.stato}</td>
            <td><button class="btn btn-sm btn-primary" data-id="${o.id}">Dettagli</button></td>
          </tr>`
        );
        tbody.append(riga);
      });
    } catch (err) {
      console.error('Errore caricamento ordini:', err);
      $('#ordini-body').html('<tr><td colspan="5" class="text-danger text-center">Errore nel caricamento degli ordini.</td></tr>');
    }
  
    $('#ordini-body').on('click', 'button[data-id]', async function () {
      const idOrdine = $(this).data('id');
      try {
        const res = await fetch(`/api/ordini/${idOrdine}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error();
        const ordine = await res.json();
  
        $('#modal-id').text(ordine.id);
        $('#modal-data').text(new Date(ordine.data_ordine).toLocaleString());
        $('#modal-stato').text(ordine.stato);
  
        const tbody = $('#modal-righe').empty();
        ordine.righe.forEach(r => {
          const tot = parseFloat(r.totale_riga || r.prezzo_unitario * r.quantita);
          tbody.append(`
            <tr>
              <td>${r.nome_articolo}</td>
              <td>${r.quantita}</td>
              <td>€${parseFloat(r.prezzo_unitario).toFixed(2)}</td>
              <td>€${parseFloat(tot).toFixed(2)}</td>
            </tr>
          `);
        });
  
        new bootstrap.Modal('#ordineModal').show();
      } catch (err) {
        alert('Errore nel recupero dettagli ordine');
        console.error(err);
      }
    });
  });
  