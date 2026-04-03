<?php
session_start();
include "./connection.php";
header('Content-Type: application/json');

if(empty($_POST['email']) || empty($_POST['password'])){
    echo json_encode(['error'=>true,'message'=>'Email e senha obrigatórios']);
    exit;
}

$email = trim($_POST['email']);
$password = trim($_POST['password']);

$stmt = $conn->prepare("SELECT * FROM users WHERE email=? LIMIT 1");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if(!$user){
    echo json_encode(['error'=>true,'message'=>'Usuário não encontrado']);
    exit;
}

if(!password_verify($password,$user['password'])){
    echo json_encode(['error'=>true,'message'=>'Senha incorreta']);
    exit;
}

session_regenerate_id(true);
$_SESSION['id'] = $user['id'];
$_SESSION['name'] = $user['name'];
$_SESSION['email'] = $user['email'];
$_SESSION['avatar'] = $user['avatar'] ?? '/Chess/uploads/default.jpg';

echo json_encode([
    'error'=>false,
    'message'=>'Login realizado',
    'name'=>$user['name'],
    'email'=>$user['email'],
    'avatar'=>$_SESSION['avatar']
]);
?>