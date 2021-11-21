import React, { Component } from 'react';
import {connect} from 'react-redux'

class numberSentence extends Component {

    constructor(){
        super();
        this.state = {
            //css for values
            addSelected: "operatorUnchosen",
            subSelected: "operatorUnchosen",
            divSelected: "operatorUnchosen",
            mulSelected: "operatorUnchosen",


            //operands and operator
            nsO1: "",
            nsOP: "",
            nsO2: "",
            nsO3: "",

            //css
            css: "numSenContainer"
        }
    }

    //data manipulation for input boxes
    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };

    //css manipulation for selected operator
    changeAdd = () => {
        this.setState({
            addSelected: "operatorChosen",
            subSelected: "operatorUnchosen",
            divSelected: "operatorUnchosen",
            mulSelected: "operatorUnchosen"
        })
    }
    changeSub = () => {
        this.setState({
            addSelected: "operatorUnchosen",
            subSelected: "operatorChosen",
            divSelected: "operatorUnchosen",
            mulSelected: "operatorUnchosen"
        })
    }
    changeDiv = () => {
        this.setState({
            addSelected: "operatorUnchosen",
            subSelected: "operatorUnchosen",
            divSelected: "operatorChosen",
            mulSelected: "operatorUnchosen"
        })
    }
    changeMul = () => {
        this.setState({
            addSelected: "operatorUnchosen",
            subSelected: "operatorUnchosen",
            divSelected: "operatorUnchosen",
            mulSelected: "operatorChosen"
        })
    }

    //checking and erasing of data
    checkInputs = () => {
        //add nalang here what extra shit we need that calls the backend
        if(this.state.nsO1 === "1"){
            this.setState({
                nsO1: "999"
            })
        }
    }
    eraseInputs = () => {
        this.setState({
            addSelected: "operatorUnchosen",
            subSelected: "operatorUnchosen",
            divSelected: "operatorUnchosen",
            mulSelected: "operatorUnchosen",
            nsO1: "",
            nsOP: "",
            nsO2: "",
            nsO3: ""
        })
    }

    componentDidUpdate(prevProps){
        if(prevProps.messages !== this.props.messages){
            if(this.props.messages[this.props.messages.length-1].message === "Next Problem"){
                this.setState({
                    addSelected: "operatorUnchosen",
                    subSelected: "operatorUnchosen",
                    divSelected: "operatorUnchosen",
                    mulSelected: "operatorUnchosen",
                    nsO1: "",
                    nsOP: "",
                    nsO2: "",
                    nsO3: "",
                    css: "numSenContainerSelected"
                })
            } else {
                this.setState({
                    css: "numSenContainer"
                })
            }
        }
    }

    render() {
        return (
            <div className={this.state.css}>
                <div className="operandContainer">
                    <input type="number" value={this.state.nsO1} id="nsO1" onChange={this.onChange}  placeholder="1st Number" className="numSenInput"/>
                </div>
                <div className="operatorContainer">
                    <div className={"individualOperatorContainer " + this.state.addSelected}>
                        <button className={"add " + this.state.addSelected} onClick={this.changeAdd}></button>
                    </div>
                    <div className={"individualOperatorContainer " + this.state.subSelected}>
                        <button className={"sub " + this.state.subSelected} onClick={this.changeSub}></button>
                    </div>
                    <div className={"individualOperatorContainer " + this.state.divSelected}>
                        <button className={"div " + this.state.divSelected} onClick={this.changeDiv}></button>
                    </div>
                    <div className={"individualOperatorContainer " + this.state.mulSelected}>
                        <button className={"mul " + this.state.mulSelected} onClick={this.changeMul}></button>
                    </div>
                </div>
                <div className="operandContainer">
                    <input type="number"value={this.state.nsO2} id="nsO2" onChange={this.onChange} placeholder="2nd Number"  className="numSenInput"/>
                </div>
                <div className="operandContainer">
                    <input type="number" value={this.state.nsO3} id="nsO3" onChange={this.onChange} placeholder="Final Answer"  className="numSenInput"/>
                </div>
                <div className="nsActionContainer">
                    <button className="check" onClick={this.checkInputs}></button>
                    <button className="cancel" onClick={this.eraseInputs}></button>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state){
return {
    currentProgress: state.currentProgress,
    messages: state.messages,
    sessionID: state.sessionID,


    problem : state.problem,
    inventoryOneName: state.inventoryOneName,
    inventoryTwoName: state.inventoryTwoName,
    itemName: state.itemName,

    currentUser: state.currentUser,
    userName : state.userName,
  };
}


function mapDispatchToProps(dispatch){
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(numberSentence)