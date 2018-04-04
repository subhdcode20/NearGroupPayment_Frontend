import React, {Component} from 'react';
import {Grid} from 'semantic-ui-react';
import _ from 'lodash'
import { withRouter } from 'react-router'

class PaymentSuccess extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  componentWillMount() {
    console.log('will mount location=', this.props)
  }

  render() {
    let state = this.state
    return (
      <div>
        <Grid container>
          <Grid.Row>
            <Grid.Column width={16} textAlign="left">
            Payment Success - reference id
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }

}

export default withRouter(PaymentSuccess);
