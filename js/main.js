
const axiosInstance = axios.create({
  baseURL: ENDPOINT,
  timeout: 10000,
});

const studentAxios = axios.create({
  baseURL: STUDENTPOINT,
  timeout: 10000,
})

//HEADER MODAL ------------------------------

// const openModal = document.querySelector("#add-btn");
const modalOverlay = document.querySelector(".modal-overlay");
const modalCloseBtn = document.querySelector(".close");
const openModal = document.querySelector("#add-btn");


openModal.addEventListener("click", modalActive);

function modalActive() {
  modalOverlay.classList.add("modal-active");
}

function remove() {
  modalOverlay.classList.remove("modal-active");
}

window.addEventListener("click", function (e) {
  if (e.target == modalOverlay || e.target == modalCloseBtn) {
    remove();
  }
});
