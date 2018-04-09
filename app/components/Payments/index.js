import React, {Component} from 'react';
import {Grid, Segment, Button, Loader, Message} from 'semantic-ui-react';
import _ from 'lodash'
import moment from 'moment'
import axios from 'axios'
import querystring from 'query-string'
import { withRouter } from 'react-router'
import {Redirect} from 'react-router'
import WalletTopUpPlans from './WalletTopUpPlans'
import {connect} from 'react-redux'
import {setCustomerId, setChannelId} from '../../actions/payment'
import config from '../../config/index'
import RaisedButton from 'material-ui/RaisedButton';

var segmentStyle={
  paddingBottom: 20,
  width: '100%'
}

var pageBodyStyle = {
  maxWidth: 500,
  margin: 'auto'
}

class PaymentsIndex extends Component {
  constructor(props) {
    super(props)

    this.state = {
      getCoinsDetailsLocalUrl: config.getUserCoinsDetails,  //"http://localhost:4040/mol/usercoinsdetails?customerId=",
      user: {
        name: ''
      },
      totalCoins: 25,
      accountHistory: [],
      howToUseCoins: {
        Gift: 'Give Coins to your chatmate as gifts',
        Reveal: 'Reveal your chatmate\'s identity',
        Reconnect: 'Send reconnect request to chatmate'
      },
      howToEarnCoins: [
        'Joining bonus: 25 coin',
        'Invite Friends to NG: 2 coins (per friend)',
        'Get 4 or 5 Star from chatmate: 1 coin',
        'Quick Disconnection: 1 Coin',
        '1st 2-day consecutive usage: 5 coins',
        '1st 4-day consecutive usage: 10 coins',
        '1st longer chat: 5 coin',
        '5th longer chat: 10 coins',
        '10th longer chat: 25 coins',
        '20th longer chat: 50 coins',
        '50th longer chat: 100 coins',
        '100th longer chat: 250 coins'
      ],
      howToLoseCoins: [
        // 'Quick Disconnection: 1 Coin',
        // 'Get 1 or 2 Star from chatmate: 1 Coin'
      ],
      howToInviteFriends: " m.me/neargroup?ref=R_",
      purchaseRate: [
        {coins: 50, amount: 2},
        {coins: 300, amount: 10},
        {coins: 750, amount: 20},
      ],
      purchaseOption: 'Purchase Option here',
      redirectToPayment: false,
      showShareLink: false,
      loadingCoinHistory: true,
      showCoinDetails: true
    }
    this.handleTopUpPage = this.handleTopUpPage.bind(this)
  }

  handleTopUpPage() {
    this.setState({redirectToPayment: true})
  }

  componentWillMount() {
    let queryParams = querystring.parse(this.props.location.search)
    console.log('queryParams in  will mount = ', queryParams, this.props);
    let channelId = queryParams.channelId
    let {getCoinsDetailsLocalUrl} = this.state
    let that = this
    // let getCoinsDetailsUrl =  "https://06489a03.ngrok.io/NG/getCoinHistory?channelId=" + channelId   //d65ac649d9f54ed1853c1bd3ddd0e693
    getCoinsDetailsLocalUrl += channelId
    this.props.dispatch(setCustomerId(channelId))
    console.log('getCoinsDetailsLocalUrl= ', getCoinsDetailsLocalUrl);

    axios.get(getCoinsDetailsLocalUrl)
    .then((response) => {
      console.log('mol get coin details response = ', response);

      if(response.data['Grant Access']) {
        console.log('mol response success');
        let {user} = that.state
        user.name = response.data.userName
        that.setState({
          accountHistory: response.data.coinsDetails,
          totalCoins: response.data.totalCoins,
          howToInviteFriends: that.state.howToInviteFriends + response.data.inviteCode,
          showShareLink: true,
          loadingCoinHistory: false,
          showCoinDetails: true,
          user: user
        }, () => {
          console.log('result state set', this.state);
        })
        // this.props.dispacth(setCustomerId(channelId))
        this.props.dispatch(setChannelId(response.data.channelId))
      } else {
        console.log('mol payment result response error');
        that.setState({loadingCoinHistory: false, showCoinDetails: false})
      }
    })
    .catch(e => {
      console.log('mol get coins details error ', e);
      that.setState({loadingCoinHistory: false, showCoinDetails: false})
    })
  }

  render() {
    console.log('index render props', this.props);
    let state = this.state
    return (
      <div style={pageBodyStyle}>
        <Grid container>
          {
            state.loadingCoinHistory
            ?
            (<Loader style={{marginTop: 50}} active inline='centered' /> )
            :

              state.showCoinDetails ?
              (<Grid.Row >
                <Grid.Column width={16} textAlign="left" style={{marginTop: 50}}>
                <Grid>
                <Segment style={segmentStyle}>
                <Grid.Row>
                <Grid.Column width={16} textAlign="left">
                  <h2>Hi <strong>{state.user.name}</strong>,</h2>
                </Grid.Column>
              </Grid.Row>
              {/** wallet coins **/}
              <Grid.Row>
                <Grid.Column width={16} textAlign="left">
                  <i><h5>You have <strong>{state.totalCoins} Coins</strong> in your Wallet</h5></i>
                </Grid.Column>
              </Grid.Row>
              </Segment>
              {/** account history **/}
              {
                  !_.isEmpty(state.accountHistory) &&
                (<Segment style={segmentStyle}>
              <Grid.Row>
                <Grid.Column width={12}  textAlign="center" style={{marginBottom: 10}}>
                  <h3><strong>Account History</strong></h3>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={16}  textAlign="center">
                  <Grid>
                      <Grid.Row key={index} style={{padding: 5}}>
                          <Grid.Column width={4} textAlign="left">
                            <h5>{moment(item.time).format("D/M/Y")}</h5>
                          </Grid.Column>
                          <Grid.Column width={7} textAlign="left">
                            <h5>{item.description}</h5>
                          </Grid.Column>
                          <Grid.Column width={5} textAlign="left">
                            <h5>{item.coinsStatus.toString() == '0' && <span>-</span> }{item.coinsStatus.toString() == '1' && <span>+</span> }{item.coins} coins</h5>
                          </Grid.Column>
                      </Grid.Row>
                  </Grid>
                </Grid.Column>
              </Grid.Row>
              </Segment>)

            }

              </Grid>
              </Grid.Column>
            </Grid.Row>)
            :
            (<Message style={{marginTop: 50, width:"100%"}}>
              <p>
                There seems to a problem. Your coins details could not be fetched.
              </p>
            </Message>)
        }
          {/** how to use coins **/}
          <Segment style={segmentStyle}>
          <Grid.Row>
            <Grid.Column width={16}>
              <h3><strong>How to use Coins?</strong></h3>
            </Grid.Column>
            <Grid.Column width={16}>
              <Grid container style={{marginTop: 5}}>
                {
                  !_.isEmpty(state.howToUseCoins) &&
                    Object.keys(state.howToUseCoins).map((item, index) =>
                      (
                        <Grid.Row key={index} style={{padding: 2}}>

                          <Grid.Column width={16} textAlign="left" style={{marginTop: index == (state.howToUseCoins.length-1) ? 10 : 0 }}>
                            <h5>{_.capitalize(item)}: {state.howToUseCoins[item]}</h5>
                          </Grid.Column>

                        </Grid.Row>
                      )
                    )
                }
              </Grid>
            </Grid.Column>
          </Grid.Row>
          </Segment>
          <Segment style={segmentStyle}>
          <Grid.Row>
            <Grid.Column width={16}>
              <h3><strong>How to earn Coins?</strong></h3>
            </Grid.Column>
            <Grid.Column width={16}>
              <Grid container style={{marginTop: 5}}>
                {
                  !_.isEmpty(state.howToEarnCoins) &&
                    state.howToEarnCoins.map((item, index) =>
                      (
                        <Grid.Row key={index} style={{padding: 2}}>

                          <Grid.Column width={16} textAlign="left">
                            <h5>- {_.capitalize(item)}</h5>
                          </Grid.Column>

                        </Grid.Row>
                      )
                    )
              }
              </Grid>
            </Grid.Column>
          </Grid.Row>
          </Segment>
          {/** lose coins **/}
          {
            !_.isEmpty(state.howToLoseCoins) &&
          (<Segment style={segmentStyle}>
          <Grid.Row>
            <Grid.Column width={16}>
              <h3><strong>How to lose Coins?</strong></h3>
            </Grid.Column>
            <Grid.Column width={16}>
              <Grid container style={{marginTop: 5}}>
                {
                    state.howToLoseCoins.map((item, index) =>
                      (
                        <Grid.Row key={index} style={{padding: 2}}>

                          <Grid.Column width={16} textAlign="left">
                            <h5>- {_.capitalize(item)}</h5>
                          </Grid.Column>

                        </Grid.Row>
                      )
                    )
              }
              </Grid>
            </Grid.Column>
          </Grid.Row>
          </Segment>)
        }
          {
            state.showShareLink &&
              (<Grid.Row>
              <Grid.Column width={16}>
                <h3><strong>How to Invite Friends</strong>? Share this msg to as many:</h3>
              </Grid.Column>
              <Grid.Column width={16}>
                <p>{state.howToInviteFriends}</p>
              </Grid.Column>
            </Grid.Row>)
          }
          <Grid.Row>
            <Grid.Column width={16} textAlign="center">
              {/**<Button content="Topup Plans" size="big" color="orange" onClick={this.handleTopUpPage} />**/}
              <RaisedButton label="Topup Plans" primary={true} onClick={this.handleTopUpPage} />
            </Grid.Column>
            {/**
              <Grid.Column width={16} textAlign="center">
                <Button content="Topup via other options" size="big" color="orange" onClick={this.handleOtherOptions} />
              </Grid.Column>
            **/}
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={16}>
              {state.redirectToPayment && <Redirect to="/payment" />}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }

}

function mapStateToProps(state) {
  console.log('in index mapStateToProps ', state );
  return {
    paymentData: state.payment
  }
}

export default withRouter(connect(mapStateToProps)(PaymentsIndex));
