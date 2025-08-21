import React from 'react';

const styles = {
  container: { padding: '20px', border: '1px solid #eee', marginTop: '20px', borderRadius: '5px' },
  claimCard: { borderBottom: '1px solid #ddd', padding: '10px 0' },
  link: { color: '#007bff', textDecoration: 'none' }
};

export default function MyClaimsList({ claims, loading }) {
  if (loading) {
    return <div style={styles.container}><p>Loading claims...</p></div>;
  }

  return (
    <div style={styles.container}>
      <h3>My Submitted Claims</h3>
      {claims.length > 0 ? (
        claims.map(claim => (
          <div key={claim.id} style={styles.claimCard}>
            <p>"{claim.claimText}"</p>
            <a href={claim.sourcePaperURL} target="_blank" rel="noopener noreferrer" style={styles.link}>
              View Submitted PDF
            </a>
          </div>
        ))
      ) : (
        <p>You have not submitted any claims yet.</p>
      )}
    </div>
  );
}
