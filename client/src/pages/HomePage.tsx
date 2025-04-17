import { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import CategoryFilter from '@/components/CategoryFilter';
import ToolGrid from '@/components/ToolGrid';
import { getAllTools, searchTools, getToolsByCategory } from '@/utils/tools';
import { ToolCategory, Tool } from '@/types';
import { toolCategories } from '@shared/schema';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('All Tools');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTools, setFilteredTools] = useState(getAllTools());
  
  // Check for category in the URL path using wouter's useRoute
  const [isCategoryRoute, params] = useRoute('/category/:category');
  
  // Update filtered tools when category or search query changes
  useEffect(() => {
    // Filter by category
    let result = selectedCategory === 'All Tools' 
      ? getAllTools()
      : getToolsByCategory(selectedCategory);
    
    // Apply search filter if needed
    if (searchQuery) {
      result = result.filter(tool => 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredTools(result);
  }, [selectedCategory, searchQuery]);
  
  // Get search input and category from URL (both path params and query params)
  useEffect(() => {
    // First check path parameter (from useRoute)
    if (isCategoryRoute && params && params.category) {
      const decodedCategory = decodeURIComponent(params.category);
      if (toolCategories.includes(decodedCategory as ToolCategory)) {
        setSelectedCategory(decodedCategory as ToolCategory);
      }
    } else {
      // Fall back to query parameters
      const queryParams = new URLSearchParams(window.location.search);
      
      // Handle search query parameter
      const q = queryParams.get('q');
      if (q) {
        setSearchQuery(q);
      }
      
      // Handle category parameter in query string
      const category = queryParams.get('category');
      if (category && toolCategories.includes(category as ToolCategory)) {
        setSelectedCategory(category as ToolCategory);
      }
    }
  }, [isCategoryRoute, params]);
  
  // Display title based on whether we're showing search results or category
  const getPageTitle = () => {
    if (searchQuery) {
      return `Search results for "${searchQuery}"`;
    }
    return selectedCategory;
  };
  
  return (
    <div className="p-6 md:p-8">
      <section className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Developer Tools</h1>
        <p>100 essential utilities for your daily development workflow</p>
      </section>
      
      <div className="md:hidden mb-8">
        <CategoryFilter 
          selectedCategory={selectedCategory} 
          onSelectCategory={setSelectedCategory} 
        />
      </div>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{getPageTitle()}</h2>
          <div className="text-sm">{filteredTools.length} tools</div>
        </div>
        
        <ToolGrid tools={filteredTools} />
      </div>
    </div>
  );
}
