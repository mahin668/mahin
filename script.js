// LocalStorage er key name set kora holo
const LS_KEY = 'users-crud-v1';

// localStorage theke data ana; jodi na thake tahole empty array ([]).
let data = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
           //String ➜ Object


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
//JSON.stringify(obj) → object → string (data object thaka string kore)
//JSON.parse(string) → string → object (data string thaka object kore)
const save = () => localStorage.setItem(LS_KEY, JSON.stringify(data));
//localStorage.setItem (string data browser a save kore)
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
  e.preventDefault(); // e.preventDefault(): reload/submit রোধ করে
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
  render(); //সেভের পর UI refresh করে নতুন data দেখায়
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
  //ইউজার edit করতে চাইলে সেই ইউজারের ডেটা form-এ auto fill করে modal খুলে দেয়|
  if (iEdit !== undefined) {
    editingIndex = Number(iEdit); // kon user edit hocche ta dhore
    const u = data[editingIndex]; // oi user er info
    // form e user data fill kore
    form.name.value = u.name; //form-এর name ইনপুট ফিল্ডে u অবজেক্টের name মানটা বসাও।
    form.email.value = u.email;
    form.id.value = u.id;
    form.salary.value = u.salary;
    form.dob.value = u.dob;
    openModal('Edit User'); // modal open kore
  }
  // jodi delete button click hoi
  if (iDel !== undefined) {
    //অংশকাজ(iDel):delete করতে চাওয়া index (string হিসেবে আসে)
    // Number(iDel):string কে number বানায়|
    // idx:সেই number index টা ধরে রাখে|

    const idx = Number(iDel); //এই লাইনটা iDel নামের কোনো value (string) কে number-এ রূপান্তর করছে| এবং সেটাকে idx (index) নামে নতুন ভ্যারিয়েবলে রাখছে।

    confirm(`Delete "${data[idx].name}"?`);
    data.splice(idx, 1); // oi user ke array theke delete kore
    save(); // update save kore
    render(); // table refresh kore
  }
});
  // ---------------------- SAMPLE DATA ------------------------
if (!data.length) {
  // jodi localStorage khali thake, default data add korbe
  data = [
    {
      name: 'John Doe',
      email: 'john@company.com',
      id: 'EMP-1001',
      salary: 5150,
      dob: '1992-03-14',
    },
    {
      name: 'Patricia Foe',
      email: 'patricia@company.com',
      id: 'EMP-1002',
      salary: 6120,
      dob: '1990-11-02',
    },
  ];
  save(); // localStorage e save kore
}

// ---------------------- INITIAL LOAD ------------------------
render(); // page load e table render kore


