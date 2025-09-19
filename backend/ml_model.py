import pandas as pd
import difflib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import requests
from bs4 import BeautifulSoup

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

vectorizer = TfidfVectorizer()
feature_vectors = vectorizer.fit_transform(combined_features)
import requests
from bs4 import BeautifulSoup


def get_recommendations(user_ingredients: str, max_time: int = None, top_n: int = 10):
    list_of_all_recipes = recipes_data['TranslatedRecipeName'].tolist()
    close_matches = difflib.get_close_matches(user_ingredients, list_of_all_recipes)

    recommendations = []

    if close_matches:
        close_match = close_matches[0]
        matched_row = recipes_data[recipes_data.TranslatedRecipeName == close_match]
        if not matched_row.empty:
            index_of_recipe = matched_row['Srno'].values[0]
            row = matched_row.iloc[0]  # Use the full row
            url = row['URL']
            recommendations.append({
    "recipe": close_match,
    "time": int(row.get('TotalTimeInMins')) if pd.notna(row.get('TotalTimeInMins')) else None,
    "url": url,
    "Ingredients": str(row.get('Ingredients', '')),
    "PrepTimeInMins": int(row.get('PrepTimeInMins')) if pd.notna(row.get('PrepTimeInMins')) else None,
    "CookTimeInMins": int(row.get('CookTimeInMins')) if pd.notna(row.get('CookTimeInMins')) else None,
    "TotalTimeInMins": int(row.get('TotalTimeInMins')) if pd.notna(row.get('TotalTimeInMins')) else None,
    "Servings": int(row.get('Servings')) if pd.notna(row.get('Servings')) else None,
    "Cuisine": str(row.get('Cuisine', '')),
    "Course": str(row.get('Course', '')),
    "Diet": str(row.get('Diet', '')),
    "Instructions": str(row.get('Instructions', ''))
})

    else:
        new_features = vectorizer.transform([user_ingredients])
        cosine_scores = cosine_similarity(new_features, feature_vectors).flatten()
        similarity_score = list(enumerate(cosine_scores))
        sorted_similar_recipes = sorted(similarity_score, key=lambda x: x[1], reverse=True)

        for recipe in sorted_similar_recipes:
            index = recipe[0]
            row = recipes_data.iloc[index]
            total_time = row['TotalTimeInMins']
            if max_time is None or total_time <= max_time:
                recipe_name = row['TranslatedRecipeName']
                url = row['URL']
                
                recommendations.append({
    "recipe": recipe_name,
    "time": int(total_time) if pd.notna(total_time) else None,
    "url": url,
    "Ingredients": row.get('Ingredients', ''),
    "PrepTimeInMins": int(row.get('PrepTimeInMins')) if pd.notna(row.get('PrepTimeInMins')) else None,
    "CookTimeInMins": int(row.get('CookTimeInMins')) if pd.notna(row.get('CookTimeInMins')) else None,
    "TotalTimeInMins": int(row.get('TotalTimeInMins')) if pd.notna(row.get('TotalTimeInMins')) else None,
    "Servings": int(row.get('Servings')) if pd.notna(row.get('Servings')) else None,
    "Cuisine": str(row.get('Cuisine', '')),
    "Course": str(row.get('Course', '')),
    "Diet": str(row.get('Diet', '')),
    "Instructions": str(row.get('Instructions', ''))
})

                if len(recommendations) >= top_n:
                    break

    return recommendations
