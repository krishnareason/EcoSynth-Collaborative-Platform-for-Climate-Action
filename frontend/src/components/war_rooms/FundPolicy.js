// frontend/src/components/war_rooms/FundPolicy.js
import React, { useState } from 'react';
// --- CORRECTED IMPORT ---
import { parseEther } from 'ethers';
import { getContracts } from '../../services/blockchainService';

export default function FundPolicy() {
    const [fundAmount, setFundAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFund = async (e) => {
        e.preventDefault();
        if (!fundAmount) {
            alert("Please enter an amount to fund.");
            return;
        }
        setLoading(true);
        try {
            const { governmentContract } = getContracts();
            // --- CORRECTED FUNCTION CALL ---
            const amountInWei = parseEther(fundAmount);

            console.log(`Funding policy contract with ${fundAmount} ETH...`);
            const fundTx = await governmentContract.fundPolicy({ value: amountInWei });
            await fundTx.wait();

            alert(`Policy contract funded successfully with ${fundAmount} ETH!`);
            setFundAmount('');
        } catch (error) {
            console.error("Funding failed:", error);
            alert("Funding failed. Check the console for details.");
        }
        setLoading(false);
    };

    return (
        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
            <h4>Step 1: Fund the Policy Contract</h4>
            <p>Send funds to the main policy contract to create a treasury.</p>
            <form onSubmit={handleFund}>
                <div>
                    <label>Amount to Fund (ETH):</label>
                    <input
                        type="text"
                        value={fundAmount}
                        onChange={(e) => setFundAmount(e.target.value)}
                        placeholder="e.g., 10"
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Processing...' : 'Fund Policy Contract'}
                </button>
            </form>
        </div>
    );
}