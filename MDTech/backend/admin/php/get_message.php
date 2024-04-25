<?php

class MessageManager {
  private $servername;
  private $username;
  private $password;
  private $dbname;
  private $conn;

  public function __construct($servername, $username, $password, $dbname) {
    $this->servername = $servername;
    $this->username = $username;
    $this->password = $password;
    $this->dbname = $dbname;

    
    $this->conn = new mysqli($this->servername, $this->username, $this->password, $this->dbname);

   
    if ($this->conn->connect_error) {
      die("Sikertelen csatlakozás: " . $this->conn->connect_error);
    }
  }

  public function getUnreadMessages() {
    
    $sql = "SELECT sender, subject FROM messages WHERE is_read = 'no'";
    $result = $this->conn->query($sql);

   
    if ($result->num_rows > 0) {
     
      while($row = $result->fetch_assoc()) {
        echo "Küldő: " . $row["sender"]. "<br><br>Tárgy: " . $row["subject"]. "<br>";
    
        echo "<hr>";
      }
    } else {
      echo "Nincsenek olvasatlan üzenetek.";
    }
  }

  public function closeConnection() {
    $this->conn->close();
  }
}


$manager = new MessageManager("localhost", "root", "", "mdtech");
$manager->getUnreadMessages();
$manager->closeConnection();
