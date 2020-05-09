import React from 'react'

class TestComp extends React.Component {
   // constructor() { }
   constructor(props) {
      super(props);
      this.state = {i: 10};
   }

   render() {
      return (
         <div>
            HELLO WORLD! {this.state.i}
         </div>
      )
   }
};

export default TestComp;