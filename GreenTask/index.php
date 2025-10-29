<?php
session_start();

if (!isset($_SESSION['login_attempts'])) $_SESSION['login_attempts'] = 0;
if (!isset($_SESSION['lock_time'])) $_SESSION['lock_time'] = 0;

$credentials = [
    'Green'  => 'Street',
    'admin'  => 'Vlad'     //'$2y$10$yCyRbDUz84e9heD1gzZsUeFtIjqBqM/NvTKW7d83uFjUXjEe9Hf5C'  // admin1234
];

$error = '';
$locked = false;

// Проверка за активна блокировка
/* if ($_SESSION['lock_time'] > time()) {
    $locked = true;
    $remaining = $_SESSION['lock_time'] - time();
    $error = "Too many failed attempts. Please try again after $remaining seconds.";
}
 */

if ($_SERVER['REQUEST_METHOD'] === 'POST' && !$locked) {
    $username = isset($_POST['username']) ? trim($_POST['username']) : '';
    $password = isset($_POST['password']) ? $_POST['password'] : '';

    if (isset($credentials[$username]) && $password === $credentials[$username]) {    // password_verify($password, $credentials[$username])

        $_SESSION['authenticated'] = true;
        $_SESSION['username'] = $username;
        $_SESSION['login_attempts'] = 0;
        $_SESSION['lock_time'] = 0;
        header('Location: protected.php');
        exit;
    } else {
        $_SESSION['login_attempts']++;

        if ($_SESSION['login_attempts'] >= 10) {
            $_SESSION['lock_time'] = time() + 60;
            $error = "Too many failed attempts. Login blocked for 1 minute.";
        } else {
            $remaining = 10 - $_SESSION['login_attempts'];
            $error = "Invalid username or password. You have $remaining attempt(s) left. $username   , $password ";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="bg">
<head>
  <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vladi's GreenTask</title>
  <link rel="icon" type="image/png" href="favicon.ico" />
  <!--<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">-->
  <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
  <main class="login-container">
    <h1>Login</h1>
    <?php if ($error): ?>
      <div class="error"><?php echo htmlspecialchars($error, ENT_QUOTES, 'UTF-8'); ?></div>
    <?php endif; ?>

    <form action="index.php" method="POST" autocomplete="off" novalidate>
      <label for="username">Username</label>
      <input id="username" name="username" type="text" required autofocus value="" <?php echo $locked ? 'disabled' : ''; ?>>

      <label for="password">Password</label>
      <input id="password" name="password" type="password" required value="" <?php echo $locked ? 'disabled' : ''; ?>>

      <button type="submit" <?php echo $locked ? 'disabled' : ''; ?>>Login</button>
    </form>
  </main>
</body>
</html>
