from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from transformers import pipeline

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5177"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ In-memory incident storage
incident_store: List["Incident"] = []

# ✅ Data Model for Incidents
class Incident(BaseModel):
    id: str
    type: str
    timestamp: str
    status: str

# ✅ POST: Add new incident
@app.post("/incidents")
def add_incident(incident: Incident):
    incident_store.append(incident)
    return {"message": "Incident added"}

# ✅ GET: Get all incidents
@app.get("/incidents", response_model=List[Incident])
def get_incidents():
    return incident_store

# ✅ PUT: Mark incident as Resolved
@app.put("/incidents/{incident_id}")
def update_status(incident_id: str):
    for incident in incident_store:
        if incident.id == incident_id:
            incident.status = "Resolved"
            return {"message": "Status updated to Resolved"}
    raise HTTPException(status_code=404, detail="Incident not found")

# ✅ AI-generated Social Media Feed
generator = pipeline("text-generation", model="gpt2")

@app.get("/ai-social-posts")
def generate_social_fire_posts():
    prompt = "Generate 4 realistic social media posts about wildfire alerts in the USA. Include hashtags and short messages:"
    output = generator(prompt, max_length=60, num_return_sequences=3)

    posts = []
    for item in output:
        text = item['generated_text'].strip().split("\n")[0]
        posts.append(text)

    return {"posts": posts}
