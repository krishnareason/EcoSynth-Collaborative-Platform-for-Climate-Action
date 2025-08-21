import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function ClaimCreator({ onClaimCreated }) {
  const { currentUser, userProfile } = useAuth();
  const [claimText, setClaimText] = useState('');
  const [paperFile, setPaperFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setPaperFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!claimText || !paperFile) {
      return setMessage('Please provide both a claim and a PDF paper.');
    }

    setLoading(true);
    setMessage('Uploading paper to Cloudinary...');

    console.log("Cloudinary Cloud Name:", process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);
    console.log("Upload Preset:", process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);

    const formData = new FormData();
    formData.append('file', paperFile);
    formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
    formData.append('access_mode', 'public'); // ensures public access

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/raw/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      if (!data.secure_url) {
        throw new Error(data.error?.message || 'Cloudinary upload failed.');
      }

      const paperURL = data.secure_url;
      setMessage('Paper uploaded. Saving claim...');

      // --- Save claim to Firestore ---
      const newClaimData = {
        claimText,
        sourcePaperURL: paperURL,
        createdBy: currentUser.uid,
        creatorName: userProfile ? userProfile.name : currentUser.email,
        status: 'available',
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'claims'), newClaimData);

      setMessage('Claim successfully created!');
      if (onClaimCreated) {
        onClaimCreated({ id: docRef.id, ...newClaimData });
      }

      setClaimText('');
      setPaperFile(null);
      e.target.reset();
    } catch (error) {
      console.error('Error creating claim:', error);
      setMessage(error.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #eee', marginTop: '20px', borderRadius: '5px' }}>
      <h3>Create a New Claim for Communication</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Scientific Claim</label>
          <textarea
            value={claimText}
            onChange={(e) => setClaimText(e.target.value)}
            style={{ width: '100%', minHeight: '80px', boxSizing: 'border-box', padding: '8px' }}
            placeholder='e.g., "Mangroves sequester 4x more carbon than rainforests"'
            required
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Upload Supporting PDF Paper</label>
          <input
            type="file"
            onChange={handleFileChange}
            accept="application/pdf"
            style={{ width: '100%' }}
            required
          />
        </div>

        <button type="submit" disabled={loading} style={{ padding: '10px 15px' }}>
          {loading ? 'Submitting...' : 'Submit Claim'}
        </button>

        {message && <p style={{ marginTop: '10px' }}>{message}</p>}
      </form>
    </div>
  );
}
