import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'wouter';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const [location] = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <div className="font-sans min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="bg-surface shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg
                className="text-primary h-6 w-6 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
              <Link href="/" className="text-xl font-bold text-white hover:text-primary transition">
                DevUtils
              </Link>
              <div className="ml-6 hidden md:flex space-x-4">
                <Link href="/" className={`${location === '/' ? 'text-white' : 'text-gray-400'} hover:text-primary transition font-medium`}>
                  Home
                </Link>
                <Link href="/#categories" className="text-gray-400 hover:text-primary transition">
                  Categories
                </Link>
                <Link href="/#favorites" className="text-gray-400 hover:text-primary transition">
                  Favorites
                </Link>
                <Link href="/#about" className="text-gray-400 hover:text-primary transition">
                  About
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <input 
                  type="text" 
                  id="search" 
                  placeholder="Search tools..."
                  className="bg-surface-light text-white py-2 pl-10 pr-4 rounded-lg text-sm w-32 md:w-64 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <svg
                  className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
              <button 
                className="p-2 rounded-lg bg-surface-light hover:bg-primary transition text-white" 
                title="Toggle favorites"
              >
                <svg
                  className="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </button>
              <button 
                className="p-2 rounded-lg bg-surface-light hover:bg-primary transition text-white" 
                title="Toggle theme"
                onClick={() => setIsDarkMode(!isDarkMode)}
              >
                {isDarkMode ? (
                  <svg
                    className="h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                  </svg>
                ) : (
                  <svg
                    className="h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2" />
                    <path d="M12 20v2" />
                    <path d="m4.93 4.93 1.41 1.41" />
                    <path d="m17.66 17.66 1.41 1.41" />
                    <path d="M2 12h2" />
                    <path d="M20 12h2" />
                    <path d="m6.34 17.66-1.41 1.41" />
                    <path d="m19.07 4.93-1.41 1.41" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-surface mt-auto py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <svg
                className="text-primary h-6 w-6 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
              <span className="text-lg font-semibold">DevUtils</span>
              <span className="text-gray-400 text-sm ml-2">100 tools for developers</span>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#about" className="text-gray-400 hover:text-primary transition">About</a>
              <a href="#privacy" className="text-gray-400 hover:text-primary transition">Privacy</a>
              <a href="https://github.com" className="text-gray-400 hover:text-primary transition">GitHub</a>
              <a href="#report" className="text-gray-400 hover:text-primary transition">Report Issue</a>
            </div>
          </div>
          <div className="mt-4 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} DevUtils. All tools work locally in your browser. No data is sent to our servers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
