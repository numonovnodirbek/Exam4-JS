const teachersWrapper = document.querySelector(".teachers-wrapper");
const teacherForm = document.querySelector(".form");
const addTeacher = document.querySelector("#addTeacher");
const searchInput = document.querySelector("#search");
const pagination = document.querySelector(".pagination");
const activePage = document.querySelector(".active");
const filter = document.querySelector("#select");
const option = document.querySelector(".option");

let searchQuery = "";


const formElements = teacherForm.elements;
console.log(formElements);
let selected = null;
let page = 1;
let search = "";
let nameOrder = "asc";

function getTeacherCard({
  firstName,
  lastName,
  avatar,
  id,
  email,
  phoneNumber,
  isMarried,
}) {
  return `
    <div class="card">
    <div class="info">
    <img class="avatar" src="${avatar}" alt="" />
              <div class="card-body">
                <h2>${firstName} ${lastName}</h2>
                <div class="contact">
                  <a class="email" href="mailto: ${email}">
                    <img src="./images/email.svg" alt="">
                    <p>Email</p>
                  </a>
                  <a class="phone" href="tel: ${phoneNumber}">
                    <img src="./images/phone.svg" alt="">
                    <p>Phone</p>
                  </a>
                </div>
                <p class="isMarried">Is married: ${isMarried ? "✅" : "❌"}</p>
              </div>
              <a class="students-btn" href="students.html?teacher=${id}">See students</a>
            </div>
            <div class="edit-delete">
                  <img id="edit" onclick = "editTeacher(${id}) " src="./images/edit.png" alt="" title="Edit">
                  <img id="delete" onclick = "deleteTeacher(${id})" src="./images/delete.png" alt="" title="Delete">
              </div>
    </div>
              
  `;
}

function getTeacherData() {
  teachersWrapper.innerHTML = "...loading";
  axiosInstance(
    `teacher?isMarried=${search}&page=${page}&limit=${LIMIT}&firstName=${searchQuery}`
  ).then((res) => {
    let teachers = res.data;
    axiosInstance(`teacher?firstName=${searchQuery}`).then((res) => {
      let pages;
      pages = Math.ceil(res.data.length / LIMIT);

      if (pages > 1) {
        pagination.innerHTML = `<li class="page-item">
            <button class="page-link">Prev</button>
          </li>`;

        for (let i = 1; i <= pages; i++) {
          pagination.innerHTML += `<li class="page-item ${
            i == page ? "active" : ""
          }">
              <button class="page-link" onClick="getPage(${i})">${i}</button>
            </li>`;
        }

        pagination.innerHTML += `<li class="page-item">
            <button class="page-link">Next</button>
          </li>`;
      } else {
        pagination.innerHTML = "";
      }
    });
    teachersWrapper.innerHTML = "";

    teachers.forEach((teacher) => {
      teachersWrapper.innerHTML += getTeacherCard(teacher);
    });
    // res.data.map((teacher) => {
    //   teachersWrapper.innerHTML += getTeacherCard(teacher);
    // });
  });
}
searchInput.addEventListener("keyup", function (event) {
  searchQuery = event.target.value.trim();
  getTeacherData();
});

function getPage(p) {
  page = p;
  getTeacherData();
}

getTeacherData();

filter.addEventListener("change", function () {
  const selectedOption = filter.value;
  console.log(selectedOption);
  search =
    selectedOption === "true"
      ? true
      : selectedOption === "false"
      ? false
      : "";
      console.log(search);
  getTeacherData();
});

getTeacherData();

teacherForm.addEventListener("submit", function (e) {
  e.preventDefault();
  let firstName = formElements.firstName.value;
  let lastName = formElements.lastName.value;
  let avatar = formElements.avatar.value;
  let phoneNumber = formElements.phoneNumber.value;
  let email = formElements.email.value;
  let isMarried = formElements.isMarried.checked;
  let data = { firstName, lastName, avatar, phoneNumber, email, isMarried };

  if (selected === null) {
    axiosInstance.post("teacher", data).then((res) => {
      remove();
      getTeacherData();
    });
  } else {
    axiosInstance.put(`teacher/${selected}`, data).then((res) => {
      remove();
      getTeacherData();
    });
  }
});

async function editTeacher(id) {
  modalActive();
  selected = id;
  let teacher = await axiosInstance(`teacher/${id}`);
  formElements.firstName.value = teacher.data.firstName;
  formElements.lastName.value = teacher.data.lastName;
  formElements.avatar.value = teacher.data.avatar;
  formElements.phoneNumber.value = teacher.data.phoneNumber;
  formElements.email.value = teacher.data.email;
  formElements.isMarried.checked = teacher.data.isMarried;
  console.log(selected);
  addTeacher.innerHTML = "Save teacher";
  // getTeacherData();
}
openModal.addEventListener("click", function () {
  selected = null;
  addTeacher.innerHTML = "Add Teacher";
  teacherForm.reset();
});

async function deleteTeacher(id) {
  let check = confirm("Do you want to delete this category ?");
  if (check) {
    await axiosInstance.delete(`teacher/${id}`);
    getTeacherData();
  }
}


