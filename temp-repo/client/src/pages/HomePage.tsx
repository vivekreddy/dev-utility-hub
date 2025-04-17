import { useState } from 'react';
import CategoryFilter from '@/components/CategoryFilter';
import ToolGrid from '@/components/ToolGrid';
import { getAllTools } from '@/utils/tools';
import { ToolCategory } from '@/types';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('All Tools');
  const [searchQuery, setSearchQuery] = useState('');
  
  const allTools = getAllTools();
  
  const filteredTools = allTools.filter(tool => {
    const matchesCategory = selectedCategory === 'All Tools' || tool.category === selectedCategory;
    const matchesSearch = 
      searchQuery === '' || 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Developer Tools</h1>
        <p className="text-gray-400">100 essential utilities for your daily development workflow</p>
      </section>
      
      <CategoryFilter 
        selectedCategory={selectedCategory} 
        onSelectCategory={setSelectedCategory} 
      />
      
      <ToolGrid tools={filteredTools} />
    </div>
  );
}
