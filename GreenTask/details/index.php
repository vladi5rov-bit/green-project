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
  <title>Detailed info</title>
  <link rel="icon" type="image/png" href="../favicon.ico">
  <link rel="stylesheet" href="../assets/css/style.css">
  <script src="index.js"></script>
</head>
<body>
	<div class="bg-container">
		<div class="wrapper"></div>

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
	  
		<div id="transaction-details-container">
			  <div class="details-header">
				<h2>Details for transaction <span id="trans-id"></span></h2>
				<div class="back-button">
					<a href="../protected.php" class="btn-back">← Back to transactions</a>
				</div>
			  </div>

			  <table class="transaction-details-table">
				<tr>
				  <td>Amount</td>
				  <td id="trans-amount"></td>
				</tr>
				<tr>
				  <td>Date</td>
				  <td id="trans-date"></td>
				</tr>
				<tr>
				  <td>To contractor</td>
				  <td id="trans-name"></td>
				</tr>
				<tr>
				  <td>State</td>
				  <td id="trans-label"></td>
				</tr>
			  </table>

			  <div class="change-state-block">
				<label for="changeState">Change transaction state:</label>
				<select id="changeState"></select>
			  </div>
		</div>
	  
	</div>

</body>
</html>
