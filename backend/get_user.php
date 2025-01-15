<?php
session_start();
include('db_connection.php');

if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];
    $stmt = $pdo->prepare("SELECT username FROM users WHERE id = ?");
    $stmt->execute([$user_id]);
    $user = $stmt->fetch();
    echo json_encode(['username' => $user['username']]);
} else {
    echo json_encode(['error' => 'Not logged in']);
}
