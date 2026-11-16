import os
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from recommender import recommend_career

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app) # Enable cross-origin resource sharing for frontend

@app.route('/health', methods=['GET'])
def health_check():
    """Simple health check endpoint for deployment monitoring."""
    return jsonify({"status": "healthy", "service": "CareerGuidanceSystem"}), 200

@app.route('/predict', methods=['POST'])
def predict():
    try:
        user_data = request.json
        if not user_data:
            logger.warning("Predict endpoint called with no data")
            return jsonify({"error": "No data provided. Request body must be JSON."}), 400
            
        logger.info(f"Processing prediction for user: {user_data.get('name', 'Unknown')}")
        recommendation = recommend_career(user_data)
        
        return jsonify({
            "status": "success",
            "data": recommendation
        })
    except Exception as e:
        logger.error(f"Error during prediction: {str(e)}", exc_info=True)
        return jsonify({"error": "An internal server error occurred while processing the request."}), 500

if __name__ == '__main__':
    # Configuration via environment variables for production readiness
    debug_mode = os.environ.get('FLASK_DEBUG', 'False').lower() in ['true', '1', 't']
    port = int(os.environ.get('PORT', 5000))
    
    logger.info(f"Starting Career Guidance Backend on port {port} (Debug: {debug_mode})")
    app.run(host='0.0.0.0', debug=debug_mode, port=port)
