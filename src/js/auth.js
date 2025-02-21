const API_URL = "http://localhost:8000"; // Altere para a URL do seu backend

document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await axios.post(`${API_URL}/login`, { username, email, password });

        // console.log("Resposta da API:", response.data);

        if (response.data.access_token){
            localStorage.setItem("apiToken", response.data.access_token); // Armazena o token no localStorage
            // console.log("Token Salvo:", localStorage.getItem('apiToken')); // Substitua 'token' pelo nome correto do item no localStorage
            window.location.href = "index.html"; // Redireciona para a área protegida
        }
        else{
            console.error("Nenhum token foi retornado pela API");
            document.getElementById("message").textContent = "Erro: Nenhum token foi retornado pela API.";
        }
        
        
        
    } catch (error) {
        document.getElementById("message").textContent = "Erro: " + (error.response?.data?.detail || "Erro ao conectar");
    }
});
