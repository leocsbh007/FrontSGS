const modal = document.getElementById("loanModal");
const addLoanButton = document.getElementById("addLoanBtn");
const closeModal = document.querySelector(".close");
const loanForm = document.getElementById("loanForm");
const tableBody = document.getElementById("loanTable");


addLoanButton.addEventListener("click", () => {
    document.getElementById("modalTitle").textContent = "Adicionar Empréstimo";
    document.getElementById("name").value = "";
    document.getElementById("resource").value = "";
    document.getElementById("status").value = "DISPONIVEL PARA EMPRÉSTIMO";

    modal.style.display = "flex";
})

closeModal.addEventListener("click", () => modal.style.display = "none");



