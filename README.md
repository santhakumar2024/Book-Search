# Book Finder - React Application

A modern web application that helps users search and discover books from the Open Library database. Built with React and styled with Tailwind CSS.

## 📋 Features

- **Multiple Search Options**: Search by book title, author name, or ISBN
- **Book Details**: View publication year, editions, ISBN, and language
- **Book Covers**: Display actual book cover images from Open Library
- **Favorites System**: Save your favorite books for quick access
- **Sorting**: Sort results by relevance or publication year
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Error Handling**: User-friendly error messages and loading states

## 🚀 Technologies Used

- **React 18**: Frontend framework with hooks for state management
- **Tailwind CSS**: Modern CSS utility framework for styling
- **Lucide React**: Beautiful SVG icons
- **Open Library API**: Free, no-authentication-required book database

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Step 1: Navigate to the project directory
```bash
cd BookFinder
```

### Step 2: Install dependencies
```bash
npm install
```

This will install:
- react
- react-dom
- lucide-react
- tailwindcss
- postcss
- autoprefixer

### Step 3: Start the development server
```bash
npm start
```

The application will open automatically in your browser at `http://localhost:3000`

## 🎯 How to Use

1. **Select Search Type**: Choose from "By Title", "By Author", or "By ISBN"
2. **Enter Search Query**: Type what you're looking for in the search box
3. **Click Search**: Press the "Search" button or hit Enter
4. **Browse Results**: View book cards with covers and details
5. **Save Favorites**: Click the heart icon to save books to your favorites
6. **View Favorites**: Toggle to "Favorites" button to see only saved books

## 📁 Project Structure

```
BookFinder/
├── public/
│   └── index.html              # HTML template
├── src/
│   ├── App.jsx                 # Main App component
│   ├── App.css                 # Component styling
│   ├── index.js                # React entry point
│   └── index.css               # Global styles
├── package.json                # Dependencies and scripts
├── tailwind.config.js          # Tailwind configuration
├── postcss.config.js           # PostCSS configuration
├── .gitignore                  # Git ignore rules
└── README.md                   # This file
```

## 🔌 API Information

**API**: Open Library Search API
- **Endpoint**: `https://openlibrary.org/search.json`
- **Authentication**: None required
- **Rate Limit**: Generous (no strict limits for reasonable usage)

### API Parameters
- `title`: Search by book title
- `author`: Search by author name
- `isbn`: Search by ISBN number
- `limit`: Number of results (default: 100, we use 20)

### Example Requests
```
https://openlibrary.org/search.json?title=Harry%20Potter&limit=20
https://openlibrary.org/search.json?author=J.K.%20Rowling&limit=20
https://openlibrary.org/search.json?isbn=9780439136960&limit=20
```

## 🎨 Customization

### Change Colors
Edit the Tailwind CSS classes in `src/App.jsx`:
- `from-indigo-600` - Header start color
- `to-blue-600` - Header end color
- `text-indigo-600` - Link color

### Add More Search Options
Modify the `searchBooks()` function in `src/App.jsx` to add new search parameters.

### Adjust Results Per Page
Change `&limit=20` in the API URLs to show more/fewer results.

## 📱 Responsive Design

The app is fully responsive:
- **Mobile**: Single column layout
- **Tablet**: Two column layout
- **Desktop**: Three column layout

## 🐛 Troubleshooting

### Port 3000 is already in use
```bash
npm start -- --port 3001
```

### Module not found errors
```bash
npm install
```

### Tailwind CSS not loading
```bash
npm run build
```

## 🚢 Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## 🌐 Deployment Options

### Deploy to Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
1. Build the project: `npm run build`
2. Drag and drop the `build` folder to [Netlify](https://netlify.com)

### Deploy to GitHub Pages
Update `package.json`:
```json
"homepage": "https://yourusername.github.io/book-finder"
```

Then run:
```bash
npm install --save-dev gh-pages
npm run build
npx gh-pages -d build
```

## 📝 Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Runs the test suite
- `npm run eject` - Ejects from Create React App (not reversible)

## 🔒 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

This project is open source and available for educational purposes.

## 🙋 Support

If you encounter any issues:
1. Check the browser console for error messages
2. Ensure Node.js is properly installed
3. Try deleting `node_modules` and running `npm install` again
4. Clear browser cache and restart the development server

## 🚀 Future Enhancements

- User authentication for cloud-synced favorites
- Advanced filters (publication date range, language)
- Reading lists and personal reviews
- Integration with library systems
- Book recommendations
- Social sharing features

## 👨‍💻 Development Notes

This application uses:
- React Hooks for state management (no Redux needed)
- Tailwind CSS for styling (no component library)
- Modern JavaScript (ES6+)
- Async/await for API calls

---

**Created for**: Book Finder Project
**Status**: ✅ Production Ready
**Last Updated**: 2024
