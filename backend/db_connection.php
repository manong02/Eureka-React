<?php
// Database connection settings
$servername = '127.0.0.1'; // Database host
$username = 'root'; // MySQL username (usually root for XAMPP)
$password = ''; // MySQL password (leave empty if you're using the default for XAMPP)
$dbname = 'homeworkapp'; // The database you're connecting to


try {
    //create a new pdo instance
    $dsn = "mysql:host=$servername;dbname=$dbname;charset=utf8mb4";
    $pdo = new PDO($dsn, $username, $password);

    // set pdo error mode to exception for better error handling
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // echo "Connection successful!";
} catch (PDOException $e) {
    // catch and display the error if the connection fails
    die("Connection failed: " . $e->getMessage());
}
