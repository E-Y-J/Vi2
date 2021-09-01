import Axios from 'axios';
import React, { Component, useRef, useEffect } from 'react';
import {connect} from 'react-redux'
import cblogo from '../media/cblogo.png'

const { v4: uuidv4 } = require('uuid');
var id = uuidv4()

const AlwaysScrollToBottom = () => {
  const elementRef = useRef();
  useEffect(() => {
    elementRef.current.scrollIntoView()
  });
  return <div ref={elementRef} />;
};

class chatbot extends Component {

    constructor(){
        super();
        this.state = {
          name: "",
          message: ""
        }
    }
    
    componentDidMount = async() => {
      try{
        await this.props.setSession(id);
      }catch(err){}

      try {
        console.log(this.props)
        const response = await Axios.post('/api/dialogflow/eventQuery',{"queryEvent":"IntroduceVi2", "sessionId":this.props.sessionID})
        const content = response.data.response
        const message2 = {
          key: this.props.messages.length,
          type: "bot",
          message: content.fulfillmentText
        }
        this.props.addMessage(message2)
      } catch (error) {
        console.log(error);
      }
    }
    
    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };
    
    onSubmit = e => {
        e.preventDefault();
    
        const user = {
          name: this.state.name
        }
        this.props.setUser(user)
    }

    onSubmitMessage = async e => {
        e.preventDefault();
        const message = {
          key: this.props.messages.length,
          type: "user",
          message: this.state.message
        }
        this.props.addMessage(message)
        var input = this.state.message
        
        const textQueryVariable = {
          "queryText":input,
          "sessionId":this.props.sessionID
        }
        
        try {
          const response = await Axios.post('/api/dialogflow/textQuery',textQueryVariable)
          const content = response.data.response.fulfillmentText
          const intent = response.data.response.intent.displayName
          console.log(content)
          console.log(intent)
          
          const message2 = {
            key: this.props.messages.length,
            type: "bot",
            message: content
          }

          if (intent === "Default Fallback Intent"){
            this.props.addMessage(message2)
          }
          else if(intent === "Get Student Name" || intent === "Get Student Name All"){
            this.props.addMessage(message2)
            this.props.setName(response.data.response.outputContexts[0].parameters.fields.name.stringValue)
            Axios.post("/addUser", {name: this.props.userName}).then(res => {
              console.log("kek")
              this.props.setUser(res.data._id);
            })
          }
          else if(intent === "Show Problem"){
            this.props.setProblem(response.data.response.outputContexts[0].parameters.fields.problem.stringValue)
            this.props.addMessage(message2)
            if(typeof response.data.response.outputContexts[0].parameters.fields.requestion !== "undefined"){
              const response1 = await Axios.post('/api/dialogflow/textQuery',{"queryText":"RE", "sessionId":this.props.sessionID})
              const content1 = response1.data.response.fulfillmentText
              const message3 = {
                key: this.props.messages.length,
                type: "bot",
                message: content1
              }
              this.props.addMessage(message3)
              if(typeof response.data.response.outputContexts[0].parameters.fields.requestion !== "undefined"){
                const response1 = await Axios.post('/api/dialogflow/textQuery',{"queryText":"RE", "sessionId":this.props.sessionID})
                const content1 = response1.data.response.fulfillmentText
                const message3 = {
                  key: this.props.messages.length,
                  type: "bot",
                  message: content1
                }
                this.props.addMessage(message3)
              }
              else if(typeof response.data.response.outputContexts[0].parameters.fields.summary !== "undefined"){
                const response1 = await Axios.post('/api/dialogflow/textQuery',{"queryText":"summary", "sessionId":this.props.sessionID})
                const content1 = response1.data.response.fulfillmentText
                const message3 = {
                  key: this.props.messages.length,
                  type: "bot",
                  message: content1
                }
                this.props.addMessage(message3)
              }
            }
            else if(typeof response.data.response.outputContexts[0].parameters.fields.summary !== "undefined"){
              const response1 = await Axios.post('/api/dialogflow/textQuery',{"queryText":"summary", "sessionId":this.props.sessionID})
              const content1 = response1.data.response.fulfillmentText
              const message3 = {
                key: this.props.messages.length,
                type: "bot",
                message: content1
              }
              this.props.addMessage(message3)
            }
          }
          else if(intent === "Check Question Answer"){
            this.props.addMessage(message2)
            if(typeof response.data.response.outputContexts[0].parameters.fields.requestion !== "undefined"){
              const response1 = await Axios.post('/api/dialogflow/textQuery',{"queryText":"RE", "sessionId":this.props.sessionID})
              const content1 = response1.data.response.fulfillmentText
              const message3 = {
                key: this.props.messages.length,
                type: "bot",
                message: content1
              }
              
              this.props.addMessage(message3)
            }
            else if(typeof response.data.response.outputContexts[0].parameters.fields.summary !== "undefined"){
              const response1 = await Axios.post('/api/dialogflow/textQuery',{"queryText":"summary", "sessionId":this.props.sessionID})
              const content1 = response1.data.response.fulfillmentText
              const message3 = {
                key: this.props.messages.length,
                type: "bot",
                message: content1
              }
              this.props.addMessage(message3)
            }
          }
          else if(intent === "Ask Question"){
            this.props.setQuestionType(response.data.response.outputContexts[0].parameters.fields.inputtype.stringValue)
            this.props.addMessage(message2)
          }
          else if(content.text.text[0] === "Congratulations!You solved the problem!"){
            this.props.addMessage(message2)
            const response1 = await Axios.post('/api/dialogflow/textQuery',{"queryText":"summary", "sessionId":this.props.sessionID})
            const content1 = response1.data.response.fulfillmentText
            const message3 = {
              key: this.props.messages.length,
              type: "bot",
              message: content1
            }
            this.props.addMessage(message3)
            // ----------------------------replace setmistake to the proper mistake field
            this.props.setMistake(response1.data.outputContexts[0].parameters.fields.mistake.numberValue)
            // ---------------------------- if questione type = 1 or 2 or 3 or 4 or 5 and so on then setmistake either to U / F / C
          }
          else{
            this.props.addMessage(message2)
          }
          
          
        } catch (error) {
          
        }
        
        this.setState({message: ""})
    }

    //for updates
    componentDidUpdate(prevProps){
      if(prevProps.messages !== this.props.messages){
      }
    }

    render() {
        return (
        <div className="chatbotContainer">
          <img src={cblogo} style={{marginBottom:"-50px", marginTop:"-50px", minHeight:"260px", minWidth:"250px"}}/>
          <div className="chatBot">
            <h3 style={{margin:"0px 0px 0px 0px"}}>Chat with Vi2 below!</h3>
            <div className="chatLog">
              {this.props.messages.length === 0 ? "" : this.props.messages.map((msg) => <div className={msg.type} key={msg.key}>{msg.message}</div>)}
              <AlwaysScrollToBottom />
            </div>
            <form className="messageSendForm" onSubmit={this.onSubmitMessage}>
              <input required type="text" className="messageInput" onChange={this.onChange} value={this.state.message} id="message" placeholder="Your message here!"/>
                  <button className="messageButton">Send</button>
            </form>
          </div>
            
        </div>
        );
    }
}

function mapStateToProps(state){
  return {
    currentUser: state.currentUser,
    sessionID: state.sessionID,
    userName : state.userName,
    messages: state.messages,
    value1: state.value1,
    value2: state.value2,
    person1: state.person1,
    person2: state.person2,
    mistakesU: state.mistakesU,
    mistakesF: state.mistakesF,
    mistakesC: state.mistakesC,
    draggables: state.draggables,
    questiontype: state.questiontype,
    problem: state.problem
  }
}

function mapDispatchToProps(dispatch){
    return {
      setUser: (userObject) => {
        dispatch({type: "SET_USER", payload: userObject})
      },
      setSession: (userObject) => {
        dispatch({type: "SET_SESSION", payload: userObject})
      },
      setName: (userObject) => {
        dispatch({type: "SET_NAME", payload: userObject})
      },
      addMessage: (msgObject) => {
        dispatch({type: "ADD_MESSAGE", payload: msgObject})
      },
      setValue1: (msgObject) => {
        dispatch({type: "SET_VALUE1", payload: msgObject})
      },
      setValue2: (msgObject) => {
        dispatch({type: "SET_VALUE2", payload: msgObject})
      },
      setPerson1: (msgObject) => {
        dispatch({type: "SET_PERSON1", payload: msgObject})
      },
      setPerson2: (msgObject) => {
        dispatch({type: "SET_PERSON2", payload: msgObject})
      },
      setQuestionType: (msgObject) => {
        dispatch({type: "SET_QUESTION_TYPE", payload: msgObject})
      },
      setProblem: (msgObject) => {
        dispatch({type: "SET_PROBLEM", payload: msgObject})
      },
      setMistakeU: (msgObject) => {
        dispatch({type: "SET_MISTAKEU", payload: msgObject})
      },
      setMistakeF: (msgObject) => {
        dispatch({type: "SET_MISTAKEF", payload: msgObject})
      },
      setMistakeC: (msgObject) => {
        dispatch({type: "SET_MISTAKEC", payload: msgObject})
      },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(chatbot)
