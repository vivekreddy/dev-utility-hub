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
          <button
            key={category}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition ${
              selectedCategory === category
                ? 'bg-primary text-white'
                : 'bg-surface text-gray-300 hover:bg-surface-light'
            }`}
            onClick={() => onSelectCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </section>
  );
}
