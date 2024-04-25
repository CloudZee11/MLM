<?php

class ProductEditor
{
    private $pdo;

    public function __construct($host, $dbname, $username, $password)
    {
        $dsn = "mysql:host=$host;dbname=$dbname";
        $this->pdo = new PDO($dsn, $username, $password);
    }

    public function updateProductVisibility($productId, $shown)
    {
        return $this->updateProductProperty($productId, 'shown', $shown);
    }

    public function updateProductFeatured($productId, $featured)
    {
        return $this->updateProductProperty($productId, 'featured', $featured);
    }

    private function updateProductProperty($productId, $property, $value)
    {
        $allowedProperties = ['shown', 'featured'];

        if (!in_array($property, $allowedProperties)) {
            return false;
        }

        $query = "UPDATE airconditioners SET $property = :value WHERE id = :productId";
        $statement = $this->pdo->prepare($query);
        return $statement->execute(array(':value' => $value, ':productId' => $productId));
    }
}
