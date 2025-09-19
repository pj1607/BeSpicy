import pandas as pd
import heapq
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from rapidfuzz import process 

# Load recipes data
recipes_data = pd.read_csv("IndianFood.csv")
selected_features = ['TranslatedIngredients', 'Cuisine', 'Course', 'Diet']

for feature in selected_features:
    recipes_data[feature] = recipes_data[feature].fillna('')

combined_features = (
    recipes_data['TranslatedIngredients'] + ' ' +
    recipes_data['Cuisine'] + ' ' +
    recipes_data['Course'] + ' ' +
    recipes_data['Diet']
)

# Vectorize once
vectorizer = TfidfVectorizer()
feature_vectors = vectorizer.fit_transform(combined_features)

# Pre-map recipe data to avoid iloc overhead
recipes_dict = {
    idx: {
        "recipe": row["TranslatedRecipeName"],
        "time": int(row["TotalTimeInMins"]) if pd.notna(row["TotalTimeInMins"]) else None,
        "url": row["URL"],
        "Ingredients": row.get("Ingredients", ""),
        "PrepTimeInMins": int(row["PrepTimeInMins"]) if pd.notna(row["PrepTimeInMins"]) else None,
        "CookTimeInMins": int(row["CookTimeInMins"]) if pd.notna(row["CookTimeInMins"]) else None,
        "TotalTimeInMins": int(row["TotalTimeInMins"]) if pd.notna(row["TotalTimeInMins"]) else None,
        "Servings": int(row["Servings"]) if pd.notna(row["Servings"]) else None,
        "Cuisine": str(row.get("Cuisine", "")),
        "Course": str(row.get("Course", "")),
        "Diet": str(row.get("Diet", "")),
        "Instructions": str(row.get("Instructions", ""))
    }
    for idx, row in recipes_data.iterrows()
}

list_of_all_recipes = recipes_data["TranslatedRecipeName"].tolist()


def get_recommendations(user_ingredients: str, max_time: int = None, top_n: int = 10):
    recommendations = []

    # Fast fuzzy match using rapidfuzz
    match = process.extractOne(user_ingredients, list_of_all_recipes, score_cutoff=85)
    if match:
        recipe_name = match[0]
        matched_row = recipes_data[recipes_data.TranslatedRecipeName == recipe_name].iloc[0]
        index = matched_row.name
        recommendations.append(recipes_dict[index])
        return recommendations

    # Vector similarity search
    new_features = vectorizer.transform([user_ingredients])
    cosine_scores = cosine_similarity(new_features, feature_vectors).flatten()

    # Pick top_n using heapq.nlargest instead of full sort
    top_matches = heapq.nlargest(top_n, enumerate(cosine_scores), key=lambda x: x[1])

    for idx, score in top_matches:
        recipe = recipes_dict[idx]
        if max_time is None or (recipe["time"] is not None and recipe["time"] <= max_time):
            recommendations.append(recipe)

    return recommendations
