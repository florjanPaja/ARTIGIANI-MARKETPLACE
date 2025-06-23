$(document).ready(async () => {
    const token = sessionStorage.getItem('authToken');
    const ordineId = localStorage.getItem('ordineId');
  
    if (!token || !ordineId) {
      alert('Sessione scaduta o ordine non trovato.');
      return (window.location.href = 'layout.html');
    }
  
    try {
      const res = await fetch(`/api/ordini/${ordineId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      if (!res.ok) throw new Error('Errore recupero ordine');
  
      const ordine = await res.json();
  
      $('#ordine-id').text(ordine.id || '-');
      $('#ordine-data').text(new Date(ordine.data_ordine).toLocaleString());
  
      const totale = ordine.righe.reduce((sum, r) =>
        sum + (parseFloat(r.prezzo_unitario || 0) * r.quantita), 0);
      $('#ordine-totale').text(totale.toFixed(2));
  
      const tbody = $('#righe-ordine').empty();
      ordine.righe.forEach(r => {
        const subtotale = r.quantita * parseFloat(r.prezzo_unitario);
        tbody.append(`
          <tr>
            <td>${r.nome_articolo || '—'}</td>
            <td>€${parseFloat(r.prezzo_unitario).toFixed(2)}</td>
            <td>${r.quantita}</td>
            <td>€${subtotale.toFixed(2)}</td>
          </tr>
        `);
      });
  
      localStorage.removeItem('ordineId');
    } catch (err) {
      console.error('Errore caricamento ordine:', err);
      alert('Errore nel caricamento dell\'ordine.');
      window.location.href = 'layout.html';
    }
  });
  