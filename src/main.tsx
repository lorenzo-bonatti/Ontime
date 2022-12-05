import React from 'react';
import ReactDOM from 'react-dom/client';
import {Amplify,} from 'aws-amplify';
import {Provider} from 'react-redux';
import {store} from './store';
import {HashRouter} from 'react-router-dom';
import {Authenticator} from '@aws-amplify/ui-react';
import {App} from './App';

import './index.scss';
import '@aws-amplify/ui-react/styles.css';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import awsExports from './aws-exports';
Amplify.configure({
    ...awsExports
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <Provider store={store}>
        <HashRouter>
            <Authenticator.Provider>
                <App/>
            </Authenticator.Provider>
        </HashRouter>
    </Provider>
);
