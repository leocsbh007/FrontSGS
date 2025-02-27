// document.addEventListener("DOMContentLoaded", function() {
//     const modal = document.getElementById("resourceModal");
//     const addResourceBtn = document.getElementById("addResourceBtn");
//     const closeModal = document.querySelector(".close");
    
//     addResourceBtn.addEventListener("click", function() {
//         modal.style.display = "flex";
//     });
    
//     closeModal.addEventListener("click", function() {
//         modal.style.display = "none";
//     });
    
//     window.addEventListener("click", function(event) {
//         if (event.target === modal) {
//             modal.style.display = "none";
//         }
//     });
// });



document.addEventListener("DOMContentLoaded", function() {
    const modal = document.getElementById("resourceModal");
    const addResourceBtn = document.getElementById("addResourceBtn");
    const closeModal = document.querySelector(".close");
    const form = document.getElementById("resourceForm");
    const tableBody = document.getElementById("resourceTableBody");
    
    function loadResources() {
        axios.get("http://localhost:8000/resources")
            .then(response => {
                tableBody.innerHTML = "";
                response.data.forEach(resource => {
                    const row = `<tr>
                        <td>${resource.id}</td>
                        <td>${resource.name}</td>
                        <td>${resource.type}</td>
                        <td>${resource.status}</td>
                        <td><button onclick="deleteResource(${resource.id})">Deletar</button></td>
                    </tr>`;
                    tableBody.innerHTML += row;
                });
            })
            .catch(error => console.error("Erro ao carregar recursos:", error));
    }
    
    function deleteResource(id) {
        axios.delete(`http://localhost:8000/resources/${id}`)
            .then(() => loadResources())
            .catch(error => console.error("Erro ao deletar recurso:", error));
    }
    
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const newResource = {
            name: form.name.value,
            type: form.type.value,
            status: form.status.value
        };
        axios.post("http://localhost:8000/resources", newResource)
            .then(() => {
                modal.style.display = "none";
                loadResources();
            })
            .catch(error => console.error("Erro ao adicionar recurso:", error));
    });
    
    addResourceBtn.addEventListener("click", () => modal.style.display = "flex");
    closeModal.addEventListener("click", () => modal.style.display = "none");
    window.addEventListener("click", event => { if (event.target === modal) modal.style.display = "none"; });
    
    loadResources();
});