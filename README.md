# TrashIA Frontend

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/LuisCarlosP/TrashIA)

React + TypeScript web application for AI-powered waste classification. Features an intuitive interface for image classification, interactive recycling maps, barcode scanning, and a virtual recycling assistant.

## Features

- AI-powered waste classification with camera capture
- Interactive recycling points map with filters
- Barcode scanner for product recyclability info
- Virtual recycling assistant chat
- User statistics and environmental impact tracking
- Multi-language support (English/Spanish)
- Responsive design for mobile and desktop
- Contact form integration


## Technologies

| Technology | Version | Usage |
|------------|---------|-------|
| React | 19 | UI Framework |
| TypeScript | 5.9 | Type-safe JavaScript |
| Vite | 7 | Build tool |
| Leaflet | - | Interactive maps |
| FontAwesome | - | Icons |
| EmailJS | - | Contact form |
| html5-qrcode | - | Barcode scanning |


## Requirements

- Node.js 18+
- npm or yarn
- TrashIA Backend running (for API)


## Installation

### 1. Clone the repository
```bash
git clone https://github.com/LuisCarlosP/TrashIA.git
cd TrashIA/TrashIAFrontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env.local` file in the root directory:

```env
VITE_API_URL=http://localhost:8000
VITE_API_KEY=your_secret_api_key
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

### 4. Run development server
```bash
npm run dev
```

Available at `http://localhost:5173`


## Build

```bash
npm run build
```

Build output is generated in the `dist/` folder.


## Deployment

```bash
npm run deploy
```

Deploys to GitHub Pages.


## Project Structure

```
TrashIAFrontend/
├── index.html              # Entry HTML
├── package.json            # Dependencies
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript config
├── public/
│   └── 404.html            # GitHub Pages 404 handler
├── docs/                   # Production build (GitHub Pages)
└── src/
    ├── main.tsx            # React entry point
    ├── App.tsx             # Main application
    ├── translations.ts     # i18n translations
    ├── components/
    │   ├── auth/           # Authentication components
    │   ├── classifier/     # Classifier components
    │   │   ├── CameraCapture/
    │   │   ├── ChatSection/
    │   │   ├── PredictionCard/
    │   │   └── UploadSection/
    │   ├── common/         # Shared components
    │   │   ├── Footer/
    │   │   ├── Header/
    │   │   └── Loading/
    │   ├── contact/        # Contact form
    │   ├── map/            # Map components
    │   │   ├── MapControls/
    │   │   ├── MapFilters/
    │   │   └── PointPopup/
    │   ├── scanner/        # Barcode scanner
    │   └── stats/          # Statistics components
    ├── context/            # React contexts
    ├── hooks/              # Custom hooks
    ├── pages/
    │   ├── Auth/           # Authentication pages
    │   ├── Chat/           # Chat page
    │   ├── Classifier/     # Main classifier page
    │   ├── HomePage/       # Landing page
    │   ├── Map/            # Recycling map page
    │   ├── NotFound/       # 404 page
    │   ├── Scanner/        # Barcode scanner page
    │   ├── Stats/          # User statistics page
    │   └── Terms/          # Terms and conditions
    ├── services/
    │   ├── Classifier.ts   # Classification API
    │   ├── barcode.ts      # Barcode API
    │   ├── history.ts      # Local history storage
    │   └── location.ts     # Location API
    ├── styles/             # Global styles
    ├── types/              # TypeScript types
    └── assets/             # Images and static files
```


## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/predict` | Classify waste image |
| POST | `/chat/session` | Create chat session |
| POST | `/chat/message` | Send chat message |
| GET | `/chat/history/{session_id}` | Get chat history |
| GET | `/location/recycling-points` | Get nearby recycling points |
| GET | `/barcode/{code}` | Get product info by barcode |
| GET | `/health` | API health check |


## License

Copyright © 2025 Luis Carlos Picado Rojas - All Rights Reserved

This project is available for viewing and educational purposes only. See the [LICENSE](LICENSE) file for details.

---

## Author

**Luis Carlos Picado Rojas**

- GitHub: [@LuisCarlosP](https://github.com/LuisCarlosP)
