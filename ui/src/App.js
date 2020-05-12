import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';
//import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Flashcard from './components/flashcard';

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

function App() {
  return (
    <div className="App">
      <Container>
        <Row>
        <ErrorBoundary>
          <Flashcard />
        </ErrorBoundary>
        </Row>
      </Container>

    </div>
  );
}

export default App;
