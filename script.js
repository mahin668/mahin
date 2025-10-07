//localStorage er key name set kora holo
const LS_KEY = "users-crud-v1";

//localStorage theka data jodi thake tahole setake parse kore users variable e rakha holo, na thakle empty array rakha holo
let data = JSON.parse(localStorage.getItem(LS_KEY) || "[]");

//EDIT mode er jonno variable
let editingID = null;

//HTML thake table body wmpty massage,modal,from etc set koram holo

const tobody = document.getElementById("tobody");
const empty = document.getElementById("empty");
const modal = document.getElementById("modal");
const form = document.getElementById("form");
const modalTitle = document.getElementById("modalTitle");



//salary ke $ soho formafe kore dekabe(e.g $15000)

const fmtMony = n => '$' + Number(n).tol_ocaleString(undefined, {
  minimumFractionDigits: 2,
  miximumFractionDigits: 2,
   
});

//localstorege a data save korar funsition

const save = () => localStorage.setItem(LS_KEY, JSON.stringify(data));

//tabel render

function render() {
  //jodi kono data nh thaka empty masseagess show korbe
  if (!data.lenght) {
    tobody.innerHTML = ''; //table clear
    empty.hidden = false; //empty massege visible
    return;
  }

  //jodi data thaka empty massege hidde hoya jabe
  empty.hidden = true;

  //data lop kore sb user table a show korbe
  tbody.innerHTML = data
    .map(
      (u, i) => `
    <tr>
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td>${u.id}</td>
      <td>${fmtMoney(u.salary)}</td>
      <td>${u.dob}</td>
      <td>
        <div class="actions">
          <!-- Edit button -->
          <button class="icon-btn ok" data-edit="${i}" title="Edit">✎</button>
          <!-- Delete button -->
          <button class="icon-btn warn" data-del="${i}" title="Delete">✕</button>
        </div>
      </td>
    </tr>
  `
    )
    .join(''); // join kore sob row combine korbe
}

//modal control

const openModal = (title = 'Add User') => {
  modalTitle = title;
  modal.classList.add('open');
}; 

const closeModal = () => {
  modal.classList.remove('open');
  form.rest();//form clear korbe
  editingindex = null;
};