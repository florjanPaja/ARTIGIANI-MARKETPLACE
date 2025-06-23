window.chart = window.chart || null;

function initOrdiniComponent() {
  const tbody = document.getElementById("ordini-list");
  const alertBox = document.getElementById("ordini-alert");
  const vuotoBox = document.getElementById("ordini-vuoti");
  const tabellaBox = document.getElementById("ordini-tabella-container");
  const wrapperGrafico = document.getElementById("grafico-stato-ordini");
  const statoModal = document.getElementById('stato-modal');
  const statoSelect = document.getElementById('stato-select');
  const totaleBox = document.getElementById("totale-ordini");
  const infoBox = document.getElementById("info-artigiano");

  const token = sessionStorage.getItem('authToken');
  const userData = JSON.parse(sessionStorage.getItem("utente") || "{}");

  if (!alertBox) return;

  if (!userData?.id || userData.ruolo !== "artigiano") {
    alertBox.textContent = "Accesso non autorizzato.";
    alertBox.classList.remove("d-none");
    return;
  }

  if (infoBox && userData.nome) {
    infoBox.textContent = `Benvenuto, ${userData.nome}`;
  }

  async function caricaOrdini() {
    try {
      const res = await fetch(`/api/ordini/artigiano/${userData.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      if (!res.ok) throw new Error("Errore caricamento ordini");
  
      const ordini = await res.json();
      if (!tbody || !vuotoBox || !tabellaBox) return;
  
      tbody.innerHTML = "";
  
      if (!ordini.length) {
        vuotoBox.classList.remove("d-none");
        tabellaBox.classList.add("d-none");
        aggiornaGrafico({});
        if (totaleBox) totaleBox.textContent = "";
        return;
      }
  
      vuotoBox.classList.add("d-none");
      tabellaBox.classList.remove("d-none");
  
      let totaleOrdini = 0;
      const statiCounter = {};
  
      for (const ordine of ordini) {
        const row = document.createElement("tr");
  
        // 🔽 Carica le righe per ottenere il totale reale
        let totale = 0;
        try {
          const dettaglioRes = await fetch(`/api/ordini/${ordine.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
  
          if (dettaglioRes.ok) {
            const { righe } = await dettaglioRes.json();
            for (const r of righe) {
              const prezzo = parseFloat((r.prezzo_unitario || "").toString().trim());
              const quantita = parseFloat((r.quantita || "").toString().trim());
              if (!isNaN(prezzo) && !isNaN(quantita)) {
                totale += prezzo * quantita;
              }
            }
          }
        } catch (err) {
          console.warn(`Errore nel calcolo totale per ordine ${ordine.id}`, err);
        }
  
        totaleOrdini += totale;
        const totaleDisplay = `€${totale.toFixed(2)}`;
  
        row.innerHTML = `
          <td>${ordine.id}</td>
          <td>${new Date(ordine.data_ordine).toLocaleDateString()}</td>
          <td>${ordine.nome_cliente || "—"}</td>
          <td>${totaleDisplay}</td>
          <td><span class="badge bg-${badgeClass(ordine.stato)}">${ordine.stato}</span></td>
          <td>
            <button class="btn btn-sm btn-outline-primary btn-stato" data-id="${ordine.id}">Modifica</button>
            <button class="btn btn-sm btn-outline-secondary btn-dettagli" data-id="${ordine.id}">Dettagli</button>
          </td>
        `;
        tbody.appendChild(row);
  
        statiCounter[ordine.stato] = (statiCounter[ordine.stato] || 0) + 1;
      }
  
      aggiornaGrafico(statiCounter);
  
      if (totaleBox) {
        totaleBox.textContent = `Totale complessivo (calcolato dalle righe): €${totaleOrdini.toFixed(2)}`;
      }
  
    } catch (err) {
      if (alertBox) {
        alertBox.textContent = err.message;
        alertBox.classList.remove("d-none");
      }
    }
  }
  

  function badgeClass(stato) {
    return {
      'pagato': 'success',
      'in preparazione': 'secondary',
      'spedito': 'info',
      'annullato': 'danger'
    }[stato] || 'light';
  }

  function aggiornaGrafico(data) {
    const canvas = document.getElementById("grafico-ordini-canvas");
    if (!canvas || !wrapperGrafico) return;

    if (chart) chart.destroy();

    chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: Object.keys(data),
        datasets: [{
          data: Object.values(data),
          backgroundColor: ['#198754', '#6c757d', '#0d6efd', '#dc3545']
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } }
      }
    });

    wrapperGrafico.classList.remove("d-none");
  }

  document.addEventListener("click", async (e) => {
    if (!e.target) return;

    if (e.target.matches(".btn-stato")) {
      const ordineId = e.target.dataset.id;

      if (!statoModal || !statoSelect) return;

      const rect = e.target.getBoundingClientRect();
      statoModal.style.top = `${rect.bottom + window.scrollY}px`;
      statoModal.style.left = `${rect.left + window.scrollX}px`;
      statoModal.classList.remove("d-none");

      statoSelect.onchange = async () => {
        await fetch(`/api/ordini/${ordineId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ stato: statoSelect.value })
        });
        statoModal.classList.add("d-none");
        caricaOrdini();
      };
    } else if (!e.target.closest("#stato-modal")) {
      statoModal?.classList.add("d-none");
    }

    if (e.target.matches(".btn-dettagli")) {
      mostraDettagliOrdine(e.target.dataset.id);
    }
  });

  async function mostraDettagliOrdine(id) {
    try {
      const res = await fetch(`/api/ordini/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Errore caricamento dettagli");

      const { righe } = await res.json();
      const tbody = document.getElementById("modal-righe");
      const totaleBox = document.getElementById("modal-totale");

      if (!tbody || !totaleBox) return;

      tbody.innerHTML = "";
      let totaleOrdine = 0;

      for (const r of righe) {
        const tr = document.createElement("tr");

        const prezzoStr = (r.prezzo_unitario || "").toString().trim();
        const prezzo = parseFloat(prezzoStr);
        const quantita = parseFloat(r.quantita);
        const totaleRiga = !isNaN(prezzo) && !isNaN(quantita) ? prezzo * quantita : 0;
        totaleOrdine += totaleRiga;

        tr.innerHTML = `
          <td>${r.nome_articolo}</td>
          <td>${quantita}</td>
          <td>€${isNaN(prezzo) ? "0.00" : prezzo.toFixed(2)}</td>
          <td>€${totaleRiga.toFixed(2)}</td>
        `;
        tbody.appendChild(tr);
      }

      totaleBox.textContent = `Totale Ordine: €${totaleOrdine.toFixed(2)}`;
      const modal = document.getElementById('modal-dettagli-ordine');
      if (modal) new bootstrap.Modal(modal).show();
    } catch (err) {
      if (alertBox) {
        alertBox.textContent = err.message;
        alertBox.classList.remove("d-none");
      }
    }
  }

  caricaOrdini();
}

// Esponi initView globalmente
window.initView = initOrdiniComponent;
