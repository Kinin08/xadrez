<?php
include "./connection.php";
session_start();
header('Content-Type: application/json');

if (empty($_POST["name"]) || empty($_POST["email"]) || empty($_POST["password"]) || empty($_POST['confirmWord'])) {
    echo json_encode(["error" => true, "message" => "Todos os campos são obrigatórios"]);
    exit;
}

$name = trim($_POST["name"]);
$email = trim($_POST["email"]);
$password = trim($_POST["password"]);
$confirmWord = trim($_POST["confirmWord"]);

if ($password !== $confirmWord) {
    echo json_encode(["error" => true, "message" => "As senhas não coincidem"]);
    exit;
}

if (strlen($password) < 4) {
    echo json_encode(["error" => true, "message" => "A senha deve ter pelo menos 6 caracteres"]);
    exit;
}

if (!str_ends_with($email, '@gmail.com')) {
    echo json_encode(["error" => true, "message" => "O email deve terminar com @gmail.com"]);
    exit;
}

$sql = "SELECT id FROM users WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->execute([$email]);
$user = $stmt->fetch();
if ($user) {
    echo json_encode(["error" => true, "message" => "Email já cadastrado"]);
    exit;
}

$hash = password_hash($password, PASSWORD_DEFAULT);
$defaultAvatar = "/ChessNew/uploads/default.jpg";

try {
    $sql = "INSERT INTO users (name, email, password, avatar) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$name, $email, $hash, $defaultAvatar]);

    $_SESSION["id"] = $conn->lastInsertId();
    $_SESSION["name"] = $name;
    $_SESSION["email"] = $email;
    $_SESSION["avatar"] = $defaultAvatar;

    echo json_encode([
        "error" => false,
        "message" => "Usuário cadastrado com sucesso"
    ]);
} catch (Exception $error) {
    echo json_encode([
        "error" => true,
        "message" => "Erro no cadastro",
        "errormsg" => $error->getMessage()
    ]);
}