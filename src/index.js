import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import reportWebVitals from './reportWebVitals';
import ThemeProvider from './app/layout/home_theme_provider';
import AuthConfig from './app/main/auth/auth.config';
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import "app/i18n/i18n.config";

dayjs.extend(weekday);
dayjs.extend(localeData);

const root = ReactDOM.createRoot(document.getElementById('root'));
if (AuthConfig.guestPath.indexOf(window.location.pathname) === -1) {
    root.render(
        // <React.StrictMode> // Tắt khi ở dev
            <ThemeProvider>
                <App path={window.location.pathname} />
            </ThemeProvider>
        // </React.StrictMode>
    )
} else {
    root.render(
        <App path={window.location.pathname} />
    )
}

reportWebVitals();
