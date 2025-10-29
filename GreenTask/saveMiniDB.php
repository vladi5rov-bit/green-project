
<?php
session_start();

if (!isset($_SESSION['authenticated']) || $_SESSION['authenticated'] !== true) {
    http_response_code(403);
    echo "Access denied.";
    exit;
}

$filePath = __DIR__ . '/miniDBase.txt';

$rawData = file_get_contents("php://input");
if ($rawData === false || trim($rawData) === "") {
    http_response_code(400);
    echo "No data received.";
    exit;
}

$result = file_put_contents($filePath, $rawData);

if ($result === false) {
    http_response_code(500);
    echo "Error writing file.";
    exit;
}

echo "OK";
?>
