const { spawn } = require('child_process');

// @desc    Get deforestation predictions from the Python AI script
// @route   GET /api/predictions/deforestation
const getDeforestationPrediction = (req, res) => {
    // The 'spawn' function runs a command-line command.
    // We're telling it to run 'python' with our script as the argument.
    const pythonProcess = spawn('python', ['./ai/predict_deforestation.py']);

    // Listen for data output from the Python script
    pythonProcess.stdout.on('data', (data) => {
        try {
            // The data is a buffer, so we convert it to a string and parse it as JSON
            const prediction = JSON.parse(data.toString());
            res.status(200).json(prediction);
        } catch (error) {
            res.status(500).json({ message: "Failed to parse prediction data." });
        }
    });

    // Listen for any errors from the script
    pythonProcess.stderr.on('data', (data) => {
        console.error(`Python script error: ${data}`);
        res.status(500).json({ message: "An error occurred in the prediction script." });
    });
};

module.exports = {
    getDeforestationPrediction,
};