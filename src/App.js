import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Main from "./pages/main";
import DetailPokemon from "./pages/detailPokemon";

function App() {
  return (
    <div className="App">
        <Router>
            <Switch>
                <Route exact path="/">
                    <Main />
                </Route>
                <Route path="/detailPokemon">
                    <DetailPokemon />
                </Route>
            </Switch>
        </Router>
    </div>
  );
}

export default App;
