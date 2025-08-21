import React, { useState, useEffect } from 'react';
import './DataFeedPage.css'; // We will create this for styling

// A helper function to format dates nicely
const formatDate = (isoString) => {
    return new Date(isoString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export default function DataFeedPage() {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch all submissions from our backend API
        fetch('http://localhost:8000/api/submissions')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setSubmissions(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching submissions:", error);
                setError('Failed to load the data feed. Please try again later.');
                setLoading(false);
            });
    }, []); // The empty array means this effect runs once on component mount

    return (
        <div className="data-feed-container">
            <div className="feed-header">
                <h1>Community Data Feed</h1>
                <p>Live environmental reports submitted by users like you.</p>
            </div>

            {loading && <p className="feed-status">Loading reports...</p>}
            {error && <p className="feed-status error">{error}</p>}
            
            {!loading && !error && (
                <div className="feed-grid">
                    {submissions.length > 0 ? (
                        submissions.map(sub => (
                            <div key={sub.id} className="submission-card">
                                <img src={sub.imageUrl} alt={sub.title} className="card-image" />
                                <div className="card-content">
                                    <span className={`card-status status-${sub.status}`}>{sub.status.replace('_', ' ')}</span>
                                    <h3 className="card-title">{sub.title}</h3>
                                    <p className="card-description">{sub.description}</p>
                                    <div className="card-footer">
                                        <p><strong>Submitted by:</strong> {sub.submittedBy}</p>
                                        <p><strong>Location:</strong> {sub.lat.toFixed(4)}, {sub.lng.toFixed(4)}</p>
                                        <p><strong>Time:</strong> {formatDate(sub.createdAt)}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="feed-status">No submissions have been made yet. Be the first!</p>
                    )}
                </div>
            )}
        </div>
    );
}