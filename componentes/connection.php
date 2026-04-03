<?php
$host = "localhost";
$user = "root";
$password = "12345678";
$database = "chess";
$port = 3306;

$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

$conn = new PDO(
    "mysql:host=$host;dbname=$database;port=$port;charset=utf8",
    $user,
    $password,
    $options
);
?>