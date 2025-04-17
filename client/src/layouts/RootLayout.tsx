import React, { ReactNode, useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'wouter';
import { toolCategories } from '@shared/schema';
import { searchTools } from '@/utils/tools';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const [location, setLocation] = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Create a state variable to hold the search results
  const [searchResults, setSearchResults] = useState<any[]>([]);
  
  // Effect to apply dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  
  // Handle search using URL params approach with useCallback for performance
  const handleSearch = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Use wouter's setLocation for client-side navigation
      setLocation(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  }, [searchQuery, setLocation]);
  
  // Handle search input change
  const handleSearchInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);
  
  // Handle sidebar toggle
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);
  
  // Handle dark mode toggle
  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);
  
  return (
    <div className="font-sans min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="bg-surface shadow-md z-10" aria-label="Main header">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-surface-light mr-2 transition"
                aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
                aria-expanded={isSidebarOpen}
              >
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
              <svg
                className="text-primary h-6 w-6 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
              <Link href="/" className="text-xl font-bold hover:text-primary transition">
                DevUtils
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <form className="relative" role="search" onSubmit={handleSearch}>
                <label htmlFor="search" className="sr-only">Search tools</label>
                <input 
                  type="search" 
                  id="search" 
                  placeholder="Search tools..."
                  className="bg-surface-light py-2 pl-10 pr-4 rounded-lg text-sm w-32 md:w-64 focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label="Search tools"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                />
                <button 
                  type="submit" 
                  className="absolute left-3 top-2.5"
                  aria-label="Submit search"
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
                    aria-hidden="true"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </button>
              </form>
              <Link
                href="/#favorites"
                className="p-2 rounded-lg bg-surface-light hover:bg-primary transition"
                aria-label="View favorites"
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
                  aria-hidden="true"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </Link>
              <button 
                className="p-2 rounded-lg bg-surface-light hover:bg-primary transition"
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                onClick={toggleDarkMode}
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
                    aria-hidden="true"
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
                    aria-hidden="true"
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

      {/* Main Content with Sidebar */}
      <div className="flex flex-1">
        {/* Left Sidebar Navigation */}
        <aside 
          className={`bg-surface w-64 shadow-lg fixed left-0 h-[calc(100vh-4rem)] top-16 z-10 transform transition-transform duration-300 overflow-y-auto ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 md:static md:h-[calc(100vh-4rem)] md:top-0 md:sticky`}
          aria-label="Sidebar navigation"
        >
          <div className="p-4">
            <nav>
              <ul className="space-y-2">
                <li>
                  <Link 
                    href="/" 
                    className={`flex items-center px-4 py-2 rounded-lg ${location === '/' ? 'bg-primary text-primary-foreground' : 'hover:bg-surface-light'} transition`}
                  >
                    <svg
                      className="h-5 w-5 mr-3"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    Home
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/#favorites" 
                    className="flex items-center px-4 py-2 rounded-lg hover:bg-surface-light transition"
                  >
                    <svg
                      className="h-5 w-5 mr-3"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                    Favorites
                  </Link>
                </li>
                <li className="pt-4">
                  <h2 className="px-4 text-xs uppercase tracking-wider font-semibold mb-2">Categories</h2>
                  <ul className="space-y-1">
                    {toolCategories.map((category) => (
                      <li key={category}>
                        <Link 
                          href={`/category/${encodeURIComponent(category)}`}
                          className={`w-full text-left flex items-center px-4 py-2 rounded-lg 
                            ${location.startsWith('/category/') && decodeURIComponent(location.substring(10)) === category 
                              ? 'bg-primary text-primary-foreground' 
                              : 'hover:bg-surface-light'} 
                            transition`}
                        >
                          {category}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="pt-4">
                  <h2 className="px-4 text-xs uppercase tracking-wider font-semibold mb-2">About</h2>
                  <ul className="space-y-1">
                    <li>
                      <Link 
                        href="/#about" 
                        className="flex items-center px-4 py-2 rounded-lg hover:bg-surface-light transition"
                      >
                        About DevUtils
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/#privacy" 
                        className="flex items-center px-4 py-2 rounded-lg hover:bg-surface-light transition"
                      >
                        Privacy
                      </Link>
                    </li>
                    <li>
                      <a 
                        href="https://github.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center px-4 py-2 rounded-lg hover:bg-surface-light transition"
                      >
                        <svg
                          className="h-5 w-5 mr-3"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                        </svg>
                        GitHub
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </aside>

        {/* Main content area */}
        <main className={`flex-grow transition-all duration-300 ${isSidebarOpen ? 'md:ml-0' : ''}`}>
          {/* Pass search query and results to children - with type casting for React component */}
          {children}
        </main>
      </div>

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
                aria-hidden="true"
              >
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
              <span className="text-lg font-semibold">DevUtils</span>
              <span className="text-sm ml-2">100 tools for developers</span>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/#about" className="hover:text-primary transition">About</Link>
              <Link href="/#privacy" className="hover:text-primary transition">Privacy</Link>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition">GitHub</a>
              <Link href="/#report" className="hover:text-primary transition">Report Issue</Link>
            </div>
          </div>
          <div className="mt-4 text-center text-sm">
            <p>© {new Date().getFullYear()} DevUtils. All tools work locally in your browser. No data is sent to our servers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
