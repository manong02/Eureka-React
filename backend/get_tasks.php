<?php

ini_set('display_errors', 0); // Disable error reporting for production
error_reporting(E_ALL); // Still report all errors internally

header("Access-Control-Allow-Origin: http://localhost:5173"); // React app URL
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true"); // Allow credentials

session_start();
include('db_connection.php');



if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("HTTP/1.1 204 No Content");
    exit;
}

// Ensure the user is logged in
if (!isset($_SESSION['user_id'])) {
    http_response_code(401); // Unauthorized
    echo json_encode(['error' => 'User not logged in']);
    exit;
}

try {
    // Query to get tasks from the database
    $query = "SELECT tasks.task_id, tasks.title, tasks.description, tasks.due_date AS dueDate, 
              tasks.status, subjects.name AS subject_name
              FROM tasks
              JOIN subjects ON tasks.subject_id = subjects.subject_id
              WHERE tasks.user_id = :user_id"; // Prepared statement

    // Prepare and execute the query
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':user_id', $_SESSION['user_id'], PDO::PARAM_INT);
    $stmt->execute();

    // Fetch tasks
    $tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Return tasks or an empty array if no tasks
    if ($tasks) {
        echo json_encode($tasks);
    } else {
        echo json_encode([]); // No tasks
    }
} catch (PDOException $e) {
    // Handle errors
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    exit;
}
