import {createRoot} from 'react-dom/client'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom";
import {AuthProvider} from "./components/auth-context/AuthProvider.jsx";
import { configure } from '@gravity-ui/markdown-editor'; // Импортируем функцию для конфигурации
import {ThemeProvider} from '@gravity-ui/uikit';
import '@diplodoc/transform/dist/js/yfm';
import './index.css'
// Устанавливаем язык для редактора (например, русский)
configure({
    lang: 'ru',
});
createRoot(document.getElementById('root')).render(
    <ThemeProvider theme="light">
    <AuthProvider>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </AuthProvider>
    </ThemeProvider>,
)
