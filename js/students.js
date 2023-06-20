const studentsWrapper = document.querySelector(".students-wrapper");
const studentForm = document.querySelector(".form");
const addStudent = document.querySelector("#addStudent");
const searchInput = document.querySelector("#search");
const pagination = document.querySelector(".pagination");
const activePage = document.querySelector(".active");
const filter = document.querySelector("#select");
const option = document.querySelector(".option");

let ageOrder = "";

const formElements = studentForm.elements;
console.log(formElements);
let selected = null;
let page = 1;
let search = "";
let nameOrder = "asc";

let query = new URLSearchParams(location.search);
console.log(query);
let teacherId = query.get("teacher");

function getStudent({
  firstName,
  lastName,
  avatar,
  email,
  phoneNumber,
  isWork,
  teacherId,
  id,
  age,
}) {
  console.log(teacherId);
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
                <p class="isMarried">Is Work: ${isWork ? "✅" : "❌"}</p>
                <p>Age ${age} years old</p>
              </div>
            </div>
            <div class="edit-delete">
                  <img id="edit" onclick = "editStudent(${teacherId, id}) " src="./images/edit.png" alt="" title="Edit">
                  <img id="delete" onclick = "deleteStudent(${teacherId, id})" src="./images/delete.png" alt="" title="Delete">
              </div>
    </div>
              
  `;
}
// function getStudentData(teacherId) {
//   studentsWrapper.innerHTML = "...loading";
//   studentAxios(
//     `${teacherId}/student?isWork=${search}&page=${page}&limit=${LIMIT}&firstName=${search}&sortBy=firstName`
//   ).then((res) => {
//     let students = res.data;
//     console.log(students);
//     studentAxios(`${teacherId}/student?firstName=${search}`).then((res) => {
//       let pages;
//       pages = Math.ceil(res.data.length / LIMIT);

//       if (pages > 1) {
//         pagination.innerHTML = `<li class="page-item">
//             <button class="page-link">Prev</button>
//           </li>`;

//         for (let i = 1; i <= pages; i++) {
//           pagination.innerHTML += `<li class="page-item ${
//             i == page ? "active" : ""
//           }">
//               <button class="page-link" onClick="getPage(${i})">${i}</button>
//             </li>`;
//         }

//         pagination.innerHTML += `<li class="page-item">
//             <button class="page-link">Next</button>
//           </li>`;
//       } else {
//         pagination.innerHTML = "";
//       }
//     });
//     studentsWrapper.innerHTML = "";

//     students.forEach((student) => {
//       console.log(students);
//       studentsWrapper.innerHTML += getStudent(student);
//     });
//     // res.data.map((teacher) => {
//     //   studentsWrapper.innerHTML += getStudent(teacher);
//     // });
//   });
// }

function getStudentData(teacherId) {
  const queryParamsSecond = {
    firstName: search,
    sortBy: "firstName",
    order: ageOrder,
  };

  studentAxios
    .get(`${teacherId}/student`, { params: queryParamsSecond })
    .then((response) => {
      let students = response.data;
      studentAxios(`student?firstName=${search}`).then((res) => {
        pagination();
      });
      studentsWrapper.innerHTML = "";
      students.map((el) => {
        studentsWrapper.innerHTML += getStudent(el);
      });
      // pagination();
    })
}

getStudentData(teacherId);

function getPage(p) {
  page = p;
  getStudentData();
}

filter.addEventListener("change", function () {
  let filtering = filter.value;
  ageOrder = filtering === "asc" ? "asc" : filtering === "desc" ? "desc" : "";

  getStudentData(teacherId);
});

studentForm.addEventListener("submit", function (e) {
  e.preventDefault();
  let firstName = formElements.firstName.value;
  let lastName = formElements.lastName.value;
  let avatar = formElements.avatar.value;
  let phoneNumber = formElements.phoneNumber.value;
  let email = formElements.email.value;
  let age = formElements.age.value;
  let isWork = formElements.isWork.checked;
  let data = { firstName, lastName, avatar, phoneNumber, email, age, isWork };
  console.log(data);
  
  if (selected === null) {
    studentAxios(`${teacherId}/student/${id}`)
      .post("student", data)
      .then((res) => {
        remove();
        getStudentData();
      });
  } else {
    studentAxios(`${teacherId}/student/${id}`)
      .put(`${selected}`, data)
      .then((res) => {
        remove();
        getStudentData();
      });
  }
});

// Edit
async function editStudent(id) {
  modalActive();
  selected = id;
  let student = await studentAxios(`${teacherId}/student/${selected}`);
  formElements.firstName.value = student.data.firstName;
  formElements.lastName.value = student.data.lastName;
  formElements.avatar.value = student.data.avatar;
  formElements.phoneNumber.value = student.data.phoneNumber;
  formElements.email.value = student.data.email;
  formElements.age.value = student.data.age;
  formElements.isWork.checked = student.data.isWork;
  console.log(selected);
  addStudent.innerHTML = "Save student";
  getStudentData();
}
openModal.addEventListener("click", function () {
  selected = null;
  addStudent.innerHTML = "Add Student";
  studentForm.reset();
});

//Delete
async function deleteStudent(id) {
  let check = confirm("Do you want to delete this student ?");
  if (check) {
    await studentAxios.delete(` ${id}`);
    getStudentData();
  }
}
