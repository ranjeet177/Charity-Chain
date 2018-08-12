import React, { Component } from 'react';
import {Grid, Row, Col, PageHeader} from 'react-bootstrap';

/**
 * Class representing the home page rendering
 * 
 * @extends React.Component
 */
class Home extends Component{

  //#region Constructor
  constructor(props){
    super(props);
  }
  //#endregion
  raiseInvoiceClicked = async () => {
    this.setState({ isLoading: true });
    const { username, category, description, contact, amount} = this.state;

    try {
      
      // set up our contract method with the input values from the form
      const createAccount = DTwitter.methods.createAccount(username, category, description, contact, amount);


      // get a gas estimate before sending the transaction
      const gasEstimate = await createAccount.estimateGas({ from: web3.eth.defaultAccount, gas: 1000000 });


      // send the transaction to create an account with our gas estimate
      // (plus a little bit more in case the contract state has changed).
      const result = await createAccount.send({ from: web3.eth.defaultAccount,  gas: gasEstimate + 1000 });

      // check result status. if status is false or '0x0', show user the tx details to debug error
      // if (result.status && !Boolean(result.status.toString().replace('0x', ''))) { // possible result values: '0x0', '0x1', or false, true
      //   return this.setState({ isLoading: false, error: 'Error executing transaction, transaction details: ' + JSON.stringify(result) });
      // }

      // Completed of async action, set loading state back
      this.setState({ isLoading: false });

      // tell our parent that we've created a user so it
      // will re-fetch the current user details from the contract
      this.props.onAfterUserUpdate();

      // redirect user to the profile update page
      this.props.history.push('/update/@' + username);

    } catch (err) {
      // stop loading state and show the error
      this.setState({ isLoading: false, error: err.message });
    };
  }
  //#region React lifecycle events
  render() {
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <PageHeader>
              Charity-Chain <small>Built using Embark by Status</small>
            </PageHeader>
          </Col>
        </Row>
        <Row>
        </Row>
      </Grid>
    );
  }
  //#endregion
}

export default Home