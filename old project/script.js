// ---------------------- LOCALSTORAGE & DATA ----------------------

// Set localStorage key for storing users
const LS_KEY = 'users-crud-v1';

// Get data from localStorage; if not present, start with empty array
let data = JSON.parse(localStorage.getItem(LS_KEY)) || [];

// Keeps track of which user is currently being edited; null means no edit
let editingIndex = null;

// ---------------------- HTML ELEMENTS ----------------------

// Select HTML elements we'll work with
const form = document.getElementById('form'); // User form
const tbody = document.getElementById('tbody'); // Table body where rows will be added
const modal = document.getElementById('modal'); // Modal popup
const modalTitle = document.getElementById('modalTitle'); // Modal title text
const emptyMsg = document.getElementById('empty'); // Message shown if table is empty
const search = document.getElementById('search'); // Search input box

// ---------------------- RENDER FUNCTION ----------------------

// Function to render the table rows
// list parameter allows filtered data for search; default = all data
function render(list = data) {
  tbody.innerHTML = ''; // Clear existing table rows

  if (list.length === 0) {
    // If no data to show
    emptyMsg.hidden = false; // Show "empty" message
    return; // Stop function here
  }

  emptyMsg.hidden = true; // Hide empty message if data exists

  // Loop through each user and create table rows dynamically
  list.forEach((u, i) => {
    const row = document.createElement('tr'); // Create <tr> element
    row.innerHTML = `
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td>${u.id}</td>
      <td>${u.salary}</td>
      <td>${u.dob}</td>
      <td>
        <button class="btn small" onclick="editUser(${i})">✎</button>    <!-- Edit button -->
        <button class="btn small danger" onclick="deleteUser(${i})">🗑️</button>  <!-- Delete button -->
      </td>
    `;
    tbody.appendChild(row); // Add row to table body
  });
}

// ---------------------- MODAL CONTROL ----------------------

// Function to open modal with given title
const openModal = (title = 'Add User') => {
  modalTitle.textContent = title; // Set modal title text
  modal.classList.add('open'); // Add "open" class to show modal
};

// Function to close modal
const closeModal = () => {
  modal.classList.remove('open'); // Remove "open" class to hide modal
  form.reset(); // Clear form inputs
  editingIndex = null; // Reset editing index
};

// ---------------------- ADD BUTTON ----------------------

// When "Add User" button is clicked
document.getElementById('addBtn').onclick = () => {
  editingIndex = null; // Not editing an existing user
  form.reset(); // Clear the form
  openModal('Add User'); // Open modal with title
};

// ---------------------- SAVE BUTTON ----------------------

// When "Save" button in modal is clicked
document.getElementById('saveBtn').onclick = e => {
  e.preventDefault(); // Prevent form from submitting/reloading
  if (!form.reportValidity()) return; // Stop if form inputs are invalid

  // Get all form data as an object {name: "...", email: "...", ...}
  const formData = Object.fromEntries(new FormData(form).entries());

  // If editingIndex is null → add new user; else → update existing user
  if (editingIndex === null) data.push(formData);
  else data[editingIndex] = formData;

  localStorage.setItem(LS_KEY, JSON.stringify(data)); // Save updated data to localStorage
  modal.style.display = 'none'; // Hide modal
  render(); // Refresh table with new data
};

// ---------------------- CANCEL / CLOSE MODAL ----------------------

// Close modal when clicking "Cancel" button
document.getElementById('cancelBtn').onclick = e => {
  e.preventDefault(); // Prevent default behavior
  closeModal(); // Call modal close function
};

// Close modal when clicking "X" button
document.getElementById('closeModal').onclick = closeModal;

// Close modal when clicking outside the modal content
modal.addEventListener('click', e => {
  if (e.target === modal) closeModal(); // If click is on modal background, close modal
});

// ---------------------- EDIT / DELETE USER ----------------------

// Event delegation: listen for clicks inside table body
tbody.addEventListener('click', e => {
  const iEdit = e.target.dataset.edit; // Get edit index if edit button clicked
  const iDel = e.target.dataset.del; // Get delete index if delete button clicked

  // -------- EDIT USER --------
  if (iEdit !== undefined) {
    editingIndex = Number(iEdit); // Convert index string to number
    const u = data[editingIndex]; // Get user object at that index

    // Fill form inputs with user data
    form.name.value = u.name;
    form.email.value = u.email;
    form.id.value = u.id;
    form.salary.value = u.salary;
    form.dob.value = u.dob;

    openModal('Edit User'); // Open modal with title "Edit User"
  }

  // -------- DELETE USER --------
  if (iDel !== undefined) {
    const idx = Number(iDel); // Convert index to number
    if (confirm(`Delete "${data[idx].name}"?`)) {
      // Confirm deletion
      data.splice(idx, 1); // Remove user from array
      localStorage.setItem(LS_KEY, JSON.stringify(data)); // Save updated array
      render(); // Refresh table
    }
  }
});

// ---------------------- SEARCH FUNCTION ----------------------

// Filter table rows as user types in search box
//search.addEventListener('input', () => {
  //const text = search.value.toLowerCase(); // Convert input to lowercase

  // Filter data by name only
 // const filtered = data.filter(u => u.name.toLowerCase().includes(text));

  //render(filtered); // Render only matching rows
//});

// ---------------------- SAMPLE DATA ----------------------
search.addEventListener('input', () => {
  const text = search.value.toLowerCase();

  const filtered = data.filter(u => u.name.toLowerCase().includes(text));

  render(filtered);
});
// If localStorage empty, add default users
if (!data.length) {
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
  localStorage.setItem(LS_KEY, JSON.stringify(data)); // Save default data
}

// ---------------------- INITIAL LOAD ----------------------
render(); // Render table when page loads
