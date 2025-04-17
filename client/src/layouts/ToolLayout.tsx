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
  
  // Get color classes using a function instead of string interpolation
  const getColorClasses = () => {
    const colorMap = {
      blue: { bg: 'bg-blue-500/10', text: 'text-blue-500' },
      purple: { bg: 'bg-purple-500/10', text: 'text-purple-500' },
      green: { bg: 'bg-green-500/10', text: 'text-green-500' },
      orange: { bg: 'bg-orange-500/10', text: 'text-orange-500' },
      pink: { bg: 'bg-pink-500/10', text: 'text-pink-500' },
      yellow: { bg: 'bg-yellow-500/10', text: 'text-yellow-500' },
      indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-500' },
      red: { bg: 'bg-red-500/10', text: 'text-red-500' },
      emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-500' },
      teal: { bg: 'bg-teal-500/10', text: 'text-teal-500' },
      cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-500' },
      gray: { bg: 'bg-gray-500/10', text: 'text-gray-500' },
      black: { bg: 'bg-gray-900/10', text: 'text-gray-900' }
    };
    return colorMap[color as keyof typeof colorMap] || { bg: 'bg-gray-500/10', text: 'text-gray-500' };
  };
  
  const { bg: bgColorClass, text: textColorClass } = getColorClasses();
  
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
