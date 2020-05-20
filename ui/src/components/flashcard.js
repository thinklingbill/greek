import React from 'react';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const text = {
   correct: "Got it!",
   missed: "I missed it",
   showDefinition: "Show definition",
   resetStats: "Reset stats",
   correctLabel: "Correct",
   missedLabel: "Missed",
   transliterationLabel: "Transliteration:",
   statsLabel: "My stats:",
   minFrequencyLabel: "Words appearing this many times or more in the NT:"
}

const defaultValue = {
   minFrequency: 10
  ,maxCorrect: 2
}

class Flashcard extends React.Component {
   // constructor() { }
   constructor(props) {
      super(props);
      this.state = {
         card: {},
         mode: 'flashcard',
         correct: 0,
         missed: 0,
         minFrequency: defaultValue.minFrequency,         
         hasError: false,
         error: null,
         errorMessage: null,
      };
   }

   componentDidMount() {
      // get the state of the stats
      //      const _this = this;
      fetch('http://localhost:3000/api/vocabulary-stat')
         .then((res) => { // check status
            if (!res.ok) {
               throw new Error(res.statusText);
            }
            return res.json(); // convert to json
         })
         .then((res) => { // business/custom logic
            this.setState({ correct: res[0].correctCount, missed: res[0].missedCount });
            return res;
         })
         .catch((error) => { // carch errors
            this.setState({ hasError: true, error: error, errorMessage: error });
         });

      this.newContent();
   }

   newContent() {
      fetch("http://localhost:3000/api/vocabulary/flashcard?minFrequency="+this.state.minFrequency)
         .then((res) => { // check status
            if (!res.ok) {
               throw new Error(res.statusText);
            }
            return res.json(); // convert to json
         })
         .then((res) => { // business/custom logic
            this.actionFragment = <React.Fragment>
               <Button
                  variant="outline-primary"
                  onClick={() => this.handleClick('show')}
               >{text.showDefinition}
               </Button>
            </React.Fragment>;
            this.setState({ card: res[0], mode: 'flashcard' });
            return res;
         })
         .catch((error) => { // carch errors
            this.setState({ hasError: true, error: error, errorMessage: error });
         });
   }

   handleClick = (command) => {
      console.log( this.state.minFrequency );
      if (this.state.mode === 'flashcard') {
         this.actionFragment = <React.Fragment>
            <Card.Text className='definition'>{this.state.card.definition}</Card.Text>
            <Card.Text>{text.transliterationLabel} {this.state.card.transliteration}</Card.Text>
            <Card.Text>Appears {this.state.card.frequencyCount} times in the NT</Card.Text>
            <ButtonGroup aria-label="Flashcard Stat Response">
               <Button
                  variant="outline-success"
                  onClick={() => this.handleClick('markCorrect')}
               >{text.correct}
               </Button>
               <Button
                  variant="outline-danger"
                  onClick={() => this.handleClick('markMissed')}
               >{text.missed}
               </Button>
            </ButtonGroup>
         </React.Fragment>;
         this.setState({ card: this.state.card, mode: 'result' });
      }
      else {
         if (command === 'markCorrect') {
            this.setState({ correct: this.state.correct + 1 });
            fetch('http://localhost:3000/api/vocabulary-stat/mark-correct', {
               method: 'PUT',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ vocabularyId: this.state.card.vocabularyId })
            })
               .then((res) => { // check status
                  if (!res.ok) {
                     throw new Error(res.statusText);
                  }
               })
               .catch((error) => { // carch errors
                  this.setState({ hasError: true, error: error, errorMessage: error });
               });
         }
         else {
            this.setState({ missed: this.state.missed + 1 });
            fetch('http://localhost:3000/api/vocabulary-stat/mark-missed', {
               method: 'PUT',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ vocabularyId: this.state.card.vocabularyId })
            })
               .then((res) => { // check status
                  if (!res.ok) {
                     throw new Error(res.statusText);
                  }
               })
               .catch((error) => { // carch errors
                  this.setState({ hasError: true, error: error, errorMessage: error });
               });
         }

         this.newContent();
      }
   }

   updateInputValue = (evt) => {
      console.log( "ONCHANGE");
      this.setState({
        minFrequency: evt.target.value
      });
   }

   render() {
      if (this.state.hasError) {
         throw new Error(this.state.errorMessage);
      }
      return (
         <Container>
            <Form>
            <Form.Group controlId="minFrequency">
               <Row>
               <Col>
               <Form.Label>{text.minFrequencyLabel}</Form.Label>
               </Col>
               <Col>
               <FormControl size="sm" type="text" defaultValue={defaultValue.minFrequency} onChange={this.updateInputValue} />
               </Col>
               </Row>
            </Form.Group>
            </Form>
            <Card>
               <Card.Header as="h3">{this.state.card.lemma}</Card.Header>
               <Card.Body>
                  {this.actionFragment}
               </Card.Body>
               <Card.Footer>
                  {text.statsLabel} {this.state.correct} {text.correctLabel}, {this.state.missed} {text.missedLabel}
                  {' '}
                  <Button variant="outline-info">
                     {text.resetStats}
                  </Button>
               </Card.Footer>
            </Card>
         </Container>
      )
   }
};

// <Form.Control size="sm" type="text" placeholder={defaultValue.maxCorrect} />

export default Flashcard;