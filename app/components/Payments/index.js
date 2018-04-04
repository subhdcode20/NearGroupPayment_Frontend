import React, {Component} from 'react';
import {Grid, Segment, Button} from 'semantic-ui-react';
import _ from 'lodash'
import {Redirect} from 'react-router'
import WalletTopUpPlans from './WalletTopUpPlans'

class PaymentsIndex extends Component {
  constructor(props) {
    super(props)

    this.state = {
      user: {
        name: 'Prashant'
      },
      totalCoins: 45,
      accountHistory: [
        {date: '29 Mar', description: 'NG Joining Bonus', coinCount: '25'},
        {date: '29 Mar', description: 'NG Joining Bonus', coinCount: '25'},
        {date: '29 Mar', description: 'NG Joining Bonus', coinCount: '25'},
        {date: '29 Mar', description: 'NG Joining Bonus', coinCount: '25'},
        {date: '29 Mar', description: 'NG Joining Bonus', coinCount: '25'},
        {date: '29 Mar', description: 'NG Joining Bonus', coinCount: '25'},
        {date: '29 Mar', description: 'NG Joining Bonus', coinCount: '25'},
        {date: '29 Mar', description: 'NG Joining Bonus', coinCount: '25'},
        {date: '29 Mar', description: 'NG Joining Bonus', coinCount: '25'},
        {date: '29 Mar', description: 'NG Joining Bonus', coinCount: '25'},
      ],
      howToUseCoins: {
        Gift: 'Give Coins to your chatmate as gifts',
        Reveal: 'Reveal your chatmate\'s identity',
        Reconnect: 'Send reconnect request to chatmate'
      },
      howToEarnCoins: [
        'Joining bonus: 25 coin',
        'Invite Friends to NG: 2 coins (per friend)',
        'Get 4 or 5 Star from chatmate: 1 coin',
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
        'Quick Disconnection: 1 Coin',
        'Get 1 or 2 Star from chatmate: 1 Coin'
      ],
      howToInviteFriends: 'ds f;dsfkds ;flkds ;fkds ;flkds f;lkdsf ;lds dflkdsj fdsf dslkfj dslkfjdsklf sdlkfj dsflkjsdf',
      purchaseRate: [
        {coins: 50, amount: 2},
        {coins: 300, amount: 10},
        {coins: 750, amount: 20},
      ],
      purchaseOption: 'Purchase Option here',
      redirectToPayment: false
    }
    this.handleTopUpPage = this.handleTopUpPage.bind(this)
  }

  handleTopUpPage() {
    this.setState({redirectToPayment: true})
  }

  render() {
    let state = this.state
    return (
      <div>
        <Grid container>
          <Grid.Row>
            <Grid.Column width={16} textAlign="left" style={{marginTop: 50}}>
              <h2>Hi <strong>{state.user.name}</strong>,</h2>
            </Grid.Column>
          </Grid.Row>
          {/** wallet coins **/}
          <Grid.Row>
            <Grid.Column width={16} textAlign="left">
              <i><h5>You have <strong>{state.totalCoins} Coins</strong> in your Wallet</h5></i>
            </Grid.Column>
          </Grid.Row>
          {/** account history **/}
          <Grid.Row>
            <Grid.Column width={12}  textAlign="center">
              <h3><strong>Account History</strong></h3>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={16}  textAlign="center">
              <Grid>
                {
                  !_.isEmpty(state.accountHistory) &&
                    state.accountHistory.map((item, index) =>
                      (
                        <Grid.Row key={index}>
                            <Grid.Column width={4} textAlign="left">
                              <h5>{item.date}</h5>
                            </Grid.Column>
                            <Grid.Column width={8} textAlign="left">
                              <h5>{item.description}</h5>
                            </Grid.Column>
                            <Grid.Column width={4} textAlign="left">
                              <h5>{item.coinCount}</h5>
                            </Grid.Column>
                        </Grid.Row>
                      )
                    )
                }
              </Grid>
            </Grid.Column>
          </Grid.Row>
          {/** how to use coins **/}
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
                        <Grid.Row key={index}>

                          <Grid.Column width={16} textAlign="left">
                            <h5>{_.capitalize(item)}: {state.howToUseCoins[item]}</h5>
                          </Grid.Column>
                          {/**
                            <Grid.Column width={8} textAlign="left">
                            <h3>_.capitalize({item}): {item.description}</h3>
                          </Grid.Column>
                          <Grid.Column width={4} textAlign="left">
                            <h3>_.capitalize({item}): {item.coinCount}</h3>
                          </Grid.Column>
                        **/}

                        </Grid.Row>
                      )
                    )
                }
              </Grid>
            </Grid.Column>
          </Grid.Row>
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
                        <Grid.Row key={index}>

                          <Grid.Column width={16} textAlign="left">
                            <h5>- {_.capitalize(item)}</h5>
                          </Grid.Column>
                          {/**
                            <Grid.Column width={8} textAlign="left">
                            <h3>_.capitalize({item.description})</h3>
                          </Grid.Column>
                          <Grid.Column width={4} textAlign="left">
                            <h3>_.capitalize({item.coinCount})</h3>
                          </Grid.Column>
                        **/}

                        </Grid.Row>
                      )
                    )
              }
              </Grid>
            </Grid.Column>
          </Grid.Row>
          {/** lose coins **/}
          <Grid.Row>
            <Grid.Column width={16}>
              <h3><strong>How to lose Coins?</strong></h3>
            </Grid.Column>
            <Grid.Column width={16}>
              <Grid container style={{marginTop: 5}}>
                {
                  !_.isEmpty(state.howToLoseCoins) &&
                    state.howToLoseCoins.map((item, index) =>
                      (
                        <Grid.Row key={index}>

                          <Grid.Column width={16} textAlign="left">
                            <h5>- {_.capitalize(item)}</h5>
                          </Grid.Column>
                          {/*
                            <Grid.Column width={8} textAlign="left">
                            <h3>_.capitalize({item}): {item.description}</h3>
                          </Grid.Column>
                          <Grid.Column width={4} textAlign="left">
                            <h3>_.capitalize({item}): {item.coinCount}</h3>
                          </Grid.Column>
                        */}

                        </Grid.Row>
                      )
                    )
              }
              </Grid>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={16}>
              <h3><strong>How to Invite Friends</strong>? Share this msg to as many:</h3>
            </Grid.Column>
            <Grid.Column width={16}>
              <p>{state.howToInviteFriends}</p>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={16} textAlign="center">
              <Button content="Topup Plans" size="big" color="orange" onClick={this.handleTopUpPage} />
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



export default PaymentsIndex;