const template = `
  <td></td>
  <td>
    <input type="text" id="name" name="Product Name" required />
  </td>
  <td>
    <input type="number" id="quantity" name="Quantity" required />
  </td>
  <td>
    <input type="number" id="price" step="any" name="Price" required />
  </td>
  <td></td>
  <td class="action">
  <button class="primary" title="Add Product" id="save">
  Save
  </button>
  </td>
`;

const addButton = document.getElementById("add");
addButton.addEventListener("click", addItem);

const tableBody = document.getElementById("body");
const snackbar = document.getElementById("snackbar");

function multiply(num1, num2) {
  num1 = parseInt(num1);
  num2 = parseFloat(num2).toFixed(2);
  const result = parseFloat(num1 * num2).toFixed(2);
  return result;
}

function addItem(event) {
  event.preventDefault();
  event.currentTarget.classList.add("hidden");
  const row = document.createElement("tr");
  row.innerHTML = template;
  row.classList.add("table-row");
  row.setAttribute("id", "insert-template");
  tableBody.appendChild(row);
  document.getElementById("save").addEventListener("click", saveItem);
}

function getLastRowIndex() {
  const element = document.querySelector('.table tbody tr:last-of-type');
  if(!element) return 0;
  return parseInt(element.textContent);
}

function validateFields() {
  const field = document.querySelector('.table input:invalid');
  if(field) {
    const fieldName = field.getAttribute('name');
    snackbar.textContent = `Please enter ${fieldName}`;
    snackbar.classList.add('show');
    setTimeout(()=>snackbar.classList.remove('show'), 2000);
    return false;
  }
  return true;
}

function saveItem(event) {
  event.preventDefault();
  if(!validateFields()) return;
  addButton.classList.remove("hidden");
  const name = document.getElementById("name").value;
  const quantity = document.getElementById("quantity").value;
  const price = document.getElementById("price").value;
  const total = multiply(quantity, price);
  tableBody.deleteRow(-1);
  const index = getLastRowIndex();
  const addTemplate = `
    <td class="index">${index+1}</td>
    <td class="name">${name}</td>
    <td class="quantity">${quantity}</td>
    <td class="price">${price}</td>
    <td class="total">${total}</td>
    <td class="action">
      <button class="danger" title="Delete Product">
      <svg width="24" height="24" viewBox="0 0 24 24">
  <path d="M22,3H7C6.31,3 5.77,3.35 5.41,3.88L0,12L5.41,20.11C5.77,20.64 6.31,21 7,21H22A2,2 0 0,0 24,19V5A2,2 0 0,0 22,3M19,15.59L17.59,17L14,13.41L10.41,17L9,15.59L12.59,12L9,8.41L10.41,7L14,10.59L17.59,7L19,8.41L15.41,12"></path>
</svg>
    </button>
    </td>
  `;
  const row = tableBody.insertRow(-1);
  row.classList.add("table-row");
  row.setAttribute('data-index', index);
  row.innerHTML = addTemplate;
  row.getElementsByClassName('danger')[0].addEventListener('click', deleteRow);
  updateGrandTotal();
}

function updateGrandTotal(number) {
  const grandTotalNode = document.getElementById('grand-total');
  const totalNodes = Array.from(document.getElementsByClassName('total'));
  const sum = totalNodes.reduce((acc, current)=>parseFloat(acc)+parseFloat(current.textContent), 0
  );
  grandTotalNode.textContent = sum;
}

function deleteRow(event) {
  event.preventDefault();
  const deleteElement = event.currentTarget;
  const rowIndex = deleteElement.closest('tr').getAttribute('data-index');
  tableBody.deleteRow(rowIndex);
  updateGrandTotal();
  updateIndices();
}

function updateIndices() {
  const tableRows = document.querySelectorAll('.table-row .index');
  if(tableRows) 
    tableRows.forEach((item, index)=>{
      item.textContent = index+1;
      item.parentElement.setAttribute('data-index', index);
    });
}

function getData() {
  const name = document.getElementById('cust-name').value;
  const date = document.getElementById('date').value;
  const grandTotal = document.getElementById('grand-total').textContent;
  const tableRows = document.getElementsByClassName('table-row');
  const data = {
    name,
    date,
    products: [],
    grandTotal
  };
  const products = data.products;
  for(let i=0;i<tableRows.length;i++) {
    products.push({
      name: tableRows[i].getElementsByClassName('name')[0].textContent,
      quantity: tableRows[i].getElementsByClassName('quantity')[0].textContent,
      price: tableRows[i].getElementsByClassName('price')[0].textContent,
      total: tableRows[i].getElementsByClassName('total')[0].textContent
    });
  }
  console.log(data);
}

(function() {
  flatpickr("#date", {});
  document.getElementById('print').addEventListener('click', getData);
})();
