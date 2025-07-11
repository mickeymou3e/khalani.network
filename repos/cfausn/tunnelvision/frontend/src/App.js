import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Header.js'
import Explorer from './components/Explorer.js'
import Block from './components/Block.js'
import Transaction from './components/Transaction.js'
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Explorer />} />
          <Route path="/block">
            <Route path=":id" element={<Block />} />
          </Route>
          <Route path="/tx">
            <Route path=":id" element={<Transaction />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}


export default App;
