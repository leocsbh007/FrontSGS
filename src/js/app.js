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
        const table = document.getElementById('userTable');
        
        if (!table) {
            console.error("Erro: Elemento #Table não encontrado no DOM!");
            return;
        }
    
        // console.log("Usuários:", response.data);
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
                    <button onclick="editUser(${infoUser.id}, '${infoUser.username}', '${infoUser.email}', '${infoUser.role}')">Editar</button>
                    <button onclick="deleteUser(${infoUser.id})">Deletar</button>
                </td>
            `;
            
            row.innerHTML = estruturaHtmlUsers; // Preenche a linha com o HTML
        });

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
    let role = document.getElementById("role").value;
    const password = document.getElementById("password").value;

   

    if (!name || !email || !role || !password) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    role = role.toUpperCase(); // Converte o cargo para maiúsculas
    // Validação de cargo
    const validRoles = ["ADMIN", "FUNCIONARIO", "GERENTE", "ADMIN_SEGURANCA"];
    if (!validRoles.includes(role)) {
        alert(`Cargo inválido. Escolha entre: ${validRoles.join(", ")}`);
        return;
    }

    // Validação de formato de e-mail
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
        alert("Por favor, insira um e-mail válido.");
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
        if (error.response) {
            console.log("Erro de Validação:", error.response.data);
            alert(`Erro: ${error.response.data.detail}`);
        } 
        else if (error.request) {
            console.log("Erro de Requisição:", error.request);
            alert("Erro ao conectar ao Servidor.");
        }
        else {
            console.log("Erro de Servidor:", error.message);
            alert("Erro ao conectar ao Servidor.");
        }
    });
}

// Função para editar usuário (PUT)
function editUser(userId, currentUsername, currentEmail, currentRole) {
    const token = localStorage.getItem("apiToken");

    // Prompt para coletar os novos dados do usuário
    const newUsername = prompt("Novo Nome de Usuário:", currentUsername) || currentUsername;
    const newEmail = prompt("Novo E-mail:", currentEmail) || currentEmail;
    let newRole = prompt("Novo Cargo:", currentRole) || currentRole;

    newRole = newRole.toUpperCase(); // Converte o cargo para maiúsculas
    // Validação de cargo
    const validRoles = ["ADMIN", "FUNCIONARIO", "GERENTE", "ADMIN_SEGURANCA"];
    if (!validRoles.includes(newRole)) {
        alert(`Cargo inválido. Escolha entre: ${validRoles.join(", ")}`);
        return;
    }

    // Validação de formato de e-mail
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(newEmail)) {
        alert("Por favor, insira um e-mail válido.");
        return;
    }

    // Validando se os campos necessários foram preenchidos
    if (newUsername && newEmail && newRole) {
        // Inicializa o objeto de dados com os campos obrigatórios
        let data = {
            username: newUsername,
            email: newEmail,
            role: newRole,
            password: ""  // Enviar uma string vazia se a senha não for atualizada
        };

        
        // Atualiza a senha 
        const newPassword = prompt("Digite a nova senha:");
        if (newPassword && newPassword.length >= 4) {
            data.password = newPassword; // Adiciona a nova senha ao objeto de dados
        } else {
            alert("A senha deve ter no mínimo 4 caracteres.");                
            return;
        }       
        

        // Enviando a requisição PUT com Axios
        axios.put(`http://localhost:8000/users/${userId}`, data, {
            headers: { 
                Authorization: `Bearer ${token}` 
            }
        })
        .then(response => {
            console.log("Usuário atualizado:", response.data);
            alert("Usuário atualizado com sucesso!");
            getUsers(); // Atualiza a lista de usuários
        })
        .catch(error => {
            console.error("Erro ao atualizar usuário:", error);
            if (error.response) {
                console.log("Erro de Validção:", error.response.data);
                alert(`Erro: ${error.response.data.detail}`);
            } else {
                alert("Erro ao conectar ao Servidor.");
            }
        });
    } else {
        alert("Por favor, preencha todos os campos.");
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




