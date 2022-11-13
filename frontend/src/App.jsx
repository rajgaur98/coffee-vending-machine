/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import contractAddress from "./contracts/contract-address.json";
import CMArtifact from "./contracts/CM.json";
import { ethers } from "ethers";

function App() {
  const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

  const [cm, setCm] = useState(undefined);
  const [selectedAddress, setSelectedAddress] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [txBeingSent, setTxBeingSent] = useState(undefined);
  const [transactionError, setTransactionError] = useState(undefined);
  const [networkError, setNetworkError] = useState(undefined);
  const [tokensToBuy, setTokensToBuy] = useState("");
  const [coffeeToBuy, setCoffeeToBuy] = useState("");
  const [giftAddress, setGiftAddress] = useState("");
  const [giftTokens, setGiftTokens] = useState("");

  const connectWallet = async () => {
    setNetworkError(undefined);
    setTransactionError(undefined);
    const [selectedAddress] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setSelectedAddress(selectedAddress);

    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const cm = new ethers.Contract(
      contractAddress.CM,
      CMArtifact.abi,
      provider.getSigner(0)
    );
    setCm(cm);
  };

  const fetchTokenBalance = async () => {
    const balance = await cm.getTokenBalance();
    setBalance(balance);
  };

  const buyTokens = async () => {
    try {
      setNetworkError(undefined);
      setTransactionError(undefined);
      const tx = await cm.mintTokens({
        value: ethers.utils.parseEther((0.0005 * tokensToBuy).toString()),
      });
      setTxBeingSent(tx.hash);

      const receipt = await tx.wait();

      if (receipt.status === 0) {
        throw new Error("Transaction failed");
      }

      fetchTokenBalance();
    } catch (err) {
      if (err.code !== ERROR_CODE_TX_REJECTED_BY_USER) {
        console.error(err);
        setTransactionError(err);
      }
    } finally {
      setTxBeingSent(undefined);
    }
  };

  const buyCoffee = async () => {
    try {
      setNetworkError(undefined);
      setTransactionError(undefined);
      const tx = await cm.purchaseCoffee(coffeeToBuy);
      setTxBeingSent(tx.hash);

      const receipt = await tx.wait();

      if (receipt.status === 0) {
        throw new Error("Transaction failed");
      }

      fetchTokenBalance();
    } catch (err) {
      if (err.code !== ERROR_CODE_TX_REJECTED_BY_USER) {
        console.error(err);
        setTransactionError(err);
      }
    } finally {
      setTxBeingSent(undefined);
    }
  };

  const transferTokens = async () => {
    try {
      setNetworkError(undefined);
      setTransactionError(undefined);
      console.log(giftAddress, giftTokens);
      const tx = await cm.transferTokens(giftAddress, giftTokens);

      const receipt = await tx.wait();

      if (receipt.status === 0) {
        throw new Error("Transaction failed");
      }

      fetchTokenBalance();
    } catch (err) {
      if (err.code !== ERROR_CODE_TX_REJECTED_BY_USER) {
        console.error(err);
        setTransactionError(err);
      }
    } finally {
      setTxBeingSent(undefined);
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  useEffect(() => {
    if (cm) {
      fetchTokenBalance();
    }
  }, [cm]);

  window.ethereum.on("accountsChanged", (accounts) => {
    if (accounts[0] && accounts[0] !== selectedAddress) {
      connectWallet();
    }
  });

  if (window.ethereum === undefined) {
    return <div>No wallet detected</div>;
  }

  return (
    <main className="main-container">
      <h1>Buy Coffee With ETH!</h1>
      <h3>Connect your Metamask Wallet and start buying coffee!</h3>
      <section className="balance-info">
        <h3>Balance Info</h3>
        <p className="address">
          <span>Account Address:</span> <code>{selectedAddress}</code>
        </p>
        <p className="balance">
          <span>Token Balance:</span> <code>{balance?.toString()}</code> Tokens
        </p>
      </section>
      <section className="buy-tokens">
        <h3>Buy Tokens</h3>
        <div>
          <input
            min={1}
            max={1000}
            type="number"
            id="no-of-tokens"
            value={tokensToBuy}
            onChange={(e) => setTokensToBuy(e.target.value)}
            placeholder="# of tokens"
          />
          <button onClick={() => buyTokens()} disabled={!Number(tokensToBuy)}>
            Checkout 🚀
          </button>
        </div>
        <p className="subtext">
          Note: 1 Token costs <code>0.0005 ETH</code>
        </p>
      </section>
      <section className="buy-coffee">
        <h3>Buy Coffee</h3>
        <div>
          <input
            min={1}
            max={1000}
            type="number"
            id="no-of-coffee"
            value={coffeeToBuy}
            onChange={(e) => setCoffeeToBuy(e.target.value)}
            placeholder="# of coffee"
          />
          <button onClick={() => buyCoffee()} disabled={!Number(coffeeToBuy)}>
            Buy 🍵
          </button>
        </div>
        <p className="subtext">
          Note: A cup of coffee costs <code>1 Token</code>
        </p>
      </section>
      <section className="gift-tokens">
        <h3>Gift Tokens</h3>
        <div>
          <input
            type="text"
            id="gift-address"
            placeholder="Recipient Address"
            value={giftAddress}
            onChange={(e) => setGiftAddress(e.target.value)}
          />
          <input
            min={1}
            max={1000}
            type="number"
            id="no-of-gift-tokens"
            value={giftTokens}
            onChange={(e) => setGiftTokens(e.target.value)}
            placeholder="# of tokens"
          />
          <button
            onClick={() => transferTokens()}
            disabled={!giftAddress || !Number(giftTokens)}
          >
            Send 🎁
          </button>
        </div>
        <p className="subtext">Send Tokens as gifts from your balance!</p>
      </section>
      {(txBeingSent || networkError || transactionError) && (
        <section className="transaction-status">
          <p>{txBeingSent}</p>
          <p>{networkError?.toString()}</p>
          <p>{transactionError?.toString()}</p>
        </section>
      )}
    </main>
  );
}

export default App;
