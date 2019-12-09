<?php
/* connection info */
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "greek";

/* connect */
try {
   $_conn = new mysqli($servername, $username, $password, $dbname);

   if ($_conn->connect_error) {
      throw new Exception( $_conn->connect_error );
   }

   return $_conn;
}
catch ( Exception $e ) {
  throw new Exception( $e->getMessage() );
}
?>