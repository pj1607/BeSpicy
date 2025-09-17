# Importing dependencies
import numpy as np
import pandas as pd
import difflib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# -------------------- Data Collection & Preprocessing --------------------
# Load dataset
recipes_data = pd.read_csv('/content/IndianFoodDatasetCSV.csv')

# Select relevant features for recommendation
selected_features = ['TranslatedIngredients', 'Cuisine', 'Course', 'Diet']

for feature in selected_features:
    recipes_data[feature] = recipes_data[feature].fillna('')

# Combine features into a single string for each recipe
combined_features = (
    recipes_data['TranslatedIngredients'] + ' ' +
    recipes_data['Cuisine'] + ' ' +
    recipes_data['Course'] + ' ' +
    recipes_data['Diet']
)

# Convert text data into TF-IDF feature vectors
vectorizer = TfidfVectorizer()
feature_vectors = vectorizer.fit_transform(combined_features)

# Compute cosine similarity
similarity = cosine_similarity(feature_vectors)

# -------------------- Recipe Recommendation --------------------
def recommend_recipes(user_ingredients, max_time=None, top_n=10):
    """
    Recommend recipes based on given ingredients and optional max cooking time.
    :param user_ingredients: str (comma-separated list of ingredients)
    :param max_time: int (maximum total time in minutes)
    :param top_n: int (number of recipes to return)
    """

    # Find closest recipe match using difflib
    list_of_all_recipes = recipes_data['TranslatedRecipeName'].tolist()
    close_matches = difflib.get_close_matches(user_ingredients, list_of_all_recipes)

    if close_matches:
        # If user typed a known recipe name
        close_match = close_matches[0]
        index_of_recipe = recipes_data[recipes_data.TranslatedRecipeName == close_match]['Srno'].values[0]
    else:
        # Otherwise, use ingredients string directly
        new_features = vectorizer.transform([user_ingredients])
        cosine_scores = cosine_similarity(new_features, feature_vectors).flatten()
        similarity_score = list(enumerate(cosine_scores))
        sorted_similar_recipes = sorted(similarity_score, key=lambda x: x[1], reverse=True)
    # -------------------- Filtering & Output --------------------
        print("Recipes suggested for you:\n")
        i = 1
        for recipe in sorted_similar_recipes:
            index = recipe[0]
            total_time = recipes_data.iloc[index]['TotalTimeInMins']

            # Filter by max_time if given
            if max_time is None or total_time <= max_time:
                recipe_name = recipes_data.iloc[index]['TranslatedRecipeName']
                url = recipes_data.iloc[index]['URL']
                print(f"{i}. {recipe_name} | Time: {total_time} mins | Link: {url}")
                i += 1

            if i > top_n:
                break

# -------------------- Example Run --------------------
# User enters ingredients & time limit
user_input = input("Enter ingredients (comma-separated): ")
time_limit = int(input("Enter max total time in mins (or 0 for no limit): "))

if time_limit == 0:
    time_limit = None

recommend_recipes(user_input, max_time=time_limit, top_n=15)
