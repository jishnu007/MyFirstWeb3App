import Login from "./Login";
import "./App.css";
import "antd/dist/antd.min.css";
import DashBoard from "./DashBoard";
import { useState } from "react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [defaultAccount, setDefaultAccount] = useState(null);
  if (!isLoggedIn)
    return (
      <Login
        setIsLoggedIn={setIsLoggedIn}
        setDefaultAccount={setDefaultAccount}
      />
    );
  return <DashBoard account={defaultAccount} />;
}

export default App;
