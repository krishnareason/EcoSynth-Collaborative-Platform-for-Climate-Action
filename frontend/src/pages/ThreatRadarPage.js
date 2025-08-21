import React from 'react';
import ThreatRadar from '../components/war_rooms/ThreatRadar';

export default function ThreatRadarPage() {
    const containerStyle = { padding: '20px' };

    return (
        <div style={containerStyle}>
            <ThreatRadar />
        </div>
    );
}