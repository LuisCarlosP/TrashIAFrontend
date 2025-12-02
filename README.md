# TrashIA Frontend

A modern React + TypeScript web application for intelligent waste classification using AI. TrashIA helps users identify and properly sort recyclable materials through image recognition and an interactive chat assistant.

## Features

- **Image Upload**: Drag and drop or select images from your device
- **Camera Capture**: Take photos directly using your device camera
- **AI Classification**: Identifies 6 types of waste (cardboard, glass, metal, paper, plastic, trash)
- **Recyclability Info**: Indicates if the material is recyclable with detailed guidance
- **AI Chat Assistant**: Ask questions about the identified material and get recycling tips
- **Multi-language Support**: Available in English and Spanish
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Modern UI**: Clean green eco-themed design with smooth animations

## Tech Stack

- React 19
- TypeScript 5.9
- Vite 7
- FontAwesome Icons
- React Markdown
- CSS3 (Gradients and animations)

## Installation

```bash
# Install dependencies
npm install

# Set up environment variables
# For local development, create a .env.local file
cp .env.example .env.local

# Edit .env.local with your local backend URL
# VITE_API_URL=http://localhost:8000

# The .env file contains the production URL
# VITE_API_URL=https://trashia.onrender.com
```

## Development

```bash
# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Build

```bash
# Generate production build
npm run build

# Preview the build
npm run preview
```

## API Endpoints

The frontend connects to the TrashIA backend API:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/predict` | POST | Classify an image |
| `/health` | GET | Check API health status |
| `/chat/session` | POST | Create a chat session |
| `/chat/message` | POST | Send a chat message |
| `/chat/history/:id` | GET | Get chat history |
| `/chat/session/:id` | DELETE | Delete a chat session |
| `/chat/material` | PUT | Update material context |

Backend repository: `https://github.com/LuisCarlosP/TrashIA`

## Usage

### Upload Image
1. Click "Select Image" or drag and drop an image
2. Click "Analyze Waste"
3. View the classification result

### Take Photo
1. Click "Take Photo"
2. Allow camera access
3. Click "Capture"
4. View the classification result

### Chat Assistant
After analyzing an image, you can:
1. Click "Ask a question"
2. Type your question about the material
3. Get AI-powered recycling advice

### Classification Results
- **Material Type**: Classification of the waste
- **Confidence**: AI certainty percentage
- **Recyclability**: Whether the material is recyclable
- **Recycling Tips**: How to properly recycle the material

## Supported Waste Types

| Type | Recyclable | Container |
|------|------------|-----------|
| Cardboard | Yes | Blue bin |
| Glass | Yes | Green bin |
| Metal | Yes | Yellow bin |
| Paper | Yes | Blue bin |
| Plastic | Yes | Yellow bin |
| Trash | No | General waste |

## Color Theme

- Primary Green: `#2e7d32`
- Secondary Green: `#388e3c`
- Light Green: `#43a047`
- Background: Light green gradient

## Project Structure

```
src/
  components/
    Header.tsx          # App header with language toggle
    UploadSection.tsx   # Image upload and drag-drop
    CameraSection.tsx   # Camera capture interface
    PredictionCard.tsx  # Classification results display
    ChatSection.tsx     # AI chat assistant
    LoadingError.tsx    # Loading spinner and error messages
    Footer.tsx          # App footer
  services/
    api.ts              # API client functions
  translations.ts       # i18n translations (EN/ES)
  App.tsx               # Main application component
  App.css               # Global styles
public/
  trashia-icon.svg      # App icon
```

## License

MIT
