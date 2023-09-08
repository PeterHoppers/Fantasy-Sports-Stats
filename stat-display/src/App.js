import logo from './logo.svg';
import './App.css';
import {getLeagueInfo} from './api/main';

function App() {
  const info = getLeagueInfo();
  console.log("Info", info);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
        </p>
        
      </header>
    </div>
  );
}

export default App;
