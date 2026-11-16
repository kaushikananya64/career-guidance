from scoring_engine import calculate_scores
from career_logic import CAREER_DATA

def recommend_career(user_data):
    """
    user_data dict structure:
    {
        "name": str,
        "age": int,
        "percentage": float,
        "subjects": list[str],
        "interest": str
    }
    """
    subjects = user_data.get("subjects", [])
    interest = user_data.get("interest", "")
    
    scores = calculate_scores(subjects, interest)
    
    # Find the field with the highest score
    best_field = "Technology" # Fallback default
    if scores:
        best_field = max(scores, key=scores.get)
    
    # Safely retrieve data using defaults if the field is somehow missing
    field_data = CAREER_DATA.get(best_field, {
        "degrees": ["General Degree Program"],
        "exams": ["Standard Entrance Tests"],
        "careers": ["Entry Level Professional"]
    })
    
    # Prepare the result
    recommendation = {
        "field": best_field,
        "degrees": field_data.get("degrees", []),
        "exams": field_data.get("exams", []),
        "careers": field_data.get("careers", [])
    }
    
    return recommendation
