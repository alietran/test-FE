import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login/Login";
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";
import { createBrowserHistory } from "history";
import UserList from "./Pages/UserList/UserList";
import Guard from "./Pages/Guard/Guard";

export const history = createBrowserHistory({ window });

function App() {
  const [count, setCount] = useState(0);
 


  return (
    <div className="App">
      <HistoryRouter history={history}>
        <Routes>
          <Route path="login" element={<Login />}></Route>

          <Route path="/" element={<Guard />}>
            <Route index path="/" element={<UserList />}></Route>
          </Route>
        </Routes>
      </HistoryRouter>
    </div>
  );
}

export default App;
