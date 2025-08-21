import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function ClaimChallengeList() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClaims = async () => {
      const q = query(collection(db, "claims"), where("status", "==", "available"));
      const snapshot = await getDocs(q);
      setClaims(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };
    fetchClaims();
  }, []);

  if (loading) return <p>Loading challenges...</p>;

  return (
    <div style={{ marginTop: '20px' }}>
      <h3>Science Communicator Challenges</h3>
      {claims.length > 0 ? claims.map(claim => (
        <div key={claim.id} style={{ border: '1px solid #ccc', padding: '15px', margin: '10px 0' }}>
          <p>"{claim.claimText}"</p>
          <small>From a paper by: {claim.creatorName}</small><br/>
          <button style={{ marginTop: '10px' }}>Create Reel for this Claim</button>
        </div>
      )) : <p>No new claims available. Check back soon!</p>}
    </div>
  );
}