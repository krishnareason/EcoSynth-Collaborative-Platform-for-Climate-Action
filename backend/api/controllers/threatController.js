// --- MOCK DATABASE ---
const MOCK_THREATS_DB = [
    { id: 1, lat: 28.6139, lng: 79.2090, title: "Illegal Deforestation", description: "Large-scale illegal logging reported.", type: "deforestation", severity: "High" },
    { id: 2, lat: 20.7634, lng: 88.0375, title: "Plastic Waste Buildup", description: "Significant plastic accumulation in the river.", type: "plastic", severity: "Medium" },
    { id: 3, lat: 234.5726, lng: 88.3639, title: "Coral Bleaching Alert", description: "High sea temperatures detected, risk is critical.", type: "coral", severity: "Critical" },
];
// ---------------------

const getThreats = (req, res) => {
    res.status(200).json(MOCK_THREATS_DB);
};

module.exports = {
    getThreats,
};