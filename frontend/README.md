# MedSync Frontend

React + TypeScript frontend application with Vite, TailwindCSS, and shadcn/ui components.

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── ui/           # shadcn/ui components
│   ├── services/         # API calls and external integrations
│   ├── lib/
│   │   └── utils.ts      # Utility functions
│   ├── assets/           # Static assets
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # App entry point
│   └── index.css         # Global styles
├── public/               # Static public files
├── index.html            # HTML template
├── vite.config.ts        # Vite configuration
├── components.json       # shadcn/ui configuration
└── package.json
```

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🛠 Tech Stack

- **React 19** with TypeScript
- **Vite** - Build tool and dev server
- **TailwindCSS v4** - Utility-first CSS
- **shadcn/ui** - Component library
- **Lucide React** - Icon library

## 🔧 Development

### Available Scripts

- `npm run dev` - Start dev server (http://localhost:5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding shadcn/ui Components

```bash
npx shadcn@latest add [component-name]
```

Components will be added to `src/components/ui/`

### Path Aliases

- `@/` - Points to `src/` directory
- `@/components` - Components directory
- `@/services` - API and service functions
- `@/lib` - Utility functions
- `@/ui` - UI components

## 🎨 Styling

- **TailwindCSS v4** with Vite plugin
- CSS variables for theming
- Component styling with `class-variance-authority`
- Utility merging with `tailwind-merge`

## 🔄 API Integration

Frontend runs on `http://localhost:5173`
Backend expected on `http://localhost:8000`

Configure API endpoints in environment variables or constants as needed.

## 📱 Features Ready for Development

- Modern React with hooks
- TypeScript for type safety
- Responsive design with Tailwind
- Component library integration
- Hot module replacement
- ESLint configuration
