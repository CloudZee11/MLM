<?php

session_start();
if (isset($_SESSION["user_id"]) && isset($_SESSION["user_email"])) {
    header("Location: user/home.html");
    exit();
} else {
    echo "Hiba a felhasználó bejelentkezése során! Kérlek próbáld meg újra!";
    exit();
}
