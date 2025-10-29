
<?php
session_start();

if (!isset($_SESSION['authenticated']) || $_SESSION['authenticated'] !== true) {
    http_response_code(403);
    echo "Access denied.";
    exit;
}

$filePath = __DIR__ . '/miniDBase.txt';

if (!file_exists($filePath)) {
    echo "[]";
    exit;
}

$content = file_get_contents($filePath);

if ($content === false) {
    http_response_code(500);
    echo "Error reading file.";
    exit;
}

echo $content;
?>
