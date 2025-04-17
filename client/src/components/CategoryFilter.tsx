import { Link } from 'wouter';
import { ToolCategory } from '@/types';
import { toolCategories } from '@shared/schema';

interface CategoryFilterProps {
  selectedCategory: ToolCategory;
  onSelectCategory: (category: ToolCategory) => void;
}

export default function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <section className="mb-8">
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 custom-scrollbar">
        {toolCategories.map((category) => (
          <Link
            key={category}
            href={category === 'All Tools' ? '/' : `/category/${encodeURIComponent(category)}`}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition ${
              selectedCategory === category
                ? 'bg-primary text-white'
                : 'bg-surface text-gray-300 hover:bg-surface-light'
            }`}
            onClick={(e) => {
              // We still want to update the state locally for immediate UI updates
              onSelectCategory(category);
            }}
          >
            {category}
          </Link>
        ))}
      </div>
    </section>
  );
}
