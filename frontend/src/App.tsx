import './App.css';
import './Header.css';
import './Footer.css';
import { Header } from './components/layout/Header';
import { ScreenSelectorPage } from './components/panels/ScreenSelectorPage';

export function App() {
  return (
    <div className="sd-page">
      <Header />
      <div className="divider"></div>
      <ScreenSelectorPage />
    </div>
  );
}

export default App;
