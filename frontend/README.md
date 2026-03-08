# Brian Dang - Portfolio Website

A modern, interactive portfolio website showcasing software engineering projects and skills. Built with React, Vite, and Framer Motion, featuring smooth animations, theme switching, and responsive design.

## ✨ Features

### 🎨 Interactive UI
- **3D Tilt Card Effects**: Custom-built flip cards with GPU-accelerated transforms for 60fps performance
- **Smooth Page Transitions**: Framer Motion animations for seamless navigation
- **Theme Toggle**: Light/Dark mode with persistent user preference
- **Responsive Design**: Optimized for all screen sizes and devices

### 🚀 Performance
- **Vite Build System**: Lightning-fast HMR and optimized production builds
- **GPU Acceleration**: CSS transforms using `will-change` and `transform3d`
- **Lazy Loading**: Images load on-demand for faster initial page load
- **Optimized Animations**: RAF-based updates and debounced event handlers

### ♿ Accessibility
- **Skip to Content**: Keyboard navigation support with skip link
- **ARIA Labels**: Semantic HTML with proper ARIA attributes
- **Focus Management**: Clear focus indicators for keyboard users
- **Error Boundary**: Graceful error handling with user-friendly messages

### 🔍 SEO Optimized
- **Dynamic Meta Tags**: Page-specific titles and descriptions
- **Open Graph Tags**: Rich social media previews
- **Sitemap & Robots.txt**: Search engine optimization
- **Semantic HTML**: Proper heading hierarchy and structure

### 📱 Pages
- **Home**: Hero section with interactive flip cards
- **Portfolio**: Project showcase with filterable cards
- **About**: Bio, skills grid, and contact form
- **404**: Custom error page

## 🛠️ Tech Stack

- **Frontend**: React 19.2.0
- **Build Tool**: Vite 8.0.0
- **Router**: React Router DOM 7.13.1
- **Animations**: Framer Motion 12.35.0
- **Icons**: Lucide React 0.577.0
- **Styling**: CSS3 with CSS Variables
- **Deployment**: GitHub Pages

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to GitHub Pages
npm run deploy
```

## ⚙️ Configuration

### Contact Form Setup

The contact form uses Web3Forms (free service). To enable it:

1. Go to [web3forms.com](https://web3forms.com/)
2. Create a free account and get your access key
3. Update the access key in `src/components/ContactForm.jsx`:

```javascript
access_key: 'YOUR_WEB3FORMS_ACCESS_KEY'
```

### Environment Variables

Create a `.env` file for custom configuration:

```env
VITE_BASE_URL=/
```

### Theme Customization

Edit CSS variables in `src/App.css`:

```css
:root {
  --bg-0: #0f141c;
  --text-main: #f2f3f4;
  /* ... more variables */
}
```

## 📁 Project Structure

```
frontend/
├── public/
│   ├── CNAME              # Custom domain configuration
│   ├── sitemap.xml        # SEO sitemap
│   └── robots.txt         # Search engine directives
├── src/
│   ├── assets/            # Images and static files
│   ├── components/
│   │   ├── ErrorBoundary.jsx
│   │   ├── SEO.jsx
│   │   ├── PageTransition.jsx
│   │   ├── ThemeToggle.jsx
│   │   ├── SkipToContent.jsx
│   │   ├── ContactForm.jsx
│   │   ├── SkillsGrid.jsx
│   │   ├── ProjectCard.jsx
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── tilt_flip_card/
│   │       └── TiltFlipCard.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Portfolio.jsx
│   │   └── About.jsx
│   ├── App.jsx            # Main app component
│   ├── App.css            # Global styles
│   └── main.jsx           # Entry point
└── package.json
```

## 🎯 Key Components

### TiltFlipCard
Interactive card with 3D tilt effect and flip animation. Optimized for performance with GPU acceleration.

### SEO
Dynamic meta tags component that updates page title, description, and Open Graph tags based on current route.

### PageTransition
Smooth fade and slide animations for route transitions using Framer Motion.

### ThemeToggle
Persistent theme switcher with light/dark modes stored in localStorage.

### SkillsGrid
Animated skill tags with stagger effect on scroll into view.

### ProjectCard
Portfolio project display with image, description, tech stack, and links.

### ContactForm
Functional contact form with validation and Web3Forms integration.

## 🚢 Deployment

The site is configured for GitHub Pages deployment:

```bash
npm run deploy
```

This will:
1. Build the production bundle
2. Deploy to the `gh-pages` branch
3. Update the live site at your configured domain

## 📝 License

Copyright © 2026 Brian Dang. All rights reserved.

## 🤝 Contact

- **Email**: briandang730@gmail.com
- **Phone**: (720) 546-4929
- **GitHub**: [BrianDang03](https://github.com/BrianDang03)
- **LinkedIn**: [brian-dang-b0a3a5256](https://www.linkedin.com/in/brian-dang-b0a3a5256/)

---

Built with ❤️ using React + Vite
