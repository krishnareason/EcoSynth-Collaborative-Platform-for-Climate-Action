// frontend/src/pages/DashboardPage.js
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { connectWallet } from '../services/blockchainService';

// Import all role-specific components
import GovernmentActions from '../components/war_rooms/GovernmentActions';
import FundPolicy from '../components/war_rooms/FundPolicy'; // <-- Import the new component
import NgoActions from '../components/war_rooms/NgoActions';

export default function DashboardPage() {
    const { currentUserRole } = useAuth();
    const [walletConnected, setWalletConnected] = useState(false);
    const [account, setAccount] = useState('');

    const handleConnectWallet = async () => {
        try {
            const { signer } = await connectWallet();
            const userAddress = await signer.getAddress();
            setAccount(userAddress);
            setWalletConnected(true);
        } catch (error) {
            alert(error.message);
        }
    };

    const renderRoleSpecificComponent = () => {
        switch (currentUserRole) {
            case 'gov':
                // Show both funding and allocation components for the government
                return (
                    <div>
                        <FundPolicy />
                        <GovernmentActions />
                    </div>
                );
            case 'ngo':
                return <NgoActions />;
            default:
                return <p>Your role does not have any blockchain actions.</p>;
        }
    };

    return (
        <div>
            <h2>Dashboard</h2>
            <p>Welcome! Your role is: <strong>{currentUserRole}</strong></p>

            <hr style={{ margin: "20px 0" }} />

            <h3>Blockchain Interaction</h3>
            {!walletConnected ? (
                <button onClick={handleConnectWallet}>Connect Wallet</button>
            ) : (
                <div>
                    <p><strong>Connected Account:</strong> {account}</p>
                    {renderRoleSpecificComponent()}
                </div>
            )}
        </div>
    );
}