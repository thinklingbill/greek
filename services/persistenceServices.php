<?php
require_once( "constants.php" );

function psConnection() {

   /* connection info */
   $servername = "localhost";
   $username = "root";
   $password = "mysql";
   $dbname = "greek";

   try {
      $conn = new mysqli($servername, $username, $password, $dbname);

      if ($conn->connect_error) {
         throw new Exception( $conn->connect_error );
      }

      return $conn;
   }
   catch( Exception $e ) {
      throw new Exception( $e->getMessage() );
   }
}

function psQuery( $conn, $sql ) {

   try {
      $result = $conn->query( $sql );

      if ( $conn->error ) {
         throw new Exception( $conn->error );
      }

      if ( $result ) {
         while ( $row = $result->fetch_array( MYSQLI_ASSOC ) ) {
            $rows[ ] = $row;
         }
      }
      else {
         throw new Exception( $conn->error );
      }

      return $rows;
   }
   catch( Exception $e ) {
      throw new Exception( $e->getMessage() );
   }
}
?>
