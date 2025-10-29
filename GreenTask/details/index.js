  const labels = ["red", "yellow", "green"];
  const typeTr = ["Card payment", "Online Transfer", "Transaction", "cache"];
  const labelsType = ["send transaction", "received", "payed"];
  let miniDB; 

async function loadMiniDB() {
  try {
    const response = await fetch("../loadMiniDB.php");
    if (!response.ok) throw new Error("Failed to load data");
    const textData = await response.text();

	if((textData.length > 2) && (textData != " ") && (textData != "  ")){
		miniDB = JSON.parse(textData);
		console.log("Loaded miniDB:", miniDB);
	}

    //renderTable();
  } catch (err) {
    console.error("Error loading miniDB:", err);
  }
}

async function saveMiniDB() {
  try {
    const textData = JSON.stringify(miniDB,null, 2);  
		
    const response = await fetch("../saveMiniDB.php", {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: textData
    });

    const resultText = await response.text();
    console.log("Save result:", resultText);
  } catch (err) {
    console.error("Error saving miniDB:", err);
  }
}

  loadMiniDB();

function getTransactionId() {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get("transaction_id"));
}

function populateTransactionDetails() {

  const id = getTransactionId();
  const transaction = miniDB.find(t => t.ID === id);

  if (!transaction) {
    document.getElementById("transaction-details-container").innerHTML = "<p>Transaction not found.</p>";
    return;
  }

  document.getElementById("trans-id").textContent = transaction.ID;
  document.getElementById("trans-amount").textContent = `-$${transaction.amount.toFixed(2)}`;

  const d = new Date(transaction.date);
  const formattedDate = `${d.getDate()} ${d.toLocaleString('en-US', { month: 'short' })} ${d.getFullYear()}`;
  document.getElementById("trans-date").textContent = formattedDate;

  document.getElementById("trans-name").textContent = transaction.Name;
  document.getElementById("trans-label").textContent = labelsType[transaction.label - 1];

  const select = document.getElementById("changeState");
  select.innerHTML = "";
  labelsType.forEach((lbl, idx) => {
    const opt = document.createElement("option");
    opt.value = idx + 1;
    opt.textContent = lbl;
    if (transaction.label === idx + 1) opt.selected = true;
    select.appendChild(opt);
  });

  select.addEventListener("change", () => {
    transaction.label = parseInt(select.value);
    document.getElementById("trans-label").textContent = labelsType[transaction.label - 1];

    setTimeout(() => {
      saveMiniDB();
    }, 2000);
  });
}

// попълва dropdown-а в ляво от typeTr
function fillTypeDropdown() {
  const select = document.getElementById("typeT");
  select.innerHTML = "";
  typeTr.forEach((t, index) => {
    if (t.trim() !== "") {
      const opt = document.createElement("option");
      opt.value = index + 1; // индексът се подава към typeT
      opt.textContent = t;
      select.appendChild(opt);
    }
  });
  
  setTimeout(() => {
      populateTransactionDetails();
  }, 500);  
}

function addNewTransaction(event) {
  event.preventDefault();

  const fromAcc = document.getElementById("fromAccount").value.trim();
  const toAcc = document.getElementById("toAccount").value.trim();
  const amountVal = parseFloat(document.getElementById("amount").value);
  const typeVal = parseInt(document.getElementById("typeT").value);

  if (!fromAcc || !toAcc || isNaN(amountVal)) {
    alert("Please fill all fields correctly.");
    return;
  }

  // нов обект
  const newID = miniDB.length + 1;
  const newTransaction = {
    ID: newID,
    label: 1,
    typeT: typeVal,
    date: Date.now(),
    logoN: 1,
    Name: toAcc,
    amount: amountVal,
    from: fromAcc
  };

  miniDB.push(newTransaction);
  //renderTable();

  document.getElementById("transfer-form").reset();

  setTimeout(() => {
    saveMiniDB();
  }, 2000);
}

document.addEventListener("DOMContentLoaded", fillTypeDropdown);






