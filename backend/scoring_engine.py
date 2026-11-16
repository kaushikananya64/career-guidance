def calculate_scores(subjects, interest):
    # Initialize base scores
    scores = {
        "Technology": 0,
        "Medical": 0,
        "Business": 0,
        "Arts": 0
    }
    
    # Weight configuration
    subject_weights = {
        "Maths": {"Technology": 3, "Business": 2},
        "Physics": {"Technology": 2, "Medical": 2},
        "Chemistry": {"Technology": 1, "Medical": 3},
        "Biology": {"Medical": 4},
        "Computer Science": {"Technology": 4},
        "Accountancy": {"Business": 4},
        "Business Studies": {"Business": 3},
        "Economics": {"Business": 3, "Arts": 2},
        "History": {"Arts": 3},
        "Political Science": {"Arts": 3},
        "Geography": {"Arts": 2},
        "English": {"Arts": 2, "Business": 1, "Technology": 1, "Medical": 1},
        "Psychology": {"Arts": 4, "Medical": 1}
    }
    
    # Calculate scores from subjects
    for subject in subjects:
        if subject in subject_weights:
            for field, weight in subject_weights[subject].items():
                scores[field] += weight
                
    # Add weight for direct interest (strong indicator)
    interest_map = {
        "Technology": "Technology",
        "Medical": "Medical",
        "Business": "Business",
        "Arts": "Arts"
    }
    
    if interest in interest_map:
        scores[interest_map[interest]] += 5 # High weight for explicit interest
        
    return scores
