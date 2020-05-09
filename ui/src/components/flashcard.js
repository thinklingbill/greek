import React from 'react';


// TODO - fix the REST services to return consistent results, with correct error checking
class Flashcard extends React.Component {
   // constructor() { }
   constructor(props) {
      super(props);
      // This binding is necessary to make `this` work in the callback
      // this.handleClick = this.handleClick.bind(this);      // don't need this but keeping it here in case
      this.state = { card: {}, mode: 'flashcard', correct: 0, missed: 0 };
   }

   componentDidMount() {
      // get the state of the stats
      fetch('http://localhost:3000/api/vocabulary-stat?userId=1')   // TODO - get the real user id
         .then(res => res.json())
         .then((res) => {
            console.log( res[0] ); 
             this.setState({ correct: res[0].correctCount, missed: res[0].missedCount });
         })
         .catch(console.log)


      this.newContent();
   }


   newContent() {
      fetch('http://localhost:3000/api/vocabulary/flashcard?minFrequency=10')
         .then(res => res.json())
         .then((res) => {
            this.actionFragment = <div className='action'><button onClick={() => this.handleClick('show')}>Show</button></div>;
            this.setState({ card: res.data[0], mode: 'flashcard' });
         })
         .catch(console.log)
   }

   handleClick = (command) => {
      if (this.state.mode === 'flashcard') {
         this.actionFragment = <React.Fragment>
            <div className='definition'>{this.state.card.definition}</div>
            <div className='action'>
               <button onClick={() => this.handleClick('markCorrect')}>Correct</button>
               <button onClick={() => this.handleClick('markMissed')}>Missed</button>
            </div>
         </React.Fragment>;
         this.setState({ card: this.state.card, mode: 'result' });
      }
      else {
         if (command === 'markCorrect') {
            console.log("Marking Correct with local increment", this.state.card.vocabularyId);
            this.setState( { correct: this.state.correct+1 });
            fetch('http://localhost:3000/api/vocabulary-stat/correct', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ userId: 1, vocabularyId: this.state.card.vocabularyId })
            })
               .then(res => res.json())
               .catch(console.log) // TODO - OK, what is the real best practice for error catching
         }
         else {
            console.log("Marking Missed with local increment", this.state.card.vocabularyId);
            this.setState( { missed: this.state.missed+1 });
            fetch('http://localhost:3000/api/vocabulary-stat/missed', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ userId: 1, vocabularyId: this.state.card.vocabularyId })
            })
               .then(res => res.json())
               .catch(console.log)
         }
         // const Parent = ReactDOM.render(<TestComp />, document.getElementById('root'));
         // Parent.setState( { i: 11 } );

         this.newContent();
      }
   }

   render() {
      return (
         <div className='flashcard' key={this.state.card.vocabularyId}>
            <div className='lemma'>{this.state.card.lemma}</div>
            <div>
               {this.actionFragment}
            </div>
            <div className='flashcard-stats'>
               {this.state.correct} Correct, {this.state.missed} Missed
            </div>
         </div>
      )
   }
};

export default Flashcard;