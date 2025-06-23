$(document).ready(() => {
    fetch('/api/articoli')
      .then(res => {
        if (!res.ok) throw new Error('Errore nella risposta del server');
        return res.json();
      })
      .then(lista => {
        const articoli = lista.map(p => ({
          ...p,
          categoria: (p.categoria || '').trim().toLowerCase()
        }));
  
        const categorie = Array.from(
          new Set(
            articoli
              .map(p => p.categoria)
              .filter(c => c && c.length > 0)
          )
        ).sort();
  
        const container = $('#categorie-box').empty();
  
        categorie.forEach(cat => {
          const id = `cat-${cat.replace(/\s+/g, '-')}`;
          const nomeVisuale = cat.charAt(0).toUpperCase() + cat.slice(1);
          container.append(`
            <div class="form-check">
              <input class="form-check-input" type="checkbox" name="cat-filter" value="${cat}" id="${id}">
              <label class="form-check-label text-capitalize" for="${id}">
                ${nomeVisuale}
              </label>
            </div>
          `);
        });
      })
      .catch(err => {
        console.error('Errore caricamento categorie:', err);
        $('#categorie-box').html('<p class="text-danger">Errore nel caricamento categorie.</p>');
      });
  });
  