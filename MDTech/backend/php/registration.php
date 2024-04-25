<?php
header('Content-Type: application/json');

class RegistrationController
{
    private $conn;

    public function __construct($conn)
    {
        $this->conn = $conn;
    }


    
    public function handleRegistration()
    {
        $errors = array();

        if ($_SERVER["REQUEST_METHOD"] == "POST") {

            $fullname = $_POST["fullname"];
            $email = $_POST["email"];
            $password = $_POST["password"];
            $repeatPassword = $_POST["repeat_password"];

            if (empty($fullname) || empty($email) || empty($password) || empty($repeatPassword)) {
                $errors[] = "Minden mező kitöltése kötelező!";
            }

            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $errors[] = "Helytelen e-mail cím!";
            }

            if (strlen($password) < 8) {
                $errors[] = "A jelszónak legalább 8 karakternek kell lenni!";
            }

            if ($password !== $repeatPassword) {
                $errors[] = "A jelszónak egyeznie kell!";
            }

            
            $sqlCheckEmail = "SELECT id FROM users WHERE email = ?";
            $stmtCheckEmail = mysqli_stmt_init($this->conn);

            if (mysqli_stmt_prepare($stmtCheckEmail, $sqlCheckEmail)) {
                mysqli_stmt_bind_param($stmtCheckEmail, "s", $email);
                mysqli_stmt_execute($stmtCheckEmail);
                $resultCheckEmail = mysqli_stmt_get_result($stmtCheckEmail);
                $rowCount = mysqli_num_rows($resultCheckEmail);

                if ($rowCount > 0) {
                    $errors[] = "Az e-mail cím már regisztrálva van!";
                }
            }

            if (count($errors) > 0) {
                echo json_encode(['errors' => $errors]);
                exit();
            } else {
                $passwordHash = password_hash($password, PASSWORD_DEFAULT);

                $sql = "INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)";
                $stmt = mysqli_stmt_init($this->conn);
                $prepareStmt = mysqli_stmt_prepare($stmt, $sql);

                if ($prepareStmt) {
                    mysqli_stmt_bind_param($stmt, "sss", $fullname, $email, $passwordHash);
                    mysqli_stmt_execute($stmt);

                    
                    $sqlGetUser = "SELECT id FROM users WHERE email = ?";
                    $stmtGetUser = mysqli_stmt_init($this->conn);

                    if (mysqli_stmt_prepare($stmtGetUser, $sqlGetUser)) {
                        mysqli_stmt_bind_param($stmtGetUser, "s", $email);
                        mysqli_stmt_execute($stmtGetUser);
                        $resultGetUser = mysqli_stmt_get_result($stmtGetUser);
                        $user = mysqli_fetch_assoc($resultGetUser);

                        if ($user) {
                            
                            session_start();
                            $_SESSION["user_id"] = $user["id"];
                            $_SESSION["user_email"] = $email;

                            echo json_encode(['success' => true]);
                            exit();
                        } else {
                            
                            echo json_encode(['errors' => ['Valami hiba történt a felhasználó kiválasztásakor!']]);
                            exit();
                        }
                    } else {
                        echo json_encode(['errors' => ['Valami hiba történt a felhasználó kiválasztásakor!']]);
                        exit();
                    }
                } else {
                    echo json_encode(['errors' => ['Valami hiba történt!']]);
                    exit();
                }
            }
        }
    }
}

try {
    $conn = require_once "database.php";
    $registrationController = new RegistrationController($conn);
    $registrationController->handleRegistration();
} catch (Exception $e) {
    echo json_encode(['errors' => ['Adatbázis kapcsolódási hiba: ' . $e->getMessage()]]);
    exit();
}
