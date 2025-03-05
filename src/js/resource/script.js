const modal = document.getElementById("resourceModal");
const addResourceBtn = document.getElementById("addResourceBtn");
const closeModal = document.querySelector(".close");
const form = document.getElementById("resourceForm");
const tableBody = document.getElementById("resourceTableBody");

let resourceIdToEdit = null; // Variável global para armazenar o ID do recurso que será editado

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


function loadResources() {    
    const token = localStorage.getItem("apiToken");  
    
    axios.get("http://localhost:8000/resources", {
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
    .catch(error => console.error("Erro ao carregar recursos:", error));
}

function deleteResource(id) {    
    const token = localStorage.getItem("apiToken");    
    axios.delete(`http://localhost:8000/resources/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => loadResources())
    .catch(error => console.error("Erro ao deletar recurso:", error));
}

// Função para abrir o modal e preencher com os dados do recurso para edição
function editResource(id) {
    const token = localStorage.getItem("apiToken");
    
    axios.get(`http://localhost:8000/resources/${id}`, {
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

        // Define o ID do recurso que será editado
        resourceIdToEdit = resource.id;
        
        // Exibe o modal
        modal.style.display = "flex";
    })
    .catch(error => {
        console.error("Erro ao carregar os dados do recurso:", error);
        alert("Erro ao carregar os dados do recurso.");
    });
}

// Enviar dados do formulário (criação ou edição de recurso)
form.addEventListener("submit", function(event) {
    const token = localStorage.getItem("apiToken");
    event.preventDefault();

    let resourceData = {
        asset_number: form.asset_number.value.toUpperCase(),
        name: form.name.value.toUpperCase(),
        type: form.type.value,
        description: form.description.value.toUpperCase(),
        status: form.status.value
    };

    // Se o resourceIdToEdit estiver definido, estamos editando o recurso, caso contrário estamos criando
    const url = resourceIdToEdit ? `http://localhost:8000/resources/${resourceIdToEdit}` : "http://localhost:8000/resources";
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
    form.reset();
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
