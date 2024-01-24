import { ethers } from "./ethers-6.7.0.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const withdrawButton = document.getElementById("withdrawButton");

connectButton.onclick = connect;
fundButton.onclick = fund;
withdrawButton.onclick = withdraw;
balanceButton.onclick = getBalance;

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      connectButton.innerHTML = "Connected!";
    } catch (error) {
      console.log(error);
      connectButton.innerHTML = "Error";
    }
  } else {
    connectButton.innerHTML = "Not Connected!";
  }
}

async function fund() {
  const ethAmount = document.getElementById("fund").value;
  if (typeof window.ethereum.request({ method: "eth_requestAccounts" })) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    // console.log(signer);
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const txnResponse = await contract.fund({
        value: ethers.parseEther(ethAmount),
      });

      await waitForTxnConfirmation(txnResponse, provider);
      console.log("Account Funded!");
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("Funding failed as no metamask available");
  }
}

function waitForTxnConfirmation(txnResponse, provider) {
  return new Promise((resolve, reject) => {
    provider.once(txnResponse.hash, async (txnReceipt) => {
      await txnResponse.wait(1);
      console.log(
        `Txn complete with ${await txnReceipt.confirmations()} confirmations`
      );
      resolve();
    });
  });
}

async function withdraw() {
  if (typeof window.ethereum.request({ method: "eth_requestAccounts" })) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const txnResponse = await contract.withdraw();
      await waitForTxnConfirmation(txnResponse, provider);
      console.log("txn withdrawn");
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("Withdraw failed as no metamask available");
  }
}

async function getBalance() {
  if (typeof window.ethereum.request({ method: "eth_requestAccounts" })) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const balance = await provider.getBalance(contractAddress);
    console.log(ethers.formatEther(balance));
  } else {
    console.log("Balance unavilable failed as no metamask available");
  }
}
