/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Button, Form, Input, Card, Skeleton } from "antd";
import { ethers } from "ethers";
import erc20abi from "./erc20ABI.json";
import styles from "./DashBoard.module.scss";
import openNotificationWithIcon from "./errormsg";

const AccountInfo = ({ account }) => {
  const [transferLoading, setTransferLoading] = useState(false);
  const [tokenInfoLoading, setTokenInfoLoading] = useState(false);

  const [tokenBalance, setTokenBalance] = useState("-");
  const [contractInfo, setContractInfo] = useState({
    tokenName: "-",
    tokenSymbol: "-",
    totalSupply: "-",
  });
  const [contractAddress, setContractAddress] = useState("");
  const getTokenInfo = async (values) => {
    setTokenInfoLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const erc20 = new ethers.Contract(values.address, erc20abi, provider);

      const tokenName = await erc20.name();
      const tokenSymbol = await erc20.symbol();
      const totalSupply = await erc20.totalSupply();

      setContractAddress(values.address);
      setContractInfo({
        tokenName,
        tokenSymbol,
        totalSupply,
      });
      getTokenBalance(values.address);
    } catch (err) {
      openNotificationWithIcon("error", err.message);
    }
    setTokenInfoLoading(false);
  };
  const getTokenBalance = async (address) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const erc20 = new ethers.Contract(address, erc20abi, provider);
      const tokenBalance = await erc20.balanceOf(account);
      setTokenBalance(ethers.utils.formatEther(tokenBalance));
    } catch (err) {
      openNotificationWithIcon("error", err.message);
    }
  };

  const handleTransfer = async (values) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const erc20 = new ethers.Contract(contractAddress, erc20abi, signer);
      await erc20
        .transfer(
          values.recipientAddress,
          ethers.utils.parseEther(values.amount)
        )
        .then((res) => setTransferLoading(true));
    } catch (err) {
      openNotificationWithIcon("error", err.message);
    }
  };

  useEffect(() => {
    if (contractAddress && account) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const erc20 = new ethers.Contract(contractAddress, erc20abi, provider);
      erc20.on("Transfer", async (from, to, amount, event) => {
        const tokenBalance = await erc20.balanceOf(account);
        setTokenBalance(ethers.utils.formatEther(tokenBalance));
        setTransferLoading(false);
      });
    }
  }, [contractAddress]);
  return (
    <div className={styles.dashboard}>
      <Card className={styles.dashboard__tokenInfo} title="Token Info">
        <Form name="token-form" className="token-form" onFinish={getTokenInfo}>
          <Form.Item
            label="Contact Address"
            name="address"
            rules={[
              {
                required: true,
                message: "Please input Contract Address!",
              },
            ]}
          >
            <Input placeholder="ERC20 Contact Address" />
          </Form.Item>
          <Button htmlType="submit" loading={tokenInfoLoading}>
            Get token info
          </Button>
        </Form>
        <div className={styles.dashboard__tokenInfo_wrapper}>
          <Card className={styles.dashboard__tokenInfo_card} title="Name">
            {tokenInfoLoading ? (
              <Skeleton.Input size={"small"} active={transferLoading} />
            ) : (
              <span>{contractInfo.tokenName}</span>
            )}
          </Card>
          <Card className={styles.dashboard__tokenInfo_card} title="Symbol">
            {tokenInfoLoading ? (
              <Skeleton.Input size={"small"} active={transferLoading} />
            ) : (
              <span>{contractInfo.tokenSymbol}</span>
            )}
          </Card>
          <Card
            className={styles.dashboard__tokenInfo_card}
            title="Total Supply"
          >
            {tokenInfoLoading ? (
              <Skeleton.Input size={"small"} active={tokenInfoLoading} />
            ) : (
              <span>{contractInfo.totalSupply.toString()}</span>
            )}
          </Card>
          <Card
            className={styles.dashboard__tokenInfo_card}
            title="Token Balance"
          >
            {transferLoading || tokenInfoLoading ? (
              <Skeleton.Input
                size={"small"}
                active={transferLoading || tokenInfoLoading}
              />
            ) : (
              <span>{tokenBalance.toString()}</span>
            )}
          </Card>
        </div>
      </Card>
      <Card className={styles.dashboard__tokenTransfer} title="Transfer Token">
        <Form
          name="token-form"
          className="transfer-token-form"
          onFinish={handleTransfer}
        >
          <Form.Item
            label="Recipient address"
            name="recipientAddress"
            rules={[
              {
                required: true,
                message: "Please input Recipient Address!",
              },
            ]}
          >
            <Input placeholder="Recipient Address" />
          </Form.Item>
          <Form.Item
            label="Amount"
            name="amount"
            rules={[
              {
                required: true,
                message: "Please input Amount!",
              },
            ]}
          >
            <Input placeholder="Amount" />
          </Form.Item>
          <Button htmlType="submit" className="" loading={transferLoading}>
            Transfer
          </Button>
        </Form>
      </Card>
    </div>
  );
};
export default AccountInfo;
