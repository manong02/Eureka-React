<?php

session_start();
include('db_connection.php');

// check if the user is logged in
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php'); // Redirect to login if not logged in
    exit;
}

// Get user_id from session
$user_id = $_SESSION['user_id'];

// Query to get the username
$query = "SELECT username FROM users WHERE id = :user_id";
$stmt = $pdo->prepare($query);
$stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
$stmt->execute();

// Fetch the username
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user) {
    $username = $user['username'];
} else {
    $username = 'Unknown User'; // Fallback if no user found
}
