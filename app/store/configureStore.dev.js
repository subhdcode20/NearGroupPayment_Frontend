import createHistory from 'history/createBrowserHistory';
import { applyMiddleware, createStore, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import rootReducer from '../reducers';
// import DevTools from '../containers/DevTools';

export const history = createHistory();
const middleware = routerMiddleware(history);

export function configureStore(initialState) {
    return createStore(
        rootReducer,
        initialState,
        applyMiddleware(middleware),

    );
}

// compose(
//     applyMiddleware(middleware),
//     DevTools.instrument()
// )
