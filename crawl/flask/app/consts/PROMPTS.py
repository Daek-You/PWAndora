PROMPT_EXTRACT = """Extract categories, description, languages and age rating as deduplicated JSON from the following HTML.
    # CATEGORIES LIST
        - Art & Design
        - Auto & Vehicles
        - Business & Productivity
        - Education
        - Entertainment & Media
        - Finance
        - Health & Fitness
        - Shopping & Lifestyle
        - Travel & Navigation
        - Utilities & Tools
        - Games
    # EXAMPLE 
    {{
        "categories": ['Games', 'Entertainment & Media'], # MAX 3
        "description": 'A fun and exciting game for all ages!',
        "languages": ['en', 'ko'],
        "age_rating": '4+'
    }}
    # following HTML
    {html}"""
