import { Tool } from '@/types';
import ToolCard from './ToolCard';

interface ToolGridProps {
  tools: Tool[];
}

export default function ToolGrid({ tools }: ToolGridProps) {
  if (tools.length === 0) {
    return (
      <section aria-label="No tools found">
        <div className="bg-surface rounded-xl p-8 text-center">
          <p className="text-gray-400">No tools found matching your criteria.</p>
        </div>
      </section>
    );
  }
  
  return (
    <section aria-label={`Showing ${tools.length} developer tools`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tools.map((tool) => (
          <div key={tool.id} className="h-full">
            <ToolCard tool={tool} />
          </div>
        ))}
      </div>
    </section>
  );
}
