# Actually.Studz 🤓

A study companion that turns any topic or PDF into clean notes, quizzes, and flashcards. Designed with principles of academic excellence — focused, clear, and a little playful.

## Features

✨ **Study Material Generation**
- 📝 Generate comprehensive notes from PDFs or topics
- ❓ Create interactive quizzes with multiple question types
- 🎴 Build flashcard decks for effective memorization

🎨 **Customizable Experience**
- 🌓 Dark mode support with black theme
- ⚙️ User preferences and settings
- 🔐 Secure authentication with Supabase

💾 **Save & Organize**
- Save quizzes for later review
- Track your study progress
- Organize materials by topic

## Tech Stack

- **Frontend:** React, TypeScript, TanStack Router
- **Styling:** Tailwind CSS with Radix UI components
- **Backend:** TanStack Start (Full-stack framework)
- **Database:** Supabase (PostgreSQL)
- **AI:** Google Generative AI (Gemini)
- **Build Tool:** Vite with Cloudflare deployment

## Getting Started

### Prerequisites
- Node.js (v18+)
- Bun or npm
- Supabase account
- Google Generative AI API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/DeanL69/actually.studz.git
cd actually.studz
```

2. Install dependencies
```bash
npm install
# or
bun install
```

3. Set up environment variables
Create a `.env.local` file in the root directory:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GROQ_API_KEY=your_groq_api_key
```

4. Run database migrations
Execute the SQL migrations in your Supabase dashboard:
- Navigate to SQL Editor
- Run `supabase/migrations/20260515_add_user_id_columns.sql`
- Run `supabase/migrations/20260515_create_saved_quizzes_table.sql`

5. Start development server
```bash
npm run dev
# or
bun dev
```

Visit `http://localhost:5173` to access the app.

## Project Structure

```
src/
├── routes/              # TanStack Router pages
│   ├── __root.tsx      # Root layout with dark mode support
│   ├── about.tsx       # About page
│   ├── settings.tsx    # User settings & dark mode toggle
│   ├── content.$id.tsx # Study materials viewer with quiz/notes
│   └── ...
├── components/         # Reusable UI components
│   ├── AppHeader.tsx
│   ├── ProtectedRoute.tsx
│   └── ui/             # Shadcn/Radix UI components
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state
├── lib/                # Utilities & helpers
│   ├── supabaseClient.ts
│   ├── gemini.ts      # AI integration
│   └── utils.ts
└── styles.css          # Global styles with CSS variables

supabase/
└── migrations/         # Database schema migrations
    ├── 20260515_add_user_id_columns.sql
    └── 20260515_create_saved_quizzes_table.sql
```

## Key Features Explained

### Dark Mode
Users can toggle dark mode in Settings. The preference is persisted in localStorage and applied on page load with a black background and yellow accents.

### Quiz Saving
Users can save quizzes they've taken. The quiz data (questions, answers, user responses) is stored in the `saved_quizzes` table with proper user authentication and Row Level Security policies.

### Authentication
The app uses Supabase Auth for secure user management. All data is protected with RLS policies ensuring users only see their own materials.

### AI-Powered Content
Integration with Google Generative AI for generating study materials. Process PDFs and text to create:
- Structured notes with key concepts
- Multiple choice, true/false, and short answer quizzes
- Interactive flashcard sets

## Building for Production

```bash
npm run build
# or
bun build
```

The app is configured for Cloudflare deployment using the @cloudflare/vite-plugin.

## Error Handling & Debugging

The app includes enhanced error logging:
- Console error details for debugging
- User-friendly toast notifications
- Supabase error code logging for database issues

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Test thoroughly
4. Commit with clear messages
5. Push and create a pull request

## License

MIT License - feel free to use this project for your own study needs!

## Support

If you encounter any issues:
1. Check the browser console for detailed error messages
2. Verify your Supabase credentials in `.env.local`
3. Ensure all database migrations have been applied
4. Check that your API keys are valid

---

Built with ❤️ for students everywhere
