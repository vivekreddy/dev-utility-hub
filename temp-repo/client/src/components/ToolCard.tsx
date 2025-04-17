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
  
  const bgColorClass = `bg-${color}-600/20`;
  const textColorClass = `text-${color}-500`;
  
  // Handle favorite toggle separate from card click
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(id);
  };
  
  return (
    <div className="relative">
      <Link href={path} className="tool-card block bg-surface hover:bg-surface-light rounded-xl p-4 transition duration-200 ease-in-out">
        <div className="flex justify-between items-start mb-3">
          <div className={`w-10 h-10 flex items-center justify-center ${bgColorClass} rounded-lg`}>
            <i className={`${icon} ${textColorClass} text-xl`}></i>
          </div>
          <div className="w-6 h-6"></div> {/* Spacer for the favorite button */}
        </div>
        <h3 className="font-semibold mb-1">{name}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
      </Link>
      <button 
        className={`${isFavorite(id) ? 'text-primary' : 'text-gray-400'} hover:text-primary absolute top-4 right-4`} 
        title={isFavorite(id) ? "Remove from favorites" : "Add to favorites"}
        onClick={handleFavoriteClick}
      >
        <i className={`${isFavorite(id) ? 'ri-star-fill' : 'ri-star-line'}`}></i>
      </button>
    </div>
  );
}
