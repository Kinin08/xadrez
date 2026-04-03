<?php
session_start();
include "./connection.php";
header('Content-Type: application/json');

if(!isset($_SESSION['email'])){
    echo json_encode(['error'=>true, 'message'=>'Usuário não logado']);
    exit;
}

if(!isset($_FILES['avatar']) || $_FILES['avatar']['error'] !== UPLOAD_ERR_OK){
    echo json_encode(['error'=>true, 'message'=>'Nenhum arquivo enviado ou erro no upload']);
    exit;
}

$file = $_FILES['avatar'];
$allowed = ['jpg', 'jpeg', 'png', 'gif'];
$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

if(!in_array($ext, $allowed)){
    echo json_encode(['error'=>true, 'message'=>'Formato não permitido. Use JPG, PNG ou GIF.']);
    exit;
}

// Verificar tamanho do arquivo (máximo 2MB)
if($file['size'] > 2 * 1024 * 1024){
    echo json_encode(['error'=>true, 'message'=>'Arquivo muito grande. Máximo 2MB.']);
    exit;
}

$filename = 'avatar_' . md5($_SESSION['email']) . '_' . time() . '.' . $ext;
$uploadDir = $_SERVER['DOCUMENT_ROOT'] . '/chess/uploads/';
$path = $uploadDir . $filename;

// Verificar se é uma imagem real
$check = getimagesize($file['tmp_name']);
if($check === false) {
    echo json_encode(['error'=>true, 'message'=>'Arquivo não é uma imagem válida']);
    exit;
}

if(move_uploaded_file($file['tmp_name'], $path)){
    // CORREÇÃO: Usar caminho relativo consistente
    $avatarPath = '/chess/uploads/' . $filename;

    $stmt = $conn->prepare("UPDATE users SET avatar = ? WHERE email = ?");
    if($stmt->execute([$avatarPath, $_SESSION['email']])){
        $_SESSION['avatar'] = $avatarPath;
        
        echo json_encode([
            'error'=>false, 
            'avatar'=>$avatarPath,
            'message'=>'Foto atualizada com sucesso!'
        ]);
    } else {
        echo json_encode(['error'=>true, 'message'=>'Erro ao atualizar no banco de dados']);
    }
} else {
    echo json_encode(['error'=>true, 'message'=>'Erro ao salvar arquivo. Verifique permissões.']);
}
?>