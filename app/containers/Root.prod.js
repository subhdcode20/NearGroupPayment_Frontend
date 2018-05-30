import PropTypes from 'prop-types';
import React from 'react';
import { Provider } from 'react-redux';
import { Route, HashRouter, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';

import App from '../components/App';
// import MolPay from '../components/Payments/molPay'
// import PaymentSuccess from '../components/Payments/PaymentSuccess'
// import MolPaymentResult from '../components/Payments/PaymentResult'
import CoinsSummary from '../components/Payments/coinSummary'
import HowToUseCoins from '../components/Payments/howToUseCoins'
import TopUpPlans from '../components/Payments/topUpPlans'
import Routes from '../routes'

export default function Root({store, history}) {
    return (
        <Provider store={store}>
            <div>
              <ConnectedRouter history={history}>
                <Switch>
                  <Route exact path="/" component={App}/>

                  <Route exact path="/how_to_use_coins" component={HowToUseCoins} />
                  <Route exact path="/top_up_plans" component={TopUpPlans} />
                </Switch>
              </ConnectedRouter>
            </div>
        </Provider>
    );
}

Root.propTypes = {
    store: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
};
