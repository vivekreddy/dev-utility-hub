import { ReactNode } from 'react';
import { Link } from 'wouter';
import { Tool } from '@/types';
import { useFavorites } from '@/hooks/use-favorites';

interface ToolLayoutProps {
  tool: Tool;
  children: ReactNode;
}

export default function ToolLayout({ tool, children }: ToolLayoutProps) {
  const { id, name, description, icon, color } = tool;
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const bgColorClass = `bg-${color}-600/20`;
  const textColorClass = `text-${color}-500`;
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Tool Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center">
            <Link href="/" className="mr-3 p-2 rounded-lg hover:bg-surface-light inline-block">
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
                <path d="m15 18-6-6 6-6" />
              </svg>
            </Link>
            <div className={`w-10 h-10 flex items-center justify-center ${bgColorClass} rounded-lg mr-3`}>
              <i className={`${icon} ${textColorClass} text-xl`}></i>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{name}</h1>
              <p className="text-gray-400 text-sm">{description}</p>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <button 
            className={`p-2 rounded-lg bg-surface hover:bg-surface-light transition ${
              isFavorite(id) ? 'text-primary' : ''
            }`} 
            title={isFavorite(id) ? "Remove from favorites" : "Add to favorites"}
            onClick={() => toggleFavorite(id)}
          >
            <i className={`${isFavorite(id) ? 'ri-star-fill' : 'ri-star-line'}`}></i>
          </button>
          <button className="p-2 rounded-lg bg-surface hover:bg-surface-light transition" title="Share tool">
            <i className="ri-share-line"></i>
          </button>
        </div>
      </div>

      {/* Tool Content */}
      {children}
    </div>
  );
}
