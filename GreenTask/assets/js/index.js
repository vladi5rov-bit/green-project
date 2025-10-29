  const labels = ["red", "yellow", "green"];
  const typeTr = ["Card payment", "Online Transfer", "Transaction", "cache"];
  let miniDB; 
  // = [  
    // {"ID":1,"label":1,"typeT":1,"date":1000000000000,"logoN":1,"Name":"The Tea Lounge","amount":82.02,"from":"Georgia"},
    // {"ID":2,"label":1,"typeT":2,"date":1005500000000,"logoN":2,"Name":"Texaco","amount":84.64,"from":"Georgia"},
    // {"ID":3,"label":3,"typeT":3,"date":1009100000000,"logoN":1,"Name":"Amazon Online Store","amount":22.10,"from":"Georgia"},
    // {"ID":4,"label":2,"typeT":1,"date":1012400000000,"logoN":3,"Name":"7-Eleven","amount":46.25,"from":"Georgia"},
    // {"ID":5,"label":3,"typeT":2,"date":1015900000000,"logoN":4,"Name":"H&M Online Store","amount":19.72,"from":"Georgia"},
    // {"ID":6,"label":1,"typeT":1,"date":1000900000000,"logoN":1,"Name":"The Tea Lounge","amount":82.02,"from":"Georgia"},
    // {"ID":7,"label":1,"typeT":2,"date":1005900000000,"logoN":2,"Name":"Texaco","amount":84.64,"from":"Georgia"},
    // {"ID":8,"label":3,"typeT":3,"date":1009900000000,"logoN":1,"Name":"Amazon Online Store","amount":22.10,"from":"Georgia"},
    // {"ID":9,"label":2,"typeT":1,"date":1012800000000,"logoN":3,"Name":"7-Eleven","amount":46.25,"from":"Georgia"},
    // {"ID":10,"label":3,"typeT":2,"date":1015500000000,"logoN":4,"Name":"H&M Online Store","amount":19.72,"from":"Georgia"},
	// {"ID":11,"label":1,"typeT":1,"date":1000070000000,"logoN":1,"Name":"The Tea Lounge","amount":82.02,"from":"Georgia"},
    // {"ID":12,"label":1,"typeT":2,"date":1005056000000,"logoN":2,"Name":"Texaco","amount":84.64,"from":"Georgia"},
    // {"ID":13,"label":3,"typeT":3,"date":1009006000000,"logoN":1,"Name":"Amazon Online Store","amount":22.10,"from":"Georgia"},
    // {"ID":14,"label":2,"typeT":1,"date":1012005000000,"logoN":3,"Name":"7-Eleven","amount":46.25,"from":"Georgia"},
    // {"ID":15,"label":3,"typeT":2,"date":1015009000000,"logoN":4,"Name":"H&M Online Store","amount":19.72,"from":"Georgia"}
  // ];

  // ----- СОРТИРАНЕ -----
  const sortButtons = document.querySelectorAll(".sort-btn");
  sortButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const field = btn.dataset.field;
      let order = btn.dataset.order;

      // Превключваме посоката
      order = (order === "asc") ? "desc" : "asc";
      btn.dataset.order = order;

      // Нулираме активния бутон
      sortButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // Обновяваме стрелката само за DATE
      if (field === "date") btn.innerHTML = `DATE ${order === "asc" ? "&#x25B2;" : "&#x25BC;"}`;

      // Сортираме
      miniDB.sort((a, b) => {
        if (field === "Name") return (order === "asc") ? a.Name.localeCompare(b.Name) : b.Name.localeCompare(a.Name);
        if (field === "amount") return (order === "asc") ? a.amount - b.amount : b.amount - a.amount;
        if (field === "date") return (order === "asc") ? a.date - b.date : b.date - a.date;
      });

      renderTable();
    });
  });

  // ----- ТЪРСЕНЕ -----
  const searchInput = document.getElementById("search-input");
  const tableContainer = document.querySelector(".table-container");

  searchInput.addEventListener("input", e => {
    const query = e.target.value.toLowerCase();
    const rows = document.querySelectorAll("#transactions-table tbody tr");
    let foundRow = null;

    rows.forEach(row => {
      const nameText = row.querySelector(".name").textContent.toLowerCase();
      if (nameText.includes(query) && !foundRow) foundRow = row;
    });

    if (foundRow) {
      // Скрол до реда
      const containerHeight = tableContainer.clientHeight;
      const rowOffset = foundRow.offsetTop - containerHeight / 2 + foundRow.clientHeight / 2;
      tableContainer.scrollTo({ top: rowOffset, behavior: "smooth" });

      // Подчертаване
      foundRow.classList.add("highlighted");
      setTimeout(() => foundRow.classList.remove("highlighted"), 2900);
    }
  });

  function renderTable() {
    const tbody = document.getElementById("table-body");
    tbody.innerHTML = "";

    miniDB.forEach(item => {
      const tr = document.createElement("tr");
      tr.onclick = () => window.location.href = `details/?transaction_id=${item.ID}`;

      // цветна лента
      const colorCell = document.createElement("td");
      colorCell.className = "color-bar";
      colorCell.style.backgroundColor = labels[item.label - 1] || "gray";

      // дата
      const date = new Date(item.date);
      const dateCell = document.createElement("td");
      dateCell.textContent = date.toLocaleDateString("en-US", {month:"short", day:"numeric"});

      // бенефициент + тип
      const nameCell = document.createElement("td");
      nameCell.innerHTML = `
        <div class="name">${item.Name}</div>
        <div class="type">${typeTr[item.typeT - 1]}</div>
      ` ;

      // сума
      const amountCell = document.createElement("td");
      amountCell.textContent = `-$${item.amount.toFixed(2)}`;
      amountCell.classList.add("amount");

      tr.append(colorCell, dateCell, nameCell, amountCell);
      tbody.appendChild(tr);
    });
  }
 
async function loadMiniDB() {
  try {
    const response = await fetch("loadMiniDB.php");
    if (!response.ok) throw new Error("Failed to load data");
    const textData = await response.text();

	if((textData.length > 2) && (textData != " ") && (textData != "  ")){
		miniDB = JSON.parse(textData);
		console.log("Loaded miniDB:", miniDB);
	}

    renderTable();
  } catch (err) {
    console.error("Error loading miniDB:", err);
  }
}

async function saveMiniDB() {
  try {
    const textData = JSON.stringify(miniDB,null, 2);  
		
    const response = await fetch("saveMiniDB.php", {
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
  //renderTable();
  //saveMiniDB()

// попълваме dropdown-а от typeTr
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
}

// добавяне на нова транзакция
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
  renderTable();

  document.getElementById("transfer-form").reset();

  setTimeout(() => {
    saveMiniDB();
  }, 2000);
}

document.addEventListener("DOMContentLoaded", fillTypeDropdown);




