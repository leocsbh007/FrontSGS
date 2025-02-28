const modal = document.getElementById("resourceModal");
const addResourceBtn = document.getElementById("addResourceBtn");
const closeModal = document.querySelector(".close");
const form = document.getElementById("resourceForm");
const tableBody = document.getElementById("resourceTableBody");

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
                <td><button onclick="deleteResource(${resource.id})">Deletar</button></td>
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

form.addEventListener("submit", function(event) {
    const token = localStorage.getItem("apiToken");
    event.preventDefault();
    
    let newResource = {
        asset_number: form.asset_number.value.toUpperCase(),
        name: form.name.value.toUpperCase(),
        type: form.type.value,
        description: form.description.value.toUpperCase(),
        status: form.status.value
    };
    console.log(newResource.asset_number);
    console.log(newResource.name);
    console.log(newResource.type);
    console.log(newResource.status);
    axios.post("http://localhost:8000/resources", newResource, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then((response) => {
        modal.style.display = "none";
        console.log("Recurso Criado", response.data);
        alert("Recurso Criado com sucesso!");
        loadResources();
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
});

addResourceBtn.addEventListener("click", () => modal.style.display = "flex");
closeModal.addEventListener("click", () => modal.style.display = "none");
window.addEventListener("click", event => { if (event.target === modal) modal.style.display = "none"; });


// Chama a função de usuários se estivermos na página de usuários
if (window.location.pathname.includes("resources.html")) {
    loadResources();
}
