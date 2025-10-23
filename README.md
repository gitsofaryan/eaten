# 🍽️ eaten

**Instant Meal Nutrition Analysis with AI**

Snap a photo of your meal and get instant nutritional analysis. Track calories, protein, carbs, and fat with AI-powered food recognition.

---

## ✨ Features

- 📸 **Photo Upload**: Take a photo or upload an image of your meal
- 🤖 **AI Analysis**: Automatic food recognition and nutritional breakdown (ready for API integration)
- 📊 **Detailed Macros**: View calories, protein, carbs, and fat for each food item
- 📈 **Total Summary**: See aggregate nutritional information for your entire meal
- 🎨 **Beautiful UI**: Modern, responsive design with glass morphism effects
- ⚡ **Fast & Responsive**: Built with React and Vite for optimal performance
- 📱 **Mobile-Friendly**: Works seamlessly on desktop and mobile devices

---

## 🚀 Demo

The app provides a seamless three-step process:

1. **Upload**: Take a photo or upload an image of your meal
2. **Analyze**: AI processes the image to identify food items
3. **Review**: View detailed nutritional breakdown for each item and total macros

---

## 🛠️ Technology Stack

This project is built with modern web technologies:

- **Frontend Framework**: [React 18](https://react.dev/) with TypeScript
- **Build Tool**: [Vite](https://vitejs.dev/) for lightning-fast development
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom design system
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) and [Radix UI](https://www.radix-ui.com/)
- **Routing**: [React Router v6](https://reactrouter.com/)
- **State Management**: React Query for server state
- **Icons**: [Lucide React](https://lucide.dev/)
- **Forms**: React Hook Form with Zod validation
- **Animations**: Tailwind CSS Animate

---

## 📦 Getting Started

### Prerequisites

- Node.js 16+ and npm (or bun/pnpm)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gitsofaryan/eaten.git
   cd eaten
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

---

## 💻 Usage

### Basic Workflow

1. **Upload a Photo**
   - Click "Take Photo" to use your device camera
   - Or click "Upload Photo" to select an image from your device

2. **Analyze**
   - Review the uploaded image
   - Click "Analyze" to process the meal

3. **View Results**
   - See individual food items with their nutritional values
   - Check the total macros summary at the top
   - Click "New" to analyze another meal

### Current Status

The app currently uses mock data for demonstration. To integrate with a real AI nutrition API:

1. Update the `apiEndpoint` variable in `src/pages/Index.tsx`
2. Uncomment the API integration code (lines 99-121)
3. Configure your API credentials

---

## 📁 Project Structure

```
eaten/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images and media files
│   ├── components/      # React components
│   │   ├── ui/          # shadcn/ui components
│   │   ├── FoodItemCard.tsx    # Individual food item display
│   │   └── TotalMacros.tsx     # Macro totals summary
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   ├── pages/           # Page components
│   │   ├── Index.tsx    # Main app page
│   │   └── NotFound.tsx # 404 page
│   ├── App.tsx          # App root component
│   └── main.tsx         # Entry point
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── tailwind.config.ts   # Tailwind configuration
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```

---

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally

### Code Style

The project uses:
- ESLint for code linting
- TypeScript for type safety
- Prettier-compatible formatting

### Adding New Components

shadcn/ui components can be added using:
```bash
npx shadcn-ui@latest add [component-name]
```

---

## 🎨 Customization

### Styling

The app uses a custom design system with:
- Glass morphism effects (`glass-card` classes)
- Custom color palette (defined in `src/index.css`)
- Responsive typography
- Custom animations

### Theme Colors

Colors can be customized in `src/index.css` by modifying CSS variables:
- `--primary`: Main brand color
- `--accent`: Accent highlights
- `--background`: Background color
- And more...

---

## 🔮 Future Enhancements

- [ ] Integrate with real AI nutrition API
- [ ] Add user authentication and meal history
- [ ] Implement meal tracking over time
- [ ] Add daily/weekly nutrition goals
- [ ] Export nutrition data as PDF/CSV
- [ ] Support multiple languages
- [ ] Add barcode scanning for packaged foods
- [ ] Implement recipe suggestions based on nutrition goals
- [ ] Add social sharing features
- [ ] Create mobile apps (iOS/Android)

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Write clean, readable code
- Follow the existing code style
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- Built with [Lovable](https://lovable.dev)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Fonts: Great Vibes & Satisfy from Google Fonts

---

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

Made with ❤️ for healthier eating habits
