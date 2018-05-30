import React, {Component} from 'react';
import {Radio, Table, Grid, Segment, Button, Loader, Message, Icon} from 'semantic-ui-react';
import TextField from 'material-ui/TextField';
import {red500} from 'material-ui/styles/colors';
import _ from 'lodash'
import { withRouter } from 'react-router'
import moment from 'moment'
import {connect} from 'react-redux'
import { Link } from 'react-router-dom'
import {setPaymentMethod} from '../../actions/payment'
import axios from 'axios'
import config from '../../config/index'

console.log('config in topUpPlans = ', config);

var amountRegex = /^[0-9]+$/
var GetIconsDisplay = ({item, imageUrl}) => {
  console.log('icons item in topUpPlans= ', item, " ", imageUrl);
  switch (item) {
    case "0":
      return (<img
        src= {imageUrl + "002-coins1.svg"}  //{config.getImageUrl + "002-coins1.svg"}
        alt="002-coins1"
        height="87px"
        width="100px"
      />)
      break;
    case "1":
      return (<img
        src= {imageUrl + "002-coins2.svg"}
        alt="002-coins2"
        height="87px"
        width="100px"
      />)
      break;
    case "2":
      return (<img
        src= {imageUrl + "002-coins.svg"}
        alt="002-coins"
        height="87px"
        width="100px"
      />)
      break;
    case "payment_method":
      return (<img
        src= {imageUrl + "005-cash.svg"}
        alt="001-payment"
        height="87px"
        width="100px"
      />)
      break;
    default:
      return null
  }
}



class TopUpPlans extends Component {
  constructor(props) {
    super(props)

    this.state = {
      topUpPlans: [
        {amount: {start: 1, end: 99}, coins: 1, currencyCode: 'php'},
        {amount: {start: 100, end: 499}, coins: 2, currencyCode: 'php'},
        {amount: {start: 500, end: 1000}, coins: 3, currencyCode: 'php'}
      ],
      selectedPaymentOption: '',
      amountInput: '',
      currencyCode: 'php',
      amountInputError: false,
      amountInputMessage: 'Invalid Amount!',
      payLoading: false
    }
    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.handleAmountChange = this.handleAmountChange.bind(this)
    this.initiateMolPayment = this.initiateMolPayment.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    console.log('nextProps=', nextProps)
    // this.setState({accountHistory: nextProps.accountHistory, totalCoins: nextProps.totalCoins, user: nextProps.user})
  }

  handleSelectChange(e, { value }) {
    console.log('handleSelectChange = ', value);

    if(value == 'OTHER_OPTIONS') {
      this.setState({ selectedPaymentOption: value, showAmountInput: true })
    } else {
      this.setState({ selectedPaymentOption: value, showAmountInput: false, amountInput: '', amountInputError: false, amountInputMessage: 'Invalid Amount!' })
    }
    this.props.dispatch(setPaymentMethod(value))
  }
  handleAmountChange(e) {
    let amount = e.target.value
    console.log('got amount=', amount);
    if(amountRegex.test(amount)) {

      if(amount <1) {
        console.log('invalid amount');
        this.setState({amountInputError: true, amountInput: amount})
      } else {
        this.setState({amountInputError: false, amountInput: amount})
      }
    } else {
      this.setState({amountInputError: false, amountInputMessage: 'Invalid! only numbers allowed!', amountInput: amount})
    }
  }

  initiateMolPayment( type) {
    console.log('in initiateMolPayment', type);
    this.setState({payLoading: true, molLoading: true})
    let state = this.state
    let {amountInput, currencyCode} = state
    //change amount to API amount.
    amountInput *= 100

    //for live build get channelId and customerId from store.
    //only carrier billing configured for testing.
    let {customerId, channelId} = this.props.paymentData
    console.log('got customerId and channelId for mol from store=', customerId, channelId);
    let referenceId = "TRX" + Date.now()
    var returnUrl = window.location.origin + '/?referenceId=' + referenceId   //this.state.MolReturnUrl + referenceId
    console.log('returnUrl = ', returnUrl);
    let description = "NearGroup Payment"
    let body = {}
    switch (type) {
      case "CARRIER_BILLING":
        console.log('in carrier billing', type);
         body = {
          channelId: channelId,
          chauth: customerId,
          paymentType: type,
          returnUrl: returnUrl,
          referenceId: referenceId,
          description: description
        }
        this.setState({carrierBillingLoading: true})
        break;
      case "OTHER_OPTIONS":
        console.log('in other options');
        body = {
          // val: "1f9978080c8188e9bcc9111b2888d164",
          // ht: "USD 2",
          channelId: channelId,
          chauth: customerId,
          paymentType: type,
          amount: amountInput,
          currencyCode: currencyCode,
          returnUrl: returnUrl,
          referenceId: referenceId,
          description: description
        }
        this.setState({otherOptionsLoading: true})
        break;
      default:

    }

    // referenceId = state.referenceId + state.channelId + Math.floor(Date.now())
    // console.log('referenceId raw=', referenceId);
    // returnUrl = state.returnUrl + '' + referenceId
    // console.log('returnUrl raw=', returnUrl);
    // signature = state.amount  +  state.applicationCode  +  state.currencyCode  +  state.customerId  +  state.description
    // + referenceId  + returnUrl  + state.version  + state.Secret_Key
    // console.log('signature raw=', signature);
    // signature = md5(signature)
    // console.log('signature md5=', signature);
    // this.setState({referenceId, returnUrl, signature}, () => {
    //   console.log('new state set', this.state);
    // })

    console.log('body=', body);
    let that = this
    axios.post(config.paymentRequestApi,
      body,
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        }
      }
    )
    .then((response) => {
      console.log('mol response = ', response);

      if(response.status == 200) {
        let {url} = response.data
        console.log('mol response success url=', url);
        if(url != '' && url != null && url != undefined) {
          window.location = url
        } else {
          console.log('invalid url');
        }
      } else {
        console.log('mol response error');
      }
      // this.setState({payLoading: false, molLoading: false})
    })
    .catch(e => {
      console.log('mol payment request error ', e);
      this.setState({payLoading: false, molLoading: false})
      throw Error(e)
    })

  }

  render() {
    let state = this.state
    let props = this.props
    let imageUrl = window.location.origin + "/images/"
    // let {coinData} = this.props
    console.log("showSummaryOrHistory = ", state, props);
    return (
        <Grid style={{margin: "30px 0px"}}>
            <Grid.Row >
                {
                  this.state.molLoading ?
                  (<Grid.Column width={16} textAlign="center">
                    <Loader style={{marginTop: 50}} active inline='centered' />
                    <h3>Loading payment gateway..</h3>
                   </Grid.Column>)
                  :
                  (<Grid.Column width={16} textAlign="center">
                  <Grid>
                    <Grid.Row >
                      <Grid.Column width={16} textAlign="center" >
                        <h2 style={{color: '#199aab'}}><strong>HOW TO TOP-UP</strong></h2>
                      </Grid.Column>
                    </Grid.Row>
                    {
                      state.topUpPlans.map((item, index) => (
                        <Grid.Row key={index} style={{margin: "0px 30px"}}>
                          <Grid.Column width={12} textAlign="left" verticalAlign="middle">
                            <Grid>
                              <Grid.Row style={{padding: 5}}>
                                <Grid.Column width={16} textAlign="left" >
                                  <h2 style={{color: '#616161'}}>PAY &#x20B1; {item.amount.start}-{item.amount.end}</h2>
                                </Grid.Column>
                              </Grid.Row>
                              <Grid.Row style={{padding: 5}}>
                                <Grid.Column width={16} textAlign="left" >
                                  <p style={{color: '#607d8b'}}>Get {item.coins} coins/peso</p>
                                </Grid.Column>
                              </Grid.Row>
                            </Grid>
                          </Grid.Column>
                          <Grid.Column width={4} textAlign="right" >
                            {/**<Icon name="money" size="huge" color="orange" />**/}
                            <GetIconsDisplay item={index.toString()} imageUrl={imageUrl} />
                          </Grid.Column>
                        </Grid.Row>
                      ))
                    }
                    <Grid.Row >
                      <Grid.Column width={16} textAlign="center">
                        <h2 style={{color: '#00bcd4'}}><strong>SELECT PAYMENT METHOD</strong></h2>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row >
                      <Grid.Column width={16} textAlign="center">
                        {/**<Icon name="money" size="massive" color="orange" />**/}
                        <GetIconsDisplay item={"payment_method"} imageUrl={imageUrl} />
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row >
                      <Grid.Column width={5} textAlign="center"></Grid.Column>
                      <Grid.Column width={6} textAlign="left">
                        {/**<Grid container>
                        <Grid.Row >
                          <Grid.Column width={16} textAlign="center">**/}
                            <Radio
                              label='Mobile Payment'
                              name='radioGroup'
                              value='CARRIER_BILLING'
                              checked={state.selectedPaymentOption === 'CARRIER_BILLING'}
                              onChange={this.handleSelectChange}
                            />
                      </Grid.Column>
                      <Grid.Column width={5} textAlign="center"></Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                      <Grid.Column width={5} textAlign="center"></Grid.Column>
                      <Grid.Column width={6} textAlign="left">
                        <Radio
                          label='zGold-Mol points/Paypal/Credit Card'
                          name='radioGroup'
                          value='OTHER_OPTIONS'
                          checked={state.selectedPaymentOption === 'OTHER_OPTIONS'}
                          onChange={this.handleSelectChange}
                        />
                      </Grid.Column>
                        {/**</Grid.Row>
                        </Grid>
                      </Grid.Column> **/}
                      <Grid.Column width={5} textAlign="center"></Grid.Column>
                    </Grid.Row>
                    {
                      state.showAmountInput &&
                      (<Grid.Row >
                        <Grid.Column width={16} textAlign="center">
                          <TextField
                            floatingLabelText="Enter Amount"
                            errorText={state.amountInputError ? state.amountInputMessage : ""}
                            onChange={this.handleAmountChange}
                          />
                        </Grid.Column>
                      </Grid.Row>)
                    }
                    <Grid.Row >
                      <Grid.Column width={16} textAlign="center" >
                          <Button  size="large" circular disabled={state.selectedPaymentOption==''} loading={state.payLoading}
                            style={{backgroundColor: '#e56f65', color: '#ffffff'}} onClick={e => this.initiateMolPayment(props.paymentData.paymentMethod)}
                          >CONTINUE</Button>
                      </Grid.Column>
                    </Grid.Row >
                    <Grid.Row >
                      <Grid.Column width={16} textAlign="center" >
                          <Link to={'/?channelId=' + props.paymentData.customerId} replace><Button  size="large" circular
                            style={{backgroundColor: '#e56f65', color: '#ffffff'}}
                          >CANCEL</Button></Link>
                      </Grid.Column>
                    </Grid.Row>

                  </Grid>
                </Grid.Column>)}
              </Grid.Row>
        </Grid>
    )
  }

}

function mapStateToProps(state) {
  console.log('in index mapStateToProps ', state );
  return {
    paymentData: state.payment
  }
}


export default withRouter(connect(mapStateToProps)(TopUpPlans));
