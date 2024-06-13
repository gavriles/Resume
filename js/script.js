// script.js

// Define the contract address and ABI
const contractAddress = '0xcb868742037649d8Caf18427307bC073E529EBE9'; // Replace with your contract address
const contractABI = [
    // Paste your contract ABI here
];

let web3;
let contract;
let accounts;

window.addEventListener('load', async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            contract = new web3.eth.Contract(contractABI, contractAddress);
            document.getElementById('connectButton').innerText = 'Wallet Connected';
            document.getElementById('mintSection').style.display = 'block';
            document.getElementById('transferSection').style.display = 'block';
        } catch (error) {
            console.error("User denied account access");
        }
    } else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
});

document.getElementById('mintButton').addEventListener('click', async () => {
    try {
        const tx = await contract.methods.mint().send({ from: accounts[0] });
        const tokenId = tx.events.Transfer.returnValues.tokenId;
        const tokenURI = await contract.methods.tokenURI(tokenId).call();
        const imageUrl = `${tokenURI}.png`;
        document.getElementById('feedback').innerHTML = `NFT minted successfully! <a href="${imageUrl}" target="_blank">View NFT</a>`;
    } catch (error) {
        console.error(error);
        document.getElementById('feedback').innerText = 'Error minting NFT';
    }
});

document.getElementById('transferButton').addEventListener('click', async () => {
    const recipient = document.getElementById('recipient').value;
    const tokenId = document.getElementById('tokenId').value;
    try {
        await contract.methods.transfer(recipient, tokenId).send({ from: accounts[0] });
        document.getElementById('feedback').innerText = 'NFT transferred successfully!';
    } catch (error) {
        console.error(error);
        document.getElementById('feedback').innerText = 'Error transferring NFT';
    }
});
