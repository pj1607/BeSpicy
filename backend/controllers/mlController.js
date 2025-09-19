import apiClient from "../utiles/apiClient.js"

export const getRecommendations = async (req, res) => {
  try {
    const { ingredients, top_n, max_time } = req.query;

    if (!ingredients) {
      return res.status(400).json({ error: "Ingredients are required" });
    }

    const response = await apiClient.get("/recommend", {
      params: {
        ingredients,
        top_n: top_n || 10,
        max_time: max_time || null,
      },
    });

    res.json({ results: response.data.results });
  } catch (error) {
    console.error("ML Service Error:", error.message);
    res.status(500).json({ error: "Failed to fetch recommendations" });
  }
};
