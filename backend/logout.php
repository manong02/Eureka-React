<?php

// start session
session_start();

// unset all session variables
session_unset();

// destroy the session
session_destroy();

include('db_connection.php');

// redirect the user to the login page 
header('Location: http://127.0.0.1/eureka/features/login/login.html');

// ensure no further code is executed
exit();
