<?php
session_start();

unset($_SESSION['id'], $_SESSION['name'], $_SESSION['email'], $_SESSION['avatar']);
session_destroy();

echo json_encode([
    "error" => false,
    "message" => "Logout realizado com sucesso"
]);
?>