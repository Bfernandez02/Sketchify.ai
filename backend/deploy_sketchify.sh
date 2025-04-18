#!/bin/bash

# Set your Google Cloud project ID
PROJECT_ID="sketchifyai-31ce5"
SERVICE_NAME="sketchify-api"
REGION="us-central1" 

# Ensure gcloud is using the correct project
gcloud config set project $PROJECT_ID

# Enable required APIs (if not already enabled)
gcloud services enable \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  secretmanager.googleapis.com

# Create a secret for the service account key
echo "Creating secret for service account key..."
gcloud secrets create sketchify-service-key \
  --replication-policy="automatic" \
  --project=$PROJECT_ID

# Add the service account key to the secret
gcloud secrets versions add sketchify-service-key \
  --data-file=sketchify-service-key.json \
  --project=$PROJECT_ID

# Build and push the Docker image to Google Container Registry
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME:latest"

# Build the Docker image
echo "Building Docker image..."
gcloud builds submit --tag $IMAGE_NAME

# Deploy to Cloud Run
echo "Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image $IMAGE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars="GEMINI_API_KEY=${GEMINI_API_KEY}" \
  --memory 1Gi

# Give Cloud Run service account access to the secret
SERVICE_ACCOUNT=$(gcloud run services describe $SERVICE_NAME \
  --platform managed \
  --region $REGION \
  --format 'value(serviceAccountEmail)')

gcloud secrets add-iam-policy-binding sketchify-service-key \
  --member="serviceAccount:$SERVICE_ACCOUNT" \
  --role="roles/secretmanager.secretAccessor" \
  --project=$PROJECT_ID

# Get the deployed service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --platform managed --region $REGION --format 'value(status.url)')

echo "Deployment complete!"
echo "Service URL: $SERVICE_URL"