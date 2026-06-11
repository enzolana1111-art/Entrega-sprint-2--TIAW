    const api_base = "http://localhost:3000"

    const map = L.map('map').setView([-19.9245, -43.9352], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);

    let marcadores = [];
    let heatLayer = null;

    function renderizar() {
      const filtro = document.getElementById('filtro').value;
      const lista = document.getElementById('lista');

      marcadores.forEach(m => map.removeLayer(m));
      marcadores = [];
      if (heatLayer) map.removeLayer(heatLayer);
      lista.innerHTML = '';


      async function getFunc() {
        const response = await fetch(api_base + '/denuncias');
        const denuncias = await response.json();
        const filtradas = filtro === 'Todos' ? denuncias : denuncias.filter(d => d.status === filtro);
        const pontos = filtradas.map(d => [d.lat, d.lng, 1]);
        heatLayer = L.heatLayer(pontos, { radius: 40, blur: 30 }).addTo(map);

        filtradas.forEach(d => {
          const m = L.marker([d.lat, d.lng])
            .addTo(map)
            .bindPopup(`<b>${d.titulo}</b><br>${d.bairro}<br>Status: ${d.status}`);
          marcadores.push(m);

          lista.innerHTML += `<p><b>${d.titulo}</b><br>${d.bairro} — ${d.status}</p><hr>`;
        });
      }
      getFunc();


    }

    renderizar();


