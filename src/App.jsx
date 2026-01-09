import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import { SettingsProvider } from './contexts/SettingsContext';
import DataCapture from './pages/DataCapture';
import Records from './pages/Records';
import Home from './pages/Home';
import Layout from './components/Layout';

function App() {
    return (
        <ToastProvider>
            <SettingsProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<Layout />}>
                            <Route index element={<Home />} />
                            <Route path="data-capture" element={<DataCapture />} />
                            <Route path="records" element={<Records />} />
                        </Route>
                    </Routes>
                </Router>
            </SettingsProvider>
        </ToastProvider>
    );
}

export default App;
