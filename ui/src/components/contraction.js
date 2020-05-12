import React from 'react';
import Card from 'react-bootstrap/Card'

class Contraction extends React.Component {
   // constructor() { }
   constructor(props) {
      super(props);
      this.state = {
         hasError: false,
         error: null,
         errorMessage: null
      };
   }


   render() {
      if (this.state.hasError) {
         throw new Error(this.state.errorMessage);
      }
      return (
         <Card>
            <Card.Body>
               <Card.Text>Contraction - Not yet implemented</Card.Text>
            </Card.Body>
         </Card>
      )
   }
};

export default Contraction;