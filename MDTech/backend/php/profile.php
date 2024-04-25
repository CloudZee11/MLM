<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "mdtech";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Kapcsolódási hiba: " . $conn->connect_error);
}

session_start();
if (!isset($_SESSION['user_id'])) {
    die("Hiba: A felhasználói azonosító nem található a session-ben.");
}
$user_id = $_SESSION['user_id'];

if($_SERVER["REQUEST_METHOD"] == "POST") {
    $fullName = $_POST['name'];
    $email = $_POST['email'];

    $fullName = mysqli_real_escape_string($conn, $fullName);
    $email = mysqli_real_escape_string($conn, $email);

    $sql = "UPDATE users SET full_name='$fullName', email='$email' WHERE id=$user_id";
    if(mysqli_query($conn, $sql)) {
        header("Location: ../../frontend/html/profile.html");
        exit();
    } else {
        echo "Error updating profile: " . mysqli_error($conn);
    }
}

