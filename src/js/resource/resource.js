const port = "8080"; // Ajustei pois por algum motivo o meu backendo não estava mais subindo na Porta 8000
const API_URL = `http://localhost:${port}`; // Altere para a URL do seu backend

const modal = document.getElementById("resourceModal");
const addResourceBtn = document.getElementById("addResourceBtn");
const closeModal = document.querySelector(".close");
const resourceForm = document.getElementById("resourceForm");
const tableBody = document.getElementById("resourceTableBody");

let resourceIdToEdit = null;

function checkoutAuth() {
    const token = localStorage.getItem("apiToken");
    if (!token) {
        console.log("Token expirado ou invalido. Redirecionando para login...");
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

function loadResources() {    
    const token = localStorage.getItem("apiToken");  
    
    axios.get(`${API_URL}/resources`, {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
        tableBody.innerHTML = "";
        response.data.forEach(resource => {
            const row = `<tr>
                <td>${resource.id}</td>
                <td>${resource.asset_number}</td>
                <td>${resource.name}</td>
                <td>${resource.type}</td>
                <td>${resource.description}</td>
                <td>${resource.status}</td>
                <td>
                    <button onclick="deleteResource(${resource.id})">Deletar</button>
                    <button onclick="editResource(${resource.id})">Editar</button>                                    
                </td>
            </tr>`;
            tableBody.innerHTML += row;
        });
    })
    .catch(error => {
        if (error.response && error.response.status === 401){
            localStorage.removeItem("apiToken");
            checkoutAuth()
        } else {
            console.error("Erro ao carregar recursos:", error);
        }
    });
}

function deleteResource(id) {    
    const token = localStorage.getItem("apiToken");    
    axios.delete(`${API_URL}/resources/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
        console.log("Recurso deletado:", response.data);
        alert("Recurso deletado");
        loadResources()})
    .catch(error => {
        console.error("Erro ao deletar recurso:", error);
    });
}

// Função para abrir o modal e preencher com os dados do recurso para edição
function editResource(id) {
    const token = localStorage.getItem("apiToken");
    console.log("Editando")
    
    axios.get(`${API_URL}/resources/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
        const resource = response.data;
        
        // Preenche o modal com os dados do recurso
        document.getElementById('name').value = resource.name;
        document.getElementById('asset_number').value = resource.asset_number;
        document.getElementById('type').value = resource.type;
        document.getElementById('status').value = resource.status;
        document.getElementById('description').value = resource.description;
        
        resourceIdToEdit = resource.id;
        modal.style.display = "flex";
    })
    .catch(error => {
        console.error("Erro ao carregar os dados do recurso: ", error);
        alert("Erro ao carregar os dados do recurso.");
    });
}

resourceForm.addEventListener("submit", function(event) {
    const token = localStorage.getItem("apiToken");
    event.preventDefault();    
    let resourceData = {
        asset_number: resourceForm.asset_number.value.toUpperCase(),
        name: resourceForm.name.value.toUpperCase(),
        type: resourceForm.type.value,
        description: resourceForm.description.value.toUpperCase(),
        status: resourceForm.status.value
    };

    // Se o resourceIdToEdit estiver definido, estamos editando o recurso, caso contrário estamos criando
    const url = resourceIdToEdit ? `${API_URL}/resources/${resourceIdToEdit}` : `${API_URL}/resources/`;
    const method = resourceIdToEdit ? "put" : "post"; // PUT para editar, POST para criar

    axios[method](url, resourceData, {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
        // Fechar o modal
        modal.style.display = "none";
        alert(`Recurso ${resourceIdToEdit ? 'editado' : 'criado'} com sucesso!`);
        
        // Atualizar a tabela de recursos
        loadResources();
        
        // Limpar o resourceIdToEdit após a operação
        resourceIdToEdit = null;
    })
    .catch(error => {
        if (error.response) {
            console.log("Erro de Validação:", error.response.data);
            alert(`Erro: ${error.response.data.detail}`);
        } else if (error.request) {
            console.log("Erro de Requisição:", error.request);
            alert("Erro ao conectar ao Servidor.");
        } else {
            console.log("Erro de Servidor:", error.message);
            alert("Erro ao conectar ao Servidor.");
        }
    });
});

addResourceBtn.addEventListener("click", () => {
    // Limpar o formulário e garantir que estamos criando um novo recurso    
    resourceForm.reset();
    resourceIdToEdit = null;
    modal.style.display = "flex";
});

closeModal.addEventListener("click", () => modal.style.display = "none");
window.addEventListener("click", event => { 
    if (event.target === modal) modal.style.display = "none"; 
});

// Carregar recursos ao abrir a página
if (window.location.pathname.includes("resources.html")) {
    loadResources();
}
