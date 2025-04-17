import { useState } from 'react';
import { Link } from 'wouter';
import { Tool } from '@/types';
import { useFavorites } from '@/hooks/use-favorites';

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  const { id, name, description, path, icon, color } = tool;
  const { isFavorite, toggleFavorite } = useFavorites();
  
  // Handle favorite toggle separate from card click
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(id);
  };
  
  // Dynamic classes based on tool color
  const getIconColorClass = () => {
    const colorMap: Record<string, string> = {
      blue: 'text-blue-500',
      purple: 'text-purple-500',
      green: 'text-green-500',
      orange: 'text-orange-500',
      pink: 'text-pink-500',
      yellow: 'text-yellow-500',
      indigo: 'text-indigo-500',
      red: 'text-red-500',
      emerald: 'text-emerald-500',
      teal: 'text-teal-500',
      cyan: 'text-cyan-500',
      gray: 'text-gray-500',
      black: 'text-gray-900'
    };
    return colorMap[color] || 'text-gray-500';
  };
  
  const getBgColorClass = () => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-500/10',
      purple: 'bg-purple-500/10',
      green: 'bg-green-500/10',
      orange: 'bg-orange-500/10',
      pink: 'bg-pink-500/10',
      yellow: 'bg-yellow-500/10',
      indigo: 'bg-indigo-500/10',
      red: 'bg-red-500/10',
      emerald: 'bg-emerald-500/10',
      teal: 'bg-teal-500/10',
      cyan: 'bg-cyan-500/10',
      gray: 'bg-gray-500/10',
      black: 'bg-gray-900/10'
    };
    return colorMap[color] || 'bg-gray-500/10';
  };
  
  return (
    <div className="relative group">
      <Link href={path}>
        <div className="h-full tool-card flex flex-col bg-surface hover:bg-surface-light rounded-xl p-4 transition duration-200 ease-in-out focus-within:ring-2 focus-within:ring-primary">
          <div className="flex justify-between items-start mb-3">
            <div className={`w-10 h-10 flex items-center justify-center ${getBgColorClass()} rounded-lg`}>
              <i className={`${icon} ${getIconColorClass()} text-xl`} aria-hidden="true"></i>
            </div>
            <div className="w-6 h-6"></div> {/* Spacer for the favorite button */}
          </div>
          <div>
            <h3 className="font-semibold mb-1">{name}</h3>
            <p className="text-gray-400 text-sm">{description}</p>
          </div>
          <div className="mt-auto pt-2">
            <span className="inline-block text-xs bg-surface-light py-1 px-2 rounded-full text-gray-400">
              {tool.category}
            </span>
          </div>
        </div>
      </Link>
      <button 
        className={`${isFavorite(id) ? 'text-primary' : 'text-gray-400'} hover:text-primary absolute top-4 right-4 p-1`}
        aria-label={isFavorite(id) ? `Remove ${name} from favorites` : `Add ${name} to favorites`}
        onClick={handleFavoriteClick}
      >
        <i className={`${isFavorite(id) ? 'ri-star-fill' : 'ri-star-line'}`} aria-hidden="true"></i>
      </button>
    </div>
  );
}
