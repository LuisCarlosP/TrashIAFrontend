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

For local development, create a `.env.local` file in the root directory:

```env
VITE_API_URL=http://localhost:8000
VITE_API_KEY=your_secret_api_key
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

## Structure

```
src/
  components/
    classifier/
      CameraCapture/
      ChatSection/
      PredictionCard/
      UploadSection/
    common/
      Footer/
      Header/
      Loading/
    contact/
    map/
      MapControls/
      MapFilters/
      PointPopup/
    scanner/
    stats/
  pages/
    Classifier/
    HomePage/
    Map/
    NotFound/
    Scanner/
    Stats/
    Terms/
  services/
    Classifier.ts
    barcode.ts
    history.ts
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
| `/barcode/{code}` | GET | Product info by barcode |

## License

Copyright © 2024 Luis Carlos Picado Rojas - All Rights Reserved

This project is available for viewing and educational purposes only. See the [LICENSE](LICENSE) file for details.

## Author

**Luis Carlos Picado Rojas**

- GitHub: [@LuisCarlosP](https://github.com/LuisCarlosP)
