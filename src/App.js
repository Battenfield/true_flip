import React, { Component } from 'react'
import FlipContract from '../build/contracts/Flip.json'

import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageValue: 0,
      web3: null,
      contract: null,
      account: null,
      revealTime:'', 
      randomStage:'', 
      players:'',
      payTime: '',
      winner:'',
      player2Lied:'',
      player1Lied:''
    }

    this.handleUpdate = this.handleUpdate.bind(this);
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')
    const flipContract = contract(FlipContract)
    flipContract.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on SimpleStorage.
    var flipContractInstance

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      flipContract.deployed().then((instance) => {
        flipContractInstance = instance
      }).then((result) => {
        // Get the value from the contract to prove it worked.
        return flipContractInstance.getPlayers.call()
      }).then((result) => {
        const newWeb3 = this.state.web3;
        newWeb3.eth.defaultAccount = this.state.web3.eth.accounts[0];
        return this.setState({ contract: flipContractInstance, account: accounts[0], web3: newWeb3, players: result })
      }).then((result) => {
        const callback = () => window.location.reload();;
        this.state.web3.currentProvider.publicConfigStore.on('update', callback);
        this.handleUpdate();
      })
    })
  }

  join = async () => {
    this.state.contract.enter({from: this.state.account, value: 10000000000000000000})
      .then(result => {
        return this.handleUpdate();
      })
  }

  async handleUpdate() {
    const { contract, account } = this.state;
    let players =  await contract.getPlayers.call({ from: account});
    let randomStage =  await contract.getRandomStage.call({ from: account});
    let revealTime =  await contract.getRevealStage.call({ from: account});
    let player1Lied =  await contract.getPlayer1Lied.call({ from: account});
    let player2Lied =  await contract.getPlayer2Lied.call({ from: account});
    let winner = await contract.getWinner.call({ from: account });

    this.setState({randomStage,revealTime,player1Lied,player2Lied,players,winner});
  }

  // renderCommitInput = async () => {
  //   var hash = this.state.web3.utils.sha3(this.state.web3.utils.toHex(8), {encoding:"hex"});
  // }

  // renderRevealInput = () => {

  // }

  keccakIt = (e) => {
    let val = e.target.value
    var hash = this.state.web3.utils.sha3(this.state.web3.utils.toHex(val), {encoding:"hex"});
    this.setState({value: val, hash})
  }

  revealUpdate = (e) => {
    let reveal = e.target.value
    this.setState({ value: reveal });
  }

  submitCommit = async () => {
    await this.state.contract.commit(this.state.hash, { from: this.state.account});
    this.handleUpdate();
  }

  checkBothPlayersIn = async () => {
    const bothPlayersIn = await this.state.contract.getBothPlayersIn().call({ from: this.state.account });
    this.setState({ bothPlayersIn });
  }

  submitReveal = async () => {
    const submitReveal = await this.state.contract.reveal(this.state.value, { from: this.state.account });
    this.handleUpdate();
  }

  sendDatMoney = async () => {
    await this.state.contract.pickWinner({ from: this.state.account });
    this.handleUpdate();
  }

  renderStatus = () => {
    const { players, account, revealTime } = this.state;
    if(this.state.winner != "0x0000000000000000000000000000000000000000") return `The winner is : ${this.state.winner}!!!`
    if(revealTime) return "reveal your commit"
    if(!players.length) {
      return "Click join to enter game"
    } 
    if(players.length === 2) {
      return "Please commit your entropy"
    }
    return "waiting on one more player"
  }

  render() {
    const { players, account } = this.state;
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal" >
            <a href="#" className="pure-menu-heading pure-menu-link">True Flip</a>
            <h5 style={{ "display": "inline-block", "margin-right": "20px", "color": "white"}}>{`Your address: ${account}`}</h5>
            <button onClick={()=>this.handleUpdate()}>refresh</button>
        </nav>

        <main   className="container">
          <div style={{"margin-top": "50px"}} className="pure-g">
            <div className="pure-u-1-1">

            {/* Game Status */}
              { `Players in game: ${players}`}
              <div className="game-status">{this.renderStatus()}</div>
              
            {/* Game Stages */}
              <div style={{marginTop:'30px'}}>
              {/* join */}
              { players.length === 2 ? null : <button onClick={this.join}>join</button> }


              {/* commit */}
              {this.state.randomStage && !this.state.revealTime && <div><input onChange={(e)=>this.keccakIt(e)}/></div>}
              {this.state.randomStage && !this.state.revealTime && <button onClick={()=>this.submitCommit()}>Submit Random Number</button>}

              {/* reveal */}
              {this.state.revealTime && this.state.winner == "0x0000000000000000000000000000000000000000" && <div><input value={this.state.value} onChange={(e)=>this.revealUpdate(e)}/></div>}
              {this.state.revealTime && this.state.winner == "0x0000000000000000000000000000000000000000" && <button onClick={()=>this.submitReveal()}>Submit Reveal</button>}
            </div>

            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
