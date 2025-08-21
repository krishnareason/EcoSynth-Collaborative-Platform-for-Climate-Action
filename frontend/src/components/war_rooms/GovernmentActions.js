// frontend/src/components/war_rooms/GovernmentActions.js
import React, { useState } from 'react';
// --- CORRECTED IMPORT ---
import { parseEther } from 'ethers';
import { getContracts } from '../../services/blockchainService';

export default function GovernmentActions() {
    const [ngoAddress, setNgoAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAllocate = async (e) => {
        e.preventDefault();
        if (!ngoAddress || !amount) {
            alert("Please provide the NGO's address and the amount to allocate.");
            return;
        }
        setLoading(true);
        try {
            const { governmentContract } = getContracts();
            // --- CORRECTED FUNCTION CALL ---
            const amountInWei = parseEther(amount); // Convert ETH to Wei

            console.log(`Allocating ${amount} ETH to ${ngoAddress}...`);
            const allocateTx = await governmentContract.allocateToNGO(ngoAddress, amountInWei);
            await allocateTx.wait();

            alert(`Successfully allocated ${amount} ETH to ${ngoAddress}!`);
            setNgoAddress('');
            setAmount('');
        } catch (error) {
            console.error("Allocation failed:", error);
            alert("Allocation failed. Ensure the policy contract has sufficient funds.");
        }
        setLoading(false);
    };

    return (
        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', marginTop: '20px' }}>
            <h4>Step 2: Allocate Funds to an NGO</h4>
            <p>Earmark funds from the policy's treasury for a specific NGO to claim.</p>
            <form onSubmit={handleAllocate}>
                <div>
                    <label>NGO Wallet Address:</label>
                    <input
                        type="text"
                        value={ngoAddress}
                        onChange={(e) => setNgoAddress(e.target.value)}
                        placeholder="0x..."
                        required
                    />
                </div>
                <div>
                    <label>Amount to Allocate (ETH):</label>
                    <input
                        type="text"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="e.g., 1.5"
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Processing...' : 'Allocate Funds'}
                </button>
            </form>
        </div>
    );
}