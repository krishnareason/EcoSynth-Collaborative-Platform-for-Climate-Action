import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../services/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

// Import all necessary child components
import ClaimCreator from './ClaimCreator';
import MyClaimsList from './MyClaimsList';
import MyProjectsList from './MyProjectsList';
import ActiveProjectsList from './ActiveProjectsList';

// Styling for the layout
const styles = {
  claimsContainer: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'start' },
  sectionTitle: { fontSize: '1.5rem', borderBottom: '2px solid #007bff', paddingBottom: '10px', marginTop: '40px' }
};

export default function ResearcherWarRoom() {
  const { currentUser } = useAuth();
  const [myClaims, setMyClaims] = useState([]);
  const [loadingClaims, setLoadingClaims] = useState(true);

  // This function fetches the initial list of claims created by this researcher
  const fetchMyClaims = useCallback(async () => {
    if (!currentUser) return;
    setLoadingClaims(true);
    try {
      const q = query(
        collection(db, "claims"), 
        where("createdBy", "==", currentUser.uid),
        orderBy("createdAt", "desc") // Show newest claims first
      );
      const querySnapshot = await getDocs(q);
      const claimsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMyClaims(claimsData);
    } catch (error) {
      console.error("Error fetching claims:", error);
    }
    setLoadingClaims(false);
  }, [currentUser]);

  useEffect(() => {
    fetchMyClaims();
  }, [fetchMyClaims]);
  
  // This function receives a new claim from the child component and adds it to the list instantly
  const handleClaimCreated = (newClaim) => {
    // Add the new claim to the top of the existing list for a real-time feel
    setMyClaims(prevClaims => [newClaim, ...prevClaims]);
  };

  return (
    <div>
      <h1>Researcher War Room</h1>
      <p>
        Create new claims for science communication, review your past submissions, and collaborate on active environmental projects.
      </p>
      
      {/* --- Section 1: Science Communication --- */}
      <h2 style={styles.sectionTitle}>Science Communication</h2>
      <div style={styles.claimsContainer}>
        {/* The ClaimCreator form is on the left. We pass the handler function to it. */}
        <ClaimCreator onClaimCreated={handleClaimCreated} />

        {/* The list of claims is on the right. We pass the claims data to it. */}
        <MyClaimsList claims={myClaims} loading={loadingClaims} />
      </div>

      {/* --- Section 2: Project Collaboration --- */}
      <h2 style={styles.sectionTitle}>Project Collaboration</h2>
      
      {/* This component shows the projects the researcher has personally joined */}
      <MyProjectsList />

      <hr style={{ margin: '40px 0' }}/>
      
      {/* This component shows all active projects available on the platform */}
      <ActiveProjectsList />
    </div>
  );
}