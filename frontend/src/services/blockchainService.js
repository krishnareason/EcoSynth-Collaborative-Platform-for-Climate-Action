// frontend/src/services/blockchainService.js
import { ethers } from 'ethers';

import GovernmentPolicyABI from '../contracts/Sender.json';
import NGOReceiverABI from '../contracts/Receiver.json';

// --- PASTE YOUR DEPLOYED CONTRACT ADDRESSES HERE ---
const governmentPolicyAddress = "0x0deA69a40Ee1A3a24E7dB5a2D8653C75691304E5";
const ngoReceiverAddress = "0x374Ae5993178dAe28070985ac39B21FB515bd596";
// ----------------------------------------------------

let provider;
let signer;
let governmentContract;
let ngoContract;

export const connectWallet = async () => {
    if (window.ethereum) {
        try {
            provider = new ethers.BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            signer = await provider.getSigner();

            governmentContract = new ethers.Contract(governmentPolicyAddress, GovernmentPolicyABI, signer);
            ngoContract = new ethers.Contract(ngoReceiverAddress, NGOReceiverABI, signer);

            console.log("Wallet Connected:", await signer.getAddress());
            return { signer, governmentContract, ngoContract };
        } catch (error) {
            console.error("Error connecting wallet:", error);
            throw new Error("Failed to connect wallet.");
        }
    } else {
        throw new Error("MetaMask not found.");
    }
};

export const getContracts = () => {
    if (!signer) throw new Error("Wallet not connected.");
    return { signer, governmentContract, ngoContract };
};