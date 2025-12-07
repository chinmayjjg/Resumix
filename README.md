# Resumix: Your Resume, Reimagined

> **Turn your boring PDF resume into a stunning, shareable portfolio website in seconds.**

Resumix bridges the gap between a static PDF and a dynamic professional presence. Stop coding your personal site from scratch every time you update your resume. Just upload, preview, and share.

## What is this?

**Resumix** is a modern portfolio builder built for developers and professionals who want a polished online presence without the hassle. It parses your existing PDF resume, extracts the key details (Experience, Skills, Projects), and instantly renders them into beautiful, responsive web templates.

It's not just a parser—it's a **What You See Is What You Get (WYSIWYG)** experience. You can flip through different design themes in real-time to find the one that fits your vibe, then tweak the content in our built-in editor.

## Key Features

- **Instant PDF Extraction**: We use advanced parsing logic to pull your name, contacts, skills, and history directly from your uploaded PDF.
- **Live Theme Previews**: Don't guess what your site will look like. See your actual data rendered in **5+ premium themes** (Modern, Tech, Minimal, Creative, Professional) simultaneously.
- **Visual Builder**: Edit your bio, rearrange your projects, or fix that typo in your experience using our clean dashboard interface.
- **Dark Mode**: Built-in support for light and dark themes because we know how important eye comfort (and aesthetics) are.
- **Fully Responsive**: All templates are mobile-first, ensuring you look great on phones, tablets, and desktops.

## The Tech Stack

We built Resumix using a modern, type-safe stack designed for performance and developer experience:

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (via Mongoose)
- **PDF Parsing**: Custom `pdf2json` implementation
- **Deployment**: Optimized for Vercel

## Getting Started

Want to run this locally? Here is how you can get up and running 5 minutes or less.

### Prerequisites
- Node.js 18+
- MongoDB Database (Local or Atlas)

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/resumix.git
cd resumix
npm install
```

### 2. Set up Environment
Create a `.env` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
```

### 3. Run It!
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) and start building!

## Project Structure

- `src/app`: Next.js App Router pages (Dashboard, Auth, Public Portfolio).
- `src/components/portfolio`: The heart of the app. Contains the `ThemePreviewGrid` and all `templates`.
- `src/lib`: Utility functions, including the PDF parsing logic (`transformResumeData.ts`) and DB connection.
- `src/models`: Mongoose schemas.

---

*Built with ❤️ and a lot of coffee.*
