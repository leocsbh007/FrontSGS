const API_URL = "http://localhost:8000"; // Altere para a URL do seu backend

document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await axios.post(`${API_URL}/login`, { username, email, password });

        localStorage.setItem("apiToken", response.data.token); // Armazena o token
        window.location.href = "dashboard.html"; // Redireciona para a área protegida
    } catch (error) {
        document.getElementById("message").textContent = "Erro: " + (error.response?.data?.detail || "Erro ao conectar");
    }
});
