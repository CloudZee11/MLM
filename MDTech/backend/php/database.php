<?php
$hostName = "localhost";
$dbUser = "root";
$dbPassword = "";
$dbName = "mdtech";

$conn = mysqli_connect($hostName, $dbUser, $dbPassword, $dbName);

if (!$conn) {
    die("Nem sikerült kapcsolódni az adatbázishoz. Kérlek, próbáld újra később.");
}

return $conn;