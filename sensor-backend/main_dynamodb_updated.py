from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from transformers import pipeline
import boto3
from boto3.dynamodb.conditions import Key

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Initialize DynamoDB
dynamodb = boto3.resource('', region_name='')  # Change region if needed
table = dynamodb.Table('')

# ✅ Data Model for Incidents
class Incident(BaseModel):
    id: str
    type: str
    timestamp: str
    status: str

# ✅ POST: Add new incident to DynamoDB
@app.post("/incidents")
def add_incident(incident: Incident):
    table.put_item(Item=incident.dict())
    return {"message": "Incident added to DynamoDB"}

# ✅ GET: Fetch all incidents from DynamoDB
@app.get("/incidents", response_model=List[Incident])
def get_incidents():
    response = table.scan()
    return response.get("Items", [])

# ✅ PUT: Mark incident as Resolved
@app.put("/incidents/{incident_id}")
def update_status(incident_id: str):
    result = table.update_item(
        Key={"id": incident_id},
        UpdateExpression="SET #s = :status",
        ExpressionAttributeNames={"#s": "status"},
        ExpressionAttributeValues={":status": "Resolved"},
        ReturnValues="UPDATED_NEW"
    )
    if "Attributes" not in result:
        raise HTTPException(status_code=404, detail="Incident not found")
    return {"message": "Status updated to Resolved"}

# ✅ AI-generated Social Media Feed
generator = pipeline("text-generation", model="gpt2")

@app.get("/ai-social-posts")
def generate_social_fire_posts():
    prompt = "Generate 4 realistic social media posts about wildfire alerts in the USA. Include hashtags and short messages:"
    output = generator(prompt, max_length=60, num_return_sequences=4)

    posts = [item['generated_text'].strip().split("\n")[0] for item in output]
    return {"posts": posts}