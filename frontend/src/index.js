import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { theme } from './assets/styles/themes'
import { ThemeProvider } from '@material-ui/core/styles'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ThemeProvider theme={theme}>
    <App />
    </ThemeProvider>
);

