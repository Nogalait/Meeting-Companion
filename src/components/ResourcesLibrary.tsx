import React, { useMemo } from 'react';
import { extractResources } from '../utils/markdownUtils';
import { Link2, Image as ImageIcon, ExternalLink } from 'lucide-react';

interface ResourcesLibraryProps {
  markdown: string;
}

export function ResourcesLibrary({ markdown }: ResourcesLibraryProps) {
  const resources = useMemo(() => extractResources(markdown), [markdown]);

  if (resources.length === 0) return null;

  return (
    <div className="mt-8 border border-zinc-200 rounded-xl overflow-hidden bg-white shadow-sm">
      <div className="px-4 py-3 bg-zinc-50 border-b border-zinc-200">
        <h3 className="text-sm font-semibold text-zinc-800">Resources Library</h3>
        <p className="text-xs text-zinc-500 mt-0.5">Links and images automatically extracted from your agenda notes.</p>
      </div>
      <div className="divide-y divide-zinc-100 max-h-[300px] overflow-y-auto">
        {resources.map((resource) => (
          <div key={resource.id} className="flex items-center justify-between px-4 py-3 hover:bg-zinc-50 transition-colors">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="flex-none p-2 bg-zinc-100 rounded-md text-zinc-500">
                {resource.type === 'image' ? <ImageIcon className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-zinc-800 truncate">{resource.title}</p>
                <p className="text-xs text-zinc-400 truncate mt-0.5">
                  {resource.url.startsWith('data:') ? 'Pasted Image Data' : resource.url}
                </p>
              </div>
            </div>
            <a 
              href={resource.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex-none ml-4 p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              title="Open link"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
