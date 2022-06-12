import React from "react";
import styles from "./Login.module.scss";
import { Button } from "antd";
import openNotificationWithIcon from "./errormsg";

const Login = ({ setIsLoggedIn, setDefaultAccount }) => {
  const connectWalletHandler = async () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setIsLoggedIn(true);
        accountChangedHandler(accounts[0]);
      } catch (error) {
        setIsLoggedIn(false);
        openNotificationWithIcon(error.message);
      }
    } else {
      openNotificationWithIcon(
        "info",
        "Please install MetaMask browser extension to interact"
      );
    }
  };

  const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount);
  };

  const chainChangedHandler = () => {
    window.location.reload();
  };

  if (window.ethereum) {
    window.ethereum.on("accountsChanged", accountChangedHandler);
    window.ethereum.on("chainChanged", chainChangedHandler);
  }

  return (
    <div className={styles.login}>
      <h4> Please login with your MetaMask Wallet </h4>
      <Button
        type="primary"
        onClick={connectWalletHandler}
        className={styles.loginBtn}
      >
        Login
      </Button>
    </div>
  );
};

export default Login;
