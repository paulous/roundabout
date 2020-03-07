import React, { Component } from 'react';
import './App.css';
import styled, {keyframes, ThemeProvider} from 'styled-components'

class App extends Component {
  constructor(props){
    super(props)

    const MyContract = window.web3.eth.contract(
      [
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "name": "result",
              "type": "bool"
            }
          ],
          "name": "ExperimentComplete",
          "type": "event"
        },
        {
          "constant": false,
          "inputs": [],
          "name": "kill",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [],
          "name": "setExperimentInMotion",
          "outputs": [
            {
              "name": "",
              "type": "bool"
            }
          ],
          "payable": true,
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "newState",
              "type": "string"
            }
          ],
          "name": "setState",
          "outputs": [],
          "payable": true,
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "payable": true,
          "stateMutability": "payable",
          "type": "fallback"
        },
        {
          "inputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "constant": true,
          "inputs": [],
          "name": "getSecret",
          "outputs": [
            {
              "name": "",
              "type": "string"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [],
          "name": "getState",
          "outputs": [
            {
              "name": "",
              "type": "string"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [],
          "name": "pseudoRandomResult",
          "outputs": [
            {
              "name": "",
              "type": "bool"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [],
          "name": "you_awesome",
          "outputs": [
            {
              "name": "",
              "type": "string"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        }
      ]
    )

    this.state = {
      ContractInstance: MyContract.at('0x39f1644a929f00c1b3dac6db68d2d35a318b6cd2'),
      contractState:''
    }

    this.querySecret = this.querySecret.bind(this)
    this.queryContractState = this.queryContractState.bind(this) 
    this.handelContractStateSubmit = this.handelContractStateSubmit.bind(this) 
    this.queryConditionResult = this.queryConditionResult.bind(this) 
    this.activateExperiment = this.activateExperiment.bind(this)

    this.state.event = this.state.ContractInstance.ExperimentComplete()
  }

  querySecret() {
    const {getSecret} = this.state.ContractInstance
    getSecret((err, secret) => {
      if(err) console.error('this is an error.', err)
      console.log('This is the contract secret', secret)
    })
  }

  queryContractState() {
    const {getState} = this.state.ContractInstance
    getState((err, state) => {
      if(err) console.error('this is an error.', err)
      console.log('This is the contract state.', state)
    })
  }

  handelContractStateSubmit(event){
    event.preventDefault()

    const {setState} = this.state.ContractInstance
    const {contractState:newState} = this.state

    setState(
      newState,
      {
        gas:300000,
        from:window.web3.eth.accounts[0],
        value:window.web3.toWei(0.01, 'ether')
      }, (err, result) => {
        console.log('Smart contract state is changing', result)
      }
    )
  }

  queryConditionResult() {
    const {pseudoRandomResult} = this.state.ContractInstance
    pseudoRandomResult((err, result) => {
      if(err) console.error('this is an error.', err)
      console.log('This is the contract state', result)
    })
  }

  activateExperiment() {
    const {setExperimentInMotion} = this.state.ContractInstance
    setExperimentInMotion({
      gas:300000,
      from:window.web3.eth.accounts[0],
      value:window.web3.toWei(0.01, 'ether')
    }, (err, result) => {
      console.log('Experiment to determin true or false set in motion.', result)
    })
  }


  render() {

    const MyStyled = styled.button`
      border:1px solid red;
      font-size: ${props => props.small ? '.2rem' : '2rem'};
      background:${props => props.theme.p1};
    `
    MyStyled.defaultProps = {
      theme:{
        p1:'pink'
      }
    }
    const theme = {
      p1:'powderblue',
      p2:'orange'
    }

    const ExMyStyled = MyStyled.extend`
      border:3px solid green;
      
    `
    const NewTagMyStyled = MyStyled.withComponent('div')

    const DivMyStyled = NewTagMyStyled.extend`
      width:100%;
      height:50px;
      background:lime;
    `

    const rotate360 = keyframes`
      from {
        transform: rotate(0deg);
      }

      to {
        transform: rotate(360deg);
      }
    `

    const Rotate = styled.div`
      display: inline-block;
      animation: ${rotate360} 2s linear infinite;
      padding: 2rem 1rem;
      font-size: 1.2rem;
    `

    this.state.event.watch((err, event) => {
      if(err) console.error('this is an error.', err)
      console.log('This is an event:::', event)      
      console.log('This is an experiment result:::', event.args.result)      
    })
    
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">React and Etherium Simple Application</h1>
        </header>
        <br/>
        <br/>
        <button onClick={this.querySecret}>Query Smart Contract's Secret</button>        
        <br/>
        <br/>
        <button onClick={this.queryContractState}>Query Smart Contract's State</button>        
        <br/>
        <br/>
        <form onSubmit={this.handelContractStateSubmit}>
          <input type="text" 
          name="state-change" 
          placeholder="Enter new state..." 
          value={this.state.contractState} 
          onChange={event => this.setState ({contractState:event.target.value})} />
          <button type="submit">Submit</button>
        </form>
        <br/>
        <br/>
        <button onClick={this.queryConditionResult}>Query Smart Contract's Conditional Result</button>
        <br/>
        <br/>
        <button onClick={this.activateExperiment}>Start Experiment on Smart Contract</button>
        <br/>
        <br/>
        <button onClick={this.genClick}>Start Experiment on Smart Contract</button>
        <br/>
        <br/>
        <MyStyled>My Styled button!</MyStyled>
        <br/>        
        <ThemeProvider theme={theme}>
        <span>
          <MyStyled>My Styled Themed button!</MyStyled>
          <ExMyStyled small>My extended Styled button!</ExMyStyled>                  
        </span>
        </ThemeProvider>
        <br/>
        <br/>
        <MyStyled small>My Styled button small!</MyStyled>
        <br/>
        <br/>
        <ExMyStyled>My extended Styled button!</ExMyStyled>
        <br/>
        <br/>
        <DivMyStyled small>My extended tag changed Styled div!</DivMyStyled>
        <br/>
        <br/>
        <Rotate>&lt; 💅 &gt;</Rotate>
      </div>
    )
  }
}

export default App;
