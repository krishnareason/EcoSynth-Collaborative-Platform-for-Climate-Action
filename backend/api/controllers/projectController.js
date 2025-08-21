// Import the 'db' object you configured in your frontend's firebase.js
// For the backend, you'd typically use the Firebase Admin SDK, but for simplicity, we'll assume a similar setup.
// NOTE: For a real production app, use Firebase Admin SDK for backend operations.
const { db } = require('../../frontend/src/services/firebase'); // Adjust path if needed
const { collection, addDoc, getDocs, query, orderBy } = require('firebase/firestore');

// Get a reference to the 'submissions' collection in Firestore
const submissionsCollectionRef = collection(db, 'submissions');

// @desc    Create a new submission and save it to Firestore
// @route   POST /api/submissions
const createSubmission = async (req, res) => {
    try {
        const { title, description, imageUrl, submittedBy, lat, lng } = req.body;

        if (!title || !description || !imageUrl || lat === undefined || lng === undefined) {
            return res.status(400).json({ message: 'All fields, including image and location, are required.' });
        }

        // Create the new submission object
        const newSubmission = {
            title,
            description,
            imageUrl,
            submittedBy: submittedBy || 'Anonymous',
            lat,
            lng,
            createdAt: new Date().toISOString(), // Use ISO string for consistent sorting
            status: 'pending_validation'
        };

        // Add the new document to the 'submissions' collection
        const docRef = await addDoc(submissionsCollectionRef, newSubmission);
        
        console.log('New Submission Added to Firestore with ID:', docRef.id);
        res.status(201).json({ id: docRef.id, ...newSubmission });

    } catch (error) {
        console.error("Error creating submission in Firestore:", error);
        res.status(500).json({ message: "Failed to create submission." });
    }
};

// @desc    Get all submissions from Firestore
// @route   GET /api/submissions
const getSubmissions = async (req, res) => {
    try {
        // Create a query to get documents and order them by creation date, descending
        const q = query(submissionsCollectionRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        const submissions = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.status(200).json(submissions);
    } catch (error) {
        console.error("Error fetching submissions from Firestore:", error);
        res.status(500).json({ message: "Failed to fetch submissions." });
    }
};

module.exports = {
    createSubmission,
    getSubmissions,
};