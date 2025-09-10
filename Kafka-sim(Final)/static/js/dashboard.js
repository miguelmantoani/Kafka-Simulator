let currentFilter = "";

// Renderiza cada card do broker
function renderBrokerCard(broker, data) {
    const container = document.getElementById("brokers");
    let card = document.getElementById("card-" + broker);

    if (!card) {
        const col = document.createElement("div");
        col.className = "col-md-6";
        col.innerHTML = `
            <div class="card shadow broker-card" id="card-${broker}">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">
                        <a href="http://localhost:${data.port}" target="_blank">${broker}</a>
                    </h5>
                    <span id="status-${broker}"></span>
                </div>
                <div class="card-body">
                    <canvas id="chart-${broker}" height="150"></canvas>
                    <h6 class="mt-3">📨 Últimas mensagens</h6>
                    <ul id="messages-${broker}" class="list-group last-messages"></ul>
                </div>
            </div>
        `;
        container.appendChild(col);
    }

    // Atualizar status
    const statusEl = document.getElementById("status-" + broker);
    statusEl.innerHTML = data.status === "online"
      ? '<span class="status-online">● Online</span>'
      : '<span class="status-offline">● Offline</span>';

    // Atualizar mensagens filtradas
    const msgList = document.getElementById("messages-" + broker);
    msgList.innerHTML = "";
    data.last_messages
        .filter(m => !currentFilter || `${m[0]}-P${m[1]}` === currentFilter)
        .forEach(m => {
            const li = document.createElement("li");
            li.className = "list-group-item";
            li.textContent = `[${m[0]} - P${m[1]}] ${m[2]} @ ${m[3]}`;
            msgList.appendChild(li);
        });

    // Atualizar gráfico
    let partitions = data.partitions;
    if (currentFilter) {
        partitions = partitions.filter(p => `${p[0]}-P${p[1]}` === currentFilter);
    }
    updateChart("chart-" + broker, partitions, broker);
}

// Atualiza gráfico Chart.js
function updateChart(canvasId, partitions, label) {
    const ctx = document.getElementById(canvasId).getContext("2d");
    const labels = partitions.map(p => `${p[0]}-P${p[1]}`);
    const values = partitions.map(p => p[2]);

    if (window[canvasId] && window[canvasId] instanceof Chart) {
        window[canvasId].data.labels = labels;
        window[canvasId].data.datasets[0].data = values;
        window[canvasId].update();
    } else {
        window[canvasId] = new Chart(ctx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    label: `Mensagens em ${label}`,
                    data: values,
                    backgroundColor: "rgba(75, 192, 192, 0.6)"
                }]
            },
            options: { responsive: true, plugins: { legend: { display: false } } }
        });
    }
}

// Atualiza todos os brokers e o filtro
async function refresh() {
    const response = await fetch("/dashboard/data");
    const data = await response.json();

    // Renderiza os cards
    Object.keys(data).forEach(broker => renderBrokerCard(broker, data[broker]));

    // Atualizar filtro com todas as partições de todos os brokers
    const allPartitions = new Set();
    Object.values(data).forEach(brokerData => {
        brokerData.partitions.forEach(p => {
            allPartitions.add(`${p[0]}-P${p[1]}`);
        });
    });

    const filter = document.getElementById("filter");
    const selected = filter.value;
    filter.innerHTML = '<option value="">Todos</option>';
    Array.from(allPartitions).sort().forEach(val => {
        filter.innerHTML += `<option value="${val}" ${val===selected?'selected':''}>${val}</option>`;
    });
}

// Evento do filtro
document.getElementById("filter").addEventListener("change", e => {
    currentFilter = e.target.value;
    refresh();
});

// Atualiza a cada 2 segundos
setInterval(refresh, 2000);
refresh();