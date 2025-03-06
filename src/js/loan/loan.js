const port = "8080"; // Ajustei pois por algum motivo o meu backendo não estava mais subindo na Porta 8000
const API_URL = `http://localhost:${port}`; // Altere para a URL do seu backend
const modal = document.getElementById("loanModal");
const addLoanButton = document.getElementById("addLoanBtn");
const closeModal = document.querySelector(".close");
const loanForm = document.getElementById("loanForm");
const tableBody = document.getElementById("loanTable");

let loanIdToEdit = null; 

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

function loadLoans(){
    const token = localStorage.getItem("apiToken");

    axios.get(`${API_URL}/loans`,{
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
        tableBody.innerHTML = "";
        response.data.forEach(loan => {
            const row = `<tr>
                <td>${loan.id}</td>
                <td>${loan.user_id}</td>
                <td>${loan.resource_id}</td>
                <td>${loan.start_date}</td>
                <td>${loan.status}</td>
                <td>${loan.calculated_end_date}</td>
                <td>
                    <button onclick="deleteLoan(${loan.id})">Deletar</button>
                    <button onclick="editLoan(${loan.id})">Editar</button>                                    
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
            console.error("Erro ao carregar emprestimos:", error);
        }
    });
}

function editLoan(id){
    const token = localStorage.getItem("apiToken");
    axios.get(`${API_URL}/loans/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then (response => {
        const loan = response.data;

        document.getElementById("name").value = loan.user_id;        
        document.getElementById("resource").value = loan.resource_id;        
        document.getElementById("status").value = loan.status;
        // document.getElementById("status").value = "DISPONIVEL PARA EMPRÉSTIMO";

        loanIdToEdit = loan.id;
        modal.style.display = "flex";
    })
    .catch(error => {
        console.error("Erro ao carregar os dados do empréstimo: ", error);
        alert("Erro ao carregar os dados do empréstimo.");
    });
}

loanForm.addEventListener("submit", function(event){
    const token = localStorage.getItem("apiToken");
    event.preventDefault();
    let loanData = {
        user_id: loanForm.user_id.value,
        resource_id: loanForm.resource_id.value,
        status: loanForm.status.value
    };
    const url = loanIdToEdit ? `${API_URL}/loans/${loanIdToEdit}` : `${API_URL}/loans`;
    const method = loanIdToEdit ? "put" : "post";

    axios[method](url, loanData, {
        headres : { Authorization: `Bearer ${token}` }
    })
    .then (response => {
        modal.style.display = "none";
        alert(`Empréstimo ${loanIdToEdit ? 'editado' : 'criado'} com sucesso!`);
        loadLoans()
        loanIdToEdit = null;
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


addLoanButton.addEventListener("click", () => {
    document.getElementById("modalTitle").textContent = "Adicionar Empréstimo";
    document.getElementById("name").value = "";
    document.getElementById("resource").value = "";    
    document.getElementById("status").value = "DISPONIVEL PARA EMPRÉSTIMO";

    modal.style.display = "flex";
})

closeModal.addEventListener("click", () => modal.style.display = "none");

if (window.location.pathname.includes("loans.html")){
    loadLoans();
}

