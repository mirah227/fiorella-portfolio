import React from 'react';

interface RichContentRendererProps {
  content: string;
}

export const RichContentRenderer: React.FC<RichContentRendererProps> = ({ content }) => {
  if (!content) return null;

  // Split into structural blocks separated by double newlines or single newlines where appropriate
  const blocks = content.split(/\n\s*\n/);

  const renderInlineFormatted = (text: string): React.ReactNode[] => {
    // Process markdown links [text](url), bold **text**, italic *text*, code `code`
    const regex = /(\[.*?\]\(.*?\)|\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
    const parts = text.split(regex);

    return parts.map((part, index) => {
      // Markdown link [text](url)
      const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
      if (linkMatch) {
        return (
          <a
            key={index}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-black dark:text-white underline font-bold hover:opacity-80 transition-opacity"
          >
            {linkMatch[1]}
          </a>
        );
      }

      // Bold **text**
      const boldMatch = part.match(/^\*\*(.*?)\*\*$/);
      if (boldMatch) {
        return <strong key={index} className="font-extrabold text-[#1a1a1a] dark:text-white">{boldMatch[1]}</strong>;
      }

      // Italic *text*
      const italicMatch = part.match(/^\*(.*?)\*$/);
      if (italicMatch) {
        return <em key={index} className="italic text-[#262626] dark:text-neutral-200">{italicMatch[1]}</em>;
      }

      // Inline code `code`
      const codeMatch = part.match(/^`(.*?)`$/);
      if (codeMatch) {
        return (
          <code
            key={index}
            className="px-1.5 py-0.5 rounded bg-[#f4f4f4] dark:bg-[#202020] text-xs font-mono text-black dark:text-white border border-[#e5e5e5] dark:border-[#333333]"
          >
            {codeMatch[1]}
          </code>
        );
      }

      return part;
    });
  };

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none space-y-5 text-[#2d2d2d] dark:text-[#d4d4d4] leading-relaxed">
      {blocks.map((block, idx) => {
        const trimmed = block.trim();

        if (!trimmed) return null;

        // Heading 1 / 2 (## Heading)
        if (trimmed.startsWith('## ')) {
          return (
            <h2
              key={idx}
              className="text-2xl sm:text-3xl font-black text-[#1a1a1a] dark:text-white tracking-tight pt-6 pb-2 border-b border-[#e5e5e5] dark:border-[#262626]"
            >
              {renderInlineFormatted(trimmed.replace(/^##\s+/, ''))}
            </h2>
          );
        }

        // Heading 3 (### Heading)
        if (trimmed.startsWith('### ')) {
          return (
            <h3
              key={idx}
              className="text-xl sm:text-2xl font-black text-[#1a1a1a] dark:text-white tracking-tight pt-4 pb-1"
            >
              {renderInlineFormatted(trimmed.replace(/^###\s+/, ''))}
            </h3>
          );
        }

        // Heading 4 (#### Heading)
        if (trimmed.startsWith('#### ')) {
          return (
            <h4
              key={idx}
              className="text-base sm:text-lg font-bold text-[#1a1a1a] dark:text-white uppercase tracking-wider pt-3"
            >
              {renderInlineFormatted(trimmed.replace(/^####\s+/, ''))}
            </h4>
          );
        }

        // Blockquote (> Quote)
        if (trimmed.startsWith('>')) {
          const quoteLines = trimmed
            .split('\n')
            .map((line) => line.replace(/^>\s*/, ''))
            .join(' ');

          return (
            <blockquote
              key={idx}
              className="my-6 pl-5 py-3 border-l-4 border-black dark:border-white bg-[#f8f8f8] dark:bg-[#161616] rounded-r-xl italic text-base sm:text-lg text-[#1a1a1a] dark:text-white font-medium"
            >
              {renderInlineFormatted(quoteLines)}
            </blockquote>
          );
        }

        // Image ![alt](url)
        const imageMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
        if (imageMatch) {
          const altText = imageMatch[1] || 'SEO Article visual';
          const srcUrl = imageMatch[2];
          return (
            <figure key={idx} className="my-8 rounded-2xl overflow-hidden border border-[#e5e5e5] dark:border-[#262626] bg-[#f8f8f8] dark:bg-[#141414]">
              <img
                src={srcUrl}
                alt={altText}
                loading="lazy"
                decoding="async"
                className="w-full h-auto max-h-[500px] object-cover"
              />
              {altText && (
                <figcaption className="text-center text-xs text-[#666666] dark:text-[#a3a3a3] py-2 px-4 italic border-t border-[#e5e5e5] dark:border-[#262626]">
                  {altText}
                </figcaption>
              )}
            </figure>
          );
        }

        // Unordered List (- item or * item)
        if (trimmed.split('\n').every((l) => l.trim().startsWith('- ') || l.trim().startsWith('* '))) {
          const items = trimmed.split('\n').map((l) => l.trim().replace(/^[-*]\s+/, ''));
          return (
            <ul key={idx} className="space-y-2.5 my-5 pl-2">
              {items.map((item, itemIdx) => (
                <li key={itemIdx} className="flex items-start gap-3 text-sm sm:text-base">
                  <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white shrink-0 mt-2.5" />
                  <span className="flex-1">{renderInlineFormatted(item)}</span>
                </li>
              ))}
            </ul>
          );
        }

        // Ordered List (1. item, 2. item)
        if (trimmed.split('\n').every((l) => /^\d+\.\s+/.test(l.trim()))) {
          const items = trimmed.split('\n').map((l) => l.trim().replace(/^\d+\.\s+/, ''));
          return (
            <ol key={idx} className="space-y-2.5 my-5 pl-1">
              {items.map((item, itemIdx) => (
                <li key={itemIdx} className="flex items-start gap-3 text-sm sm:text-base">
                  <span className="font-mono text-xs font-bold text-black dark:text-white bg-[#f0f0f0] dark:bg-[#202020] border border-[#e5e5e5] dark:border-[#333333] w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5">
                    {itemIdx + 1}
                  </span>
                  <span className="flex-1">{renderInlineFormatted(item)}</span>
                </li>
              ))}
            </ol>
          );
        }

        // Normal paragraph (supporting line breaks within the block)
        const lines = trimmed.split('\n');
        return (
          <p key={idx} className="text-sm sm:text-base text-[#333333] dark:text-[#cccccc] leading-relaxed">
            {lines.map((line, lIdx) => (
              <React.Fragment key={lIdx}>
                {renderInlineFormatted(line)}
                {lIdx < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
};
