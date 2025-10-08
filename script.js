// LocalStorage er key name set kora holo
const LS_KEY = 'users-crud-v1';

// localStorage theke data ana; jodi na thake tahole empty array ([]).
let data = JSON.parse(localStorage.getItem(LS_KEY) || '[]');

// Edit mode a kon index e user edit hocche ta rakhbe
let editingIndex = null;

// HTML theke table body, empty message, modal, form etc. select kora holo
const tbody = document.getElementById('tbody');
const empty = document.getElementById('empty');
const modal = document.getElementById('modal');
const form = document.getElementById('form');
const modalTitle = document.getElementById('modalTitle');

// salary ke $ soho format kore dekhabe (e.g. $5,150.00)
const fmtMoney = n =>
  '$' +
  Number(n).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

// localStorage e data save korar function
const save = () => localStorage.setItem(LS_KEY, JSON.stringify(data));

// ---------------------- TABLE RENDER ------------------------
function render() {
  // jodi kono data na thake, empty message show korbe
  if (!data.length) {
    tbody.innerHTML = ''; // table clear
    empty.hidden = false; // empty message visible
    return;
  }

  // jodi data thake, empty message hide hobe
  empty.hidden = true;

  // data er upor loop kore sob user table e show korbe
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

// ---------------------- MODAL CONTROL ------------------------
const openModal = (title = 'Add User') => {
  // Modal open korar function
  modalTitle.textContent = title; // Modal title set kore
  modal.classList.add('open'); // open class add kore modal show kore
};

const closeModal = () => {
  // Modal close korar function
  modal.classList.remove('open'); // modal hide kore
  form.reset(); // form clear kore
  editingIndex = null; // edit index reset kore
};

// ---------------------- ADD BUTTON ------------------------
document.getElementById('addBtn').onclick = () => {
  editingIndex = null; // not editing existing user
  form.reset(); // form empty kore
  openModal('Add User'); // modal open kore "Add User" title diye
};

// ---------------------- SAVE BUTTON ------------------------
document.getElementById('saveBtn').onclick = e => {
  e.preventDefault(); // form auto reload thake rokhe
  if (!form.reportValidity()) return; // form validation check kore

  // form theke sob input value neya
  const formData = Object.fromEntries(new FormData(form).entries());

  // salary number hishebe convert kore
  formData.salary = Number(formData.salary);

  // jodi editingIndex null, tahole new user add hobe, na hole update hobe
  if (editingIndex === null) data.push(formData);
  else data[editingIndex] = formData;

  // save + render + modal close
  save();
  render();
  closeModal();
};

// ---------------------- CANCEL / CLOSE MODAL ------------------------
document.getElementById('cancelBtn').onclick = e => {
  e.preventDefault();
  closeModal();
};
document.getElementById('closeModal').onclick = closeModal;

// modal er background click korle close hobe
modal.addEventListener('click', e => {
  if (e.target === modal) closeModal();
});

// ---------------------- EDIT / DELETE ACTION ------------------------
tbody.addEventListener('click', e => {
  const iEdit = e.target.dataset.edit,
    iDel = e.target.dataset.del;

  // jodi edit button click hoi
  if (iEdit !== undefined) {
    editingIndex = Number(iEdit); // kon user edit hocche ta dhore
    const u = data[editingIndex]; // oi user er info
    // form e user data fill kore
    form.name.value = u.name;
    form.email.value = u.email;
    form.id.value = u.id;
    form.salary.value = u.salary;
    form.dob.value = u.dob;
    openModal('Edit User'); // modal open kore
  }


});

