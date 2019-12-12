<?php
require_once( "constants.php" );
require_once( "config.php" );

function psConnection() {

   global $_serverName, $_userName, $_password, $_dbName;

   try {
      $conn = new mysqli( $_serverName, $_userName, $_password, $_dbName );

      if ($conn->connect_error) {
         throw new Exception( $conn->connect_error );
      }

      $conn->set_charset( "utf8" );
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
