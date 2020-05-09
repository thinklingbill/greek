import React from 'react'

var updateText = function(text) {
    //this.setState({text})
    console.log( "Update Text", this.state);
    //this.setState( { text: "JOJO" } );
    this.updateState( { text: text } );
    //this.render();
}

class Sibling1 extends React.Component {
    render() {
        return (
            <div>
                <div>I am Sibling 1</div>
                <input type="text" 
                 placeholder="Write text" onChange={(e) => updateText(e.target.value)} />
            </div>
        )
    }
}

class Sibling2 extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            text: "Initial State"
        }
        console.log( "Binding sibling 2");
        updateText = updateText.bind(this)
    }

    componentDidMount() {
       console.log( "COMPONENT DID MOUNT");
    }

    updateState( text ) {
       this.setState( {text: text } );
    }

    render() {
        return (
            <div>
                <div>I am Sibling 2</div>
                <div>{this.state.text}</div>
            </div>
        )
    }
}

class Parent extends React.Component {
    render() {
        return (
            <div>
                <Sibling1 />
                <Sibling2 />
            </div>
        )
    }
}

export default Parent;