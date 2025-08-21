import sys
import json
import random

# This is a mock AI prediction script.
# It takes existing data points and generates a "predicted" new point nearby.
def generate_prediction(base_lat, base_lng):
    # Add a small, random offset to create a "nearby" point
    new_lat = base_lat + (random.uniform(-0.05, 0.05))
    new_lng = base_lng + (random.uniform(-0.05, 0.05))
    
    return {
        "lat": new_lat,
        "lng": new_lng,
        "title": "Predicted Deforestation Hotspot",
        "description": "AI predicts a 73% risk of deforestation in this area within 6 months based on nearby activity.",
        "type": "predicted_deforestation",
        "severity": "High"
    }

if __name__ == "__main__":
    # In a real app, you would read existing data from Firestore here.
    # For this example, we'll use a hardcoded base location (e.g., the last report).
    # You would pass the real data from Node.js as a command-line argument.
    
    # Mock base location (New Delhi)
    base_lat = 28.6139
    base_lng = 77.2090
    
    prediction = generate_prediction(base_lat, base_lng)
    
    # Print the prediction as a JSON string to be captured by Node.js
    print(json.dumps(prediction))