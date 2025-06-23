$(document).ready(() => {
    const token = sessionStorage.getItem('authToken');
    const idUtente = sessionStorage.getItem('userId');
    const toast = new bootstrap.Toast('#toast-carrello');
    const $toastMsg = $('#toast-messaggio');
  
    if (!token || !idUtente) return;
  
    $('#pagamento-form').on('submit', async function (e) {
      e.preventDefault();
  
      try {
        // 1. Carica righe carrello
        const res = await fetch(`/api/carrello/${idUtente}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Errore nel recupero del carrello');
  
        const righe = await res.json();
        if (!righe.length) return alert('Il carrello è vuoto.');
  
        // 2. Calcola importo
        const importo = righe.reduce((tot, r) =>
          tot + (parseFloat(r.prezzo_unitario || 0) * r.quantita), 0);
  
        // 3. Crea ordine
        const ordineRes = await fetch('/api/ordini', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            righe: righe.map(r => ({
              id_articolo: r.id_articolo,
              prezzo_unitario: r.prezzo_unitario,
              quantita: r.quantita
            }))
          })
        });
  
        if (!ordineRes.ok) throw new Error('Errore creazione ordine');
  
        const { ordineId } = await ordineRes.json();
        localStorage.setItem('ordineId', ordineId);
  
        // 4. Simula pagamento
        const pagamentoRes = await fetch('/api/pagamenti', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            id_ordine: ordineId,
            importo: Number(importo.toFixed(2)),
            metodo_pagamento: 'carta'
          })
        });
        if (!pagamentoRes.ok) throw new Error('Errore pagamento');
  
        // 5. Completa pagamento
        await fetch(`/api/pagamenti/${ordineId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ stato_pagamento: 'completato' })
        });
  
        // 6. Svuota carrello
        await Promise.all(righe.map(r =>
          fetch('/api/carrello/rimuovi', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ id_utente: idUtente, id_articolo: r.id_articolo })
          })
        ));
  
        // 7. Mostra messaggio e reindirizza
        bootstrap.Modal.getInstance(document.getElementById('checkoutModal')).hide();
        $toastMsg.text('Pagamento completato. Ordine registrato.');
        toast.show();
  
        setTimeout(() => window.location.href = 'ordine-successo.html', 2000);
      } catch (err) {
        console.error('Errore durante il processo:', err);
        $toastMsg.text('Errore durante il pagamento. Riprova.');
        toast.show();
      }
    });
  });
  