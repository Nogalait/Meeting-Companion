export interface ParsedResource {
  id: string;
  type: 'image' | 'link';
  title: string;
  url: string;
}

export function extractResources(markdown: string): ParsedResource[] {
  const resources: ParsedResource[] = [];
  
  // Regex to match images: ![alt](url)
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let match;
  let idCounter = 0;
  
  while ((match = imageRegex.exec(markdown)) !== null) {
    resources.push({
      id: `img-${idCounter++}`,
      type: 'image',
      title: match[1] || 'Untitled Image',
      url: match[2],
    });
  }
  
  // Regex to match links: [title](url) but NOT images
  const linkRegex = /(?<!!)\[([^\]]+)\]\(([^)]+)\)/g;
  while ((match = linkRegex.exec(markdown)) !== null) {
    // Only add if it's a valid URL or data URL
    if (match[2] && (match[2].startsWith('http') || match[2].startsWith('data:'))) {
      resources.push({
        id: `link-${idCounter++}`,
        type: 'link',
        title: match[1],
        url: match[2],
      });
    }
  }
  
  return resources;
}
