
// document.addEventListener("click", closeAllSelect);





// region.addEventListener("change", function () {
//   let region = this.value.toLowerCase();
//   console.log(region);
//   if (region === "all") {
//     getCountries(`https://restcountries.com/v3.1/all`);
//   } else {
//     getCountries(`https://restcountries.com/v3.1/region/${region}`);
//   }
// });

// regions.map((el) => {
//   region.innerHTML += `<option class="item" value="${el}">${el}</option>`;
// });
filter.addEventListener("change", function () {
  const selectedOption = filter.value;
  search =
    selectedOption === "false"
      ? false
      : selectedOption === "true"
      ? true
      : null;
  getTeacherData();
});

getTeacherData();