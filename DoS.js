document.getElementById('dosForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const serverAddress = document.getElementById('serverAddress').value;
    const port = document.getElementById('port').value;
    document.getElementById('status').innerText = 'Conectando...';

    let chart;
    const ctx = document.getElementById('performanceChart').getContext('2d');
    const labels = [];
    const data = {
        labels: labels,
        datasets: [{
            label: 'Latencia (ms)',
            data: [],
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };

    chart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            scales: {
                x: {
                    type: 'category',
                    labels: labels
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    function connectToMinecraftServer(serverAddress, port) {
        const socket = new WebSocket(`ws://${serverAddress}:${port}`);
        socket.onopen = function() {
            document.getElementById('status').innerText = 'Conectado al servidor Minecraft';
            sendPing(socket);
        };
        socket.onmessage = function(event) {
            console.log('Mensaje del servidor:', event.data);
        };
        socket.onclose = function() {
            document.getElementById('status').innerText = 'Desconectado del servidor Minecraft';
        };
        socket.onerror = function(error) {
            document.getElementById('status').innerText = 'Error de conexión: ' + error.message;
        };
    }

    function sendPing(socket) {
        const pingInterval = setInterval(() => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({ action: 'ping' }));
                updateChart();
            } else {
                clearInterval(pingInterval);
            }
        }, 1000); // Enviar ping cada 1 segundo
    }

    function updateChart() {
        const now = new Date();
        const time = now.toLocaleTimeString();
        labels.push(time);
        data.datasets[0].data.push(getRandomLatency()); // Simula la latencia
        chart.update();
    }

    function getRandomLatency() {
        return Math.floor(Math.random() * 200) + 50; // Latencia simulada entre 50 y 250 ms
    }

    connectToMinecraftServer(serverAddress, port);
});
