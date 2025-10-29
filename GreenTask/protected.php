<?php
session_start();

if (!isset($_SESSION['authenticated']) || $_SESSION['authenticated'] !== true) {
    
    header('Location: index.php');
    exit;
}

$username = $_SESSION['username'] ?? 'user';
?>
<!doctype html>
<html lang="bg">
<head>
  <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Protected Area</title>
  <link rel="icon" type="image/png" href="favicon.ico" />
  <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
  <div id = "protect-right" class="protected-container">
    <!-- <h1>Protected Page</h1> -->
    <p>Welcome, <?php echo htmlspecialchars($username, ENT_QUOTES, 'UTF-8'); ?>. You have successfully logged in.</p>

    <form action="logout.php" method="post">
      <button type="submit">Logout</button>
    </form>	
  </div>

	<div class="bg-container">
	  <!--<img src="assets/images/BackGr.png" class="background" alt="Background">-->
		<div class="wrapper">	
			<img src="assets/images/BackGr.png" class="background" alt="Background">
		</div>

		<!-- Лява форма  -->
		<div id="transfer-form-container">
		  <div class="form-header">Make a Transfer</div>
		  <form id="transfer-form" onsubmit="addNewTransaction(event)">
			<label for="fromAccount">FROM ACCOUNT</label>
			<input type="text" id="fromAccount" name="fromAccount" placeholder="From account" required>

			<label for="toAccount">TO ACCOUNT</label>
			<input type="text" id="toAccount" name="toAccount" placeholder="To account" required>

			<label for="amount">AMOUNT</label>
			<input type="number" id="amount" name="amount" placeholder="0.00" step="0.01" required>

			<label for="typeT">TYPE OF TRANSFER</label>
			<select id="typeT" name="typeT" required>
			  <!-- Попълва се динамично от JS -->
			</select>

			<button type="submit" id="submitTransfer">SUBMIT</button>
		  </form>
		</div>
	  
	  <div id="transactions-container">
		<div class="header-bar">
		  <h2>Recent Transactions</h2>
		</div>

		<!-- Ред под хедъра за търсене и сортиране -->
		<div class="toolbar">
		  <input type="text" id="search-input" placeholder="Search by typing...">
		  <div class="sort-buttons">
			<button class="sort-btn active" data-field="date" data-order="desc">DATE &#x25BC;</button>
			<button class="sort-btn" data-field="Name" data-order="asc">BENEFICIARY</button>
			<button class="sort-btn" data-field="amount" data-order="asc">AMOUNT</button>
		  </div>
		</div>
		
		<div class="table-container">
		  <table id="transactions-table">
			<thead>
			  <tr>
				<th></th>
				<th>Date</th>
				<th>Beneficiary</th>
				<th>Amount</th>
			  </tr>
			</thead>
			<tbody id="table-body"></tbody>
		  </table>
		</div>
	  </div>
	</div>

<script>
</script>

<script src="assets/js/index.js"></script>
</body>
</html>
