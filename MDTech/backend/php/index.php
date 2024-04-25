<?php

session_start();
if (isset($_SESSION["user_id"]) && isset($_SESSION["user_email"])) {
    header("Location: ../../frontend/html/home.html");
    exit();
} else {
    echo "Hiba a bejelentkezése során! Kérlek próbáld meg újra!";
    exit();
}
