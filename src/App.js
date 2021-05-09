import React, {Component} from 'react';
import web3 from './web3';
import lottery from './lottery.js';

class App extends Component {
    state = {
      manager: '',
      players: [],
      balance: '',   //big number js
      value: '',
      mmessage: ''
  };
  
  async componentDidMount() {
    const manager = await lottery.methods.manager().call();  //no need to provide from address here, as we are using web3 provider linked to our metamask, so by default it takes the first address as the from address
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({manager, players, balance});
  }

  onSubmit = async (event) => {

    event.preventDefault();
    // const accounts = await web3.eth.getAccounts();
    

    this.setState({message: 'Waiting on transaction success...'});
    const accounts = await web3.eth.getAccounts();

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });
    this.setState({message: 'You have been entered!!'});
  };

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();
    this.setState({message: 'Waiting on transaction success...'});
    await lottery.methods.pickWinner().send({from: accounts[0]});
    this.setState({message: 'A winner has been picked!!'});

  }

render(){
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>
          This contract is managed by {this.state.manager} <br></br>
          There are currently {this.state.players.length} people entered, 
          competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ether!  {this.state.accounts}
        </p>

        <hr></hr>

        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck ?</h4>
          <div>
            <label>
              Amount of ether to enter:  
            </label>
            <input
              value = {this.state.value}
              onChange = {event => this.setState({value: event.target.value})}
            />
          </div>
          <button>Enter</button>
        </form>

        <hr></hr>

          <h4>Ready to pick a winner ?</h4>
          <button onClick={this.onClick}>Pick a winner!</button> 

        <h2>{this.state.message}</h2>
      </div>
      
    );
  }
}

export default App;
