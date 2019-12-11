<?php

echo "here 0";
include "connect.php";

$conn = connection();

echo "here 1";

$sql = "SELECT * FROM contraction";
$result = $conn->query($sql);

echo "here 2";
echo "<html><head>";
echo "<title>Contractions</title>";
echo "<style type=text/css>";
echo "body {";
echo "margin-left: 0.5in;";
echo "}";
echo "</style>";
echo "</head>";
echo "<body>";
echo "<h3>Contractions</h3>";

if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
        echo $row["firstElement"]. " + " . $row["secondElement"]. " = " .$row["result"] . "<br>";
    }
} else {
    echo "0 results";
}

echo "</body>";
echo "</html>";
$conn->close();
?>