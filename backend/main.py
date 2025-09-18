from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from ml_model import get_recommendations
import numpy as np

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/recommend")
def recommend(
    ingredients: str = Query(..., description="Comma-separated ingredients"),
    max_time: int = Query(None, description="Max cooking time in minutes"),
    top_n: int = Query(10, description="Number of recipes to return")
):
    try:
        results = get_recommendations(ingredients, max_time, top_n)
        for r in results:
            if isinstance(r.get("time"), np.generic):
                r["time"] = int(r["time"])
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
