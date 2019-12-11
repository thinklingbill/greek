<?php

function connection() {
/* connect */



/* connection info */
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "greek";

try {
   $conn = new mysqli($servername, $username, $password, $dbname);

   if ($conn->connect_error) {
      throw new Exception( $conn->connect_error );
   }

print "successful";
   return $conn;
}
catch ( Exception $e ) {
  throw new Exception( $e->getMessage() );
}
}
?>