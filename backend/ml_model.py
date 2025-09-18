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

def fetch_image(url: str):
    try:
        response = requests.get(url, timeout=5)
        soup = BeautifulSoup(response.content, "html.parser")
        og_image = soup.find("meta", property="og:image")
        if og_image and og_image.get("content"):
            return og_image["content"]
    except Exception:
        pass
    return "https://via.placeholder.com/400x250?text=No+Image"

def get_recommendations(user_ingredients: str, max_time: int = None, top_n: int = 10):
    list_of_all_recipes = recipes_data['TranslatedRecipeName'].tolist()
    close_matches = difflib.get_close_matches(user_ingredients, list_of_all_recipes)

    recommendations = []

    if close_matches:
        close_match = close_matches[0]
        matched_row = recipes_data[recipes_data.TranslatedRecipeName == close_match]
        if not matched_row.empty:
            index_of_recipe = matched_row['Srno'].values[0]
            url = matched_row['URL'].values[0]
            recommendations.append({
                "recipe": close_match,
                "time": None,
                "url": url,
                "image": fetch_image(url)
            })
    else:
        new_features = vectorizer.transform([user_ingredients])
        cosine_scores = cosine_similarity(new_features, feature_vectors).flatten()
        similarity_score = list(enumerate(cosine_scores))
        sorted_similar_recipes = sorted(similarity_score, key=lambda x: x[1], reverse=True)

        for recipe in sorted_similar_recipes:
            index = recipe[0]
            total_time = recipes_data.iloc[index]['TotalTimeInMins']
            if max_time is None or total_time <= max_time:
                recipe_name = recipes_data.iloc[index]['TranslatedRecipeName']
                url = recipes_data.iloc[index]['URL']
                recommendations.append({
                    "recipe": recipe_name,
                    "time": total_time,
                    "url": url,
                    "image": fetch_image(url)
                })
                if len(recommendations) >= top_n:
                    break

    return recommendations
