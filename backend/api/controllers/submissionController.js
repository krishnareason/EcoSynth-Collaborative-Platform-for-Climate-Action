// --- MOCK DATABASE for Submissions ---
const MOCK_SUBMISSIONS_DB = [];
let submissionIdCounter = 1;
// ------------------------------------

// @desc    Create a new submission
// @route   POST /api/submissions
const createSubmission = (req, res) => {
    // 1. Destructure lat and lng from the request body
    const { title, description, imageUrl, submittedBy, lat, lng } = req.body;

    if (!title || !description || !imageUrl || lat === undefined || lng === undefined) {
        return res.status(400).json({ message: 'All fields, including image and location, are required.' });
    }

    const newSubmission = {
        id: submissionIdCounter++,
        title,
        description,
        imageUrl,
        submittedBy: submittedBy || 'Anonymous',
        lat, // 2. Add latitude to the new submission object
        lng, // 3. Add longitude to the new submission object
        createdAt: new Date().toISOString(),
        status: 'pending_validation'
    };

    MOCK_SUBMISSIONS_DB.push(newSubmission);
    console.log('New Submission Added:', newSubmission);

    res.status(201).json(newSubmission);
};

// @desc    Get all submissions
// @route   GET /api/submissions
const getSubmissions = (req, res) => {
    res.status(200).json([...MOCK_SUBMISSIONS_DB].reverse());
};

module.exports = {
    createSubmission,
    getSubmissions,
};