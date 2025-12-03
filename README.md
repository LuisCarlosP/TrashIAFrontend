# TrashIA Frontend

React + TypeScript web application for AI-powered waste classification.

## Technologies

- React 19
- TypeScript 5.9
- Vite 7
- Leaflet (maps)
- FontAwesome
- EmailJS (contact form)

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Available at `http://localhost:5173`

## Build

```bash
npm run build
```

## Environment Variables

For local development, create a `.env.local` file:

```env
VITE_API_URL=http://localhost:8000
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

## Structure

```
src/
  components/
    common/
      Header/
      Footer/
      LoadingError/
    classifier/
      UploadSection/
      CameraCapture/
      PredictionCard/
      ChatSection/
    map/
      MapHeader/
      MapControls/
      MapFilters/
      PointPopup/
    contact/
      ContactForm/
  pages/
    HomePage/
    Classifier/
    Map/
  services/
    api.ts
    location.ts
  translations.ts
  App.tsx
```

## API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/predict` | POST | Classify image |
| `/chat/session` | POST | Create chat session |
| `/chat/message` | POST | Send message |
| `/location/recycling-points` | GET | Recycling points |

## License

MIT
