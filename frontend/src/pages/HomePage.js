import React from 'react';

export default function HomePage() {
  const containerStyle = {
    padding: '50px 20px',
    textAlign: 'center'
  };

  return (
    <div style={containerStyle}>
      <h1>Welcome to Symbiosis </h1>
      <p style={{ fontSize: '1.2rem', color: '#555' }}>
        The collaborative platform for climate action. Join us to make a difference.
      </p>
    </div>
  );
}