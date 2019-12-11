<?php
require_once "constants.php";
require_once "persistenceServices.php";

try {
   $conn = psConnection();

   $result = psQuery( $conn, "SELECT * FROM contraction" );

   $dataSet = array( );

   $dataSet[0] = array( "status" => SUCCESS );
   $dataSet[1] = $result;
   print json_encode( $dataSet );
}
catch ( Exception $e ) {
   $dataSet[0] = array( "status" => FAILURE, "errorMsg" => $e->getMessage() );
   print json_encode( $dataSet );
}
?>
