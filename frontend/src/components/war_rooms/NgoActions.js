// frontend/src/components/war_rooms/NgoActions.js
import React, { useState } from 'react';
import { getContracts } from '../../services/blockchainService';

export default function NgoActions() {
    const [loading, setLoading] = useState(false);

    const handleDisburse = async () => {
        setLoading(true);
        try {
            const { governmentContract } = getContracts();
            const tx = await governmentContract.disburseFunds();
            await tx.wait();
            alert("Funds disbursed successfully to your wallet!");
        } catch (error) {
            console.error("Failed to disburse funds:", error);
            alert("Failed to disburse funds. You may have no funds allocated.");
        }
        setLoading(false);
    };

    return (
        <div>
            <h4>NGO Actions</h4>
            <p>Click the button below to claim your allocated funds.</p>
            <button onClick={handleDisburse} disabled={loading}>
                {loading ? 'Processing...' : 'Claim Allocated Funds'}
            </button>
        </div>
    );
}