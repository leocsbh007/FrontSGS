const API_URL = "http://localhost:8000"; // URL da API


function checkoutAuth() {
    const token = localStorage.getItem("apiToken");
    if (!token) {
        alert("Você precisa estar logado para acessar essa página!");
        window.location.href = "login.html"; // Redireciona para login se não tiver token
    }
}

// Verifica se o usuário está autenticado
checkoutAuth();

// Evento do botão de logout
// Logout (remover token e redirecionar)
document.getElementById("logout-btn").addEventListener("click", function() {
    localStorage.removeItem("apiToken");
    window.location.href = "login.html";
});

// Exemplo de requisição protegida para buscar usuários
function getUsers() {
    
    const token = localStorage.getItem("apiToken");
    axios.get("http://localhost:8000/users", {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
        console.log("Usuários:", response.data);
    })
    .catch(error => {
        console.error("Erro ao carregar usuários:", error);
    });
}

// Chama a função de usuários se estivermos na página de usuários
if (window.location.pathname.includes("users.html")) {
    getUsers();
}


