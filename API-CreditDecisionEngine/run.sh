#!/bin/bash
# Start the FastAPI server

echo "🚀 Starting FinSight-AA Credit Decision API..."
echo ""

cd "$(dirname "$0")"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "⚠️  Virtual environment not found. Creating one..."
    python3 -m venv venv
    source venv/bin/activate
    echo "📦 Installing dependencies..."
    pip install -r requirements.txt
else
    source venv/bin/activate
fi

echo "🔄 Loading ML models..."
echo ""

# Start the server
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000
