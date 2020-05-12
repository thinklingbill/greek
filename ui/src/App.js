import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import {
  BrowserRouter,
  Route,
  Redirect,
} from "react-router-dom";
import { withRouter } from "react-router";

//import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Flashcard from './components/flashcard';
import VerbParadigm from './components/verbParadigm';
import Contraction from './components/contraction';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      errorInfo: null
    };
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any child components and re-renders with an error message
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }
  // A fake logging service 😬
  logErrorToServices = function (message) {
    console.log(message);
  }

  render() {
    if (this.state.error) {
      // Fallback UI if an error occurs
      return (
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>
            {this.state.error && this.state.error.toString()}
          </p>
        </Alert>
      );
    }
    // component normally just renders children
    return this.props.children;
  }
}

class Header extends React.Component {
  constructor(props) {
    super(props);
    // TODO - redirect to vocabulary-flashcards in case of any non-route 
    // path, with active state correctly set
    this.state = { pathname: props.location.pathname };

  }

  render() {
    return (
      <Container>
      <Navbar bg="light">
        <Navbar.Brand>NT Greek Flashcards</Navbar.Brand>
        <Nav className="mr-auto" activeKey={this.state.pathname}>
          <Nav.Link href="/vocabulary-flashcards">Vocabulary</Nav.Link>
          <Nav.Link href="/verb-paradigms">Verb Paradigms</Nav.Link>
          <Nav.Link href="/contractions">Contractions</Nav.Link>
        </Nav>
      </Navbar>
      </Container>
    )
  }
}

const HeaderWithRouter = withRouter(Header);

function App() {
  return (
    <div className="App">
      <ErrorBoundary>
          <BrowserRouter>
            <HeaderWithRouter />
            <Route exact path="/">
              <Redirect to="/vocabulary-flashcards" />
            </Route>
            <Route path="/vocabulary-flashcards" exact component={Flashcard} />
            <Route path="/verb-paradigms" exact component={VerbParadigm} />
            <Route path="/contractions" exact component={Contraction} />
          </BrowserRouter>
      </ErrorBoundary>
    </div>
  );
}

export default App;
