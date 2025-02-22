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
        const dadosUsers = response.data; // Array de usuários
        const contentUsers = document.getElementById("user-list");       
        const table = document.getElementById('userTable');
        
        if (!table) {
            console.error("Erro: Elemento #Table não encontrado no DOM!");
            return;
        }
    
        // Limpa o conteúdo da tabela antes de inserir novos dados
        table.innerHTML = ""; 
    
        // Itera sobre os dados dos usuários e cria uma linha para cada um
        dadosUsers.forEach(infoUser => {
            const row = table.insertRow(); // Cria uma nova linha para cada usuário
    
            // Preenche a linha com os dados do usuário
            const estruturaHtmlUsers = `  
                <td>${infoUser.username}</td>
                <td>${infoUser.email}</td>
                <td>${infoUser.role}</td>
                <td class='actions'>
                    <button onclick="editUser(${infoUser.id}, '${infoUser.username}', '${infoUser.email}', '${infoUser.role}')">✏️</button> | 
                    <button onclick="deleteUser(${infoUser.id})">🗑️</button>
                </td>
            `;
            
            row.innerHTML = estruturaHtmlUsers; // Preenche a linha com o HTML
        });
    
        console.log("Usuários:", response.data);
    })
    .catch(error => {
        console.error("Erro ao carregar usuários:", error);
    });

    
}

// Função para adicionar um novo usuário (POST)
function addUser() {
    const token = localStorage.getItem("apiToken");
    
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const role = document.getElementById("role").value;
    const password = document.getElementById("password").value;

    if (!name || !email || !role || !password) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    axios.post("http://localhost:8000/users", {
        username: name,
        email: email,
        role: role,
        password: password
    }, {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
        console.log("Usuário adicionado:", response.data);
        getUsers(); // Atualiza a lista de usuários
        clearInputs(); // Limpa os campos de entrada
    })
    .catch(error => {
        console.error("Erro ao adicionar usuário:", error);
    });
}

// Função para editar usuário (PUT)
function editUser(userId, currentUsername, currentEmail, currentRole) {
    const token = localStorage.getItem("apiToken");

    const newUsername = prompt("Novo Nome de Usuário:", currentUsername);
    const newEmail = prompt("Novo E-mail:", currentEmail);
    const newRole = prompt("Novo Cargo:", currentRole);

    if (newUsername && newEmail && newRole) {
        axios.put(`http://localhost:8000/users/${userId}`, {
            username: newUsername,
            email: newEmail,
            role: newRole
        }, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            console.log("Usuário atualizado:", response.data);
            getUsers(); // Atualiza a lista de usuários
        })
        .catch(error => {
            console.error("Erro ao atualizar usuário:", error);
        });
    }
}

// Função para deletar usuário (DELETE)
function deleteUser(userId) {
    const token = localStorage.getItem("apiToken");

    axios.delete(`http://localhost:8000/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
        console.log("Usuário deletado:", response.data);
        getUsers(); // Atualiza a lista de usuários após a exclusão
    })
    .catch(error => {
        console.error("Erro ao deletar usuário:", error);
    });
}

// Função para limpar os campos de entrada
function clearInputs() {
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("role").value = "";
    document.getElementById("password").value = "";
}

// Chama a função de usuários se estivermos na página de usuários
if (window.location.pathname.includes("users.html")) {
    getUsers();    
}




