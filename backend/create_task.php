<?php
header("Access-Control-Allow-Origin: *"); // Allow all origins

session_start();


include('db_connection.php');

// Check if the user is logged in
if (!isset($_SESSION['user_id']) || empty($_SESSION['user_id'])) {
    header('Location: http://localhost:5173/login');
    exit();
}

$user_id = $_SESSION['user_id'];

// get form data
$title = $_POST['title'];
$description = $_POST['description'];
$subject_id = $_POST['subject_id'];
$due_date = $_POST['due_date'];


try {
    // Prepare the INSERT query using PDO
    $stmt = $pdo->prepare("INSERT INTO tasks (title, description, subject_id, due_date, user_id) 
                           VALUES (:title, :description, :subject_id, :due_date, :user_id)");

    // Bind the values to the placeholders
    $stmt->bindParam(':title', $title);
    $stmt->bindParam(':description', $description);
    $stmt->bindParam(':subject_id', $subject_id);
    $stmt->bindParam(':due_date', $due_date);
    $stmt->bindParam(':user_id', $user_id);

    // Execute the statement
    $stmt->execute();

    // Redirect after successful task creation
    echo "New task created successfully!";
    header("Location: http://localhost:5173/");
} catch (PDOException $e) {
    // Handle errors and display a message
    echo "Error: " . $e->getMessage();
}
