<?php
session_start();
include('db_connection.php');

// Ensure the user is logged in
if (!isset($_SESSION['user_id'])) {
    http_response_code(401); // Unauthorized
    echo json_encode(['error' => 'User not logged in']);
    exit;
}

ini_set('display_errors', 1);
error_reporting(E_ALL);

// Set the header to return JSON
header('Content-Type: application/json');

try {
    // Query to get tasks from the database using PDO
    $query = "SELECT tasks.task_id, tasks.title, tasks.description, tasks.due_date as dueDate, 
              tasks.status, subjects.name AS subject_name
              FROM tasks
              JOIN subjects ON tasks.subject_id = subjects.subject_id
              WHERE tasks.user_id = :user_id"; // Use placeholder for prepared statements

    // Prepare the statement
    $stmt = $pdo->prepare($query);

    // Bind the user id parameter
    $stmt->bindParam(':user_id', $_SESSION['user_id'], PDO::PARAM_INT);

    // Execute the query
    $stmt->execute();

    // Fetch tasks
    $tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Check if there are tasks and return them as JSON
    if ($tasks) {
        http_response_code(200); // OK
        echo json_encode($tasks);
    } else {
        http_response_code(404); // Not Found
        echo json_encode(['message' => 'No tasks found for this user']);
    }
} catch (PDOException $e) {
    // Handle database errors
    http_response_code(500); // Internal Server Error
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    exit;
}
