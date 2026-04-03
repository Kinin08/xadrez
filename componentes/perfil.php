<?php
session_start();
include "./connection.php";
header("Content-Type: application/json");

if (!isset($_SESSION["email"])) {
    echo json_encode(["error" => true, "message" => "Usuário não logado"]);
    exit;
}

$email = $_SESSION["email"];

$stmt = $conn->prepare("SELECT name, email, avatar FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    echo json_encode(["error" => true, "message" => "Usuário não encontrado"]);
    exit;
}

$avatarPath = !empty($user["avatar"]) ? $user["avatar"] : null;

echo json_encode([
    "error" => false, 
    "user" => [
        "name" => $user["name"],
        "email" => $user["email"],
        "avatar" => $avatarPath
    ]
]);