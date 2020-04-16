import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.jsx';
import * as serviceWorker from './serviceWorker';
import GoogleFontLoader from 'react-google-font-loader'

ReactDOM.render(
    <>
        <GoogleFontLoader
            fonts={[
                {
                    font: 'Bebas Neue',
                    weights: [400]
                }
            ]} />
        <App />
    </>
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
