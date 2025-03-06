const port = "8080"; // Ajustei pois por algum motivo o meu backendo não estava mais subindo na Porta 8000
const API_URL = `http://localhost:${port}`; // Altere para a URL do seu backend

const modal = document.getElementById("userModal");
const addUserBtn = document.getElementById("addUserBtn");
const closeModal = document.querySelector(".close");
const userform = document.getElementById("userForm");
const tableBody = document.getElementById("userTable");

let userIdToEdit = null;

function checkoutAuth() {
    const token = localStorage.getItem("apiToken");
    if (!token) {
        console.log("Token expirado ou inválido. Redirecionando para login...");
        alert("Você precisa estar logado para acessar essa página!");
        window.location.href = "login.html"; 
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

// Função para carregar os usuários da API e exibir na tabela
function getUsers() {
    const token = localStorage.getItem("apiToken");    

    axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }        
    })
    .then(response => {
        const dadosUsers = response.data; 
        tableBody.innerHTML = ""; 

        dadosUsers.forEach(infoUser => {
            const row = tableBody.insertRow();
            const estruturaHtmlUsers = `  
                <td>${infoUser.id}</td>
                <td>${infoUser.username}</td>
                <td>${infoUser.email}</td>
                <td>${infoUser.role}</td>
                <td class='actions'>
                    <button onclick="deleteUser(${infoUser.id})">Deletar</button>
                    <button onclick="editUser(${infoUser.id}, '${infoUser.username}', '${infoUser.email}', '${infoUser.role}')">Editar</button>                    
                </td>
            `;
            row.innerHTML = estruturaHtmlUsers; 
        });

    })
    .catch(error => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("apiToken");
            checkoutAuth();            
        } else {
        console.error("Erro ao carregar usuários:", error);
        }
    });
}

// Função para adicionar ou editar um usuário
userform.addEventListener("submit", function(event) {
    event.preventDefault();

    const token = localStorage.getItem("apiToken");

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const role = document.getElementById("role").value;
    const password = document.getElementById("password").value;

    if (!name || !email || !role || !password) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    const validRoles = ["ADMIN", "FUNCIONARIO", "GERENTE", "ADMIN_SEGURANCA"];
    if (!validRoles.includes(role)) {
        alert(`Cargo inválido. Escolha entre: ${validRoles.join(", ")}`);
        return;
    }

    const userData = {
        username: name,
        email: email,
        role: role,
        password: password
    };

    // Se estiver editando, fazer PUT
    if (userIdToEdit) {
        axios.put(`${API_URL}/users/${userIdToEdit}`, userData, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            console.log("Usuário atualizado:", response.data);
            alert("Usuário atualizado");
            getUsers();
            modal.style.display = "none";
        })
        .catch(error => {
            console.error("Erro ao atualizar usuário:", error);
            alert("Erro ao atualizar usuário.");
        });

    } else { // Se não, fazer POST
        axios.post(`${API_URL}/users`, userData, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            console.log("Usuário adicionado:", response.data);
            alert("Usuário adicionado");
            getUsers(); 
            modal.style.display = "none";
        })
        .catch(error => {        
            console.error("Erro ao adicionar usuário:", error);
            alert("Erro ao adicionar usuário.");
        });
    }
});

// Função para editar um usuário
function editUser(userId, currentUsername, currentEmail, currentRole) {
    document.getElementById("modalTitle").textContent = "Editar Usuário";
    document.getElementById("name").value = currentUsername;
    document.getElementById("email").value = currentEmail;
    document.getElementById("role").value = currentRole;

    userIdToEdit = userId;
    modal.style.display = "flex"; 
}

// Função para deletar um usuário
function deleteUser(userId) {
    const token = localStorage.getItem("apiToken");

    axios.delete(`${API_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
        console.log("Usuário deletado:", response.data);
        alert("Usuário deletado");
        getUsers(); 
    })
    .catch(error => {
        console.error("Erro ao deletar usuário:", error);
    });
}

// Abrir o modal para adicionar um novo usuário
addUserBtn.addEventListener("click", () => {
    document.getElementById("modalTitle").textContent = "Adicionar Usuário";  
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("role").value = "FUNCIONARIO"; 
    document.getElementById("password").value = "";

    userIdToEdit = null; 
    modal.style.display = "flex"; 
});

// Fechar o modal
closeModal.addEventListener("click", () => modal.style.display = "none");

if (window.location.pathname.includes("users.html")) {
    getUsers();
}


