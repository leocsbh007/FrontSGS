const API_URL = "http://localhost:8000"; // Altere para a URL correta

// Verifica se o usuário está autenticado
const token = localStorage.getItem("apiToken");
if (!token) {
    window.location.href = "index.html"; // Redireciona para login se não tiver token
}

// Atualiza os dados do usuário autenticado
document.getElementById("updateForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    

    try {
        const response = await axios.put(`${API_URL}/user/1`, { username, password, email }, {
            headers: { Authorization: token } // Enviando o token
        });

        document.getElementById("status").textContent = "Dados atualizados!";
    } catch (error) {
        document.getElementById("status").textContent = "Erro: " + (error.response?.data?.detail || "Erro ao conectar");
    }
});

// Logout (remover token e redirecionar)
document.getElementById("logout").addEventListener("click", function() {
    localStorage.removeItem("apiToken");
    window.location.href = "index.html";
});
