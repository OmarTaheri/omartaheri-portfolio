import { Fragment, type ReactNode } from "react";

type MarkdownBlock =
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "list"; items: string[] }
  | { type: "paragraph"; text: string };

function parseMarkdown(markdown: string): MarkdownBlock[] {
  const lines = markdown.trim().split(/\r?\n/);
  const blocks: MarkdownBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index]?.trim() ?? "";

    if (!line) {
      index += 1;
      continue;
    }

    const heading = /^(#{2,3})\s+(.+)$/.exec(line);
    if (heading) {
      blocks.push({
        type: "heading",
        level: heading[1].length as 2 | 3,
        text: heading[2],
      });
      index += 1;
      continue;
    }

    if (line.startsWith("- ")) {
      const items: string[] = [];
      while ((lines[index]?.trim() ?? "").startsWith("- ")) {
        items.push((lines[index]?.trim() ?? "").slice(2));
        index += 1;
      }
      blocks.push({ type: "list", items });
      continue;
    }

    const paragraph: string[] = [];
    while (index < lines.length) {
      const paragraphLine = lines[index]?.trim() ?? "";
      if (
        !paragraphLine ||
        /^(#{2,3})\s+/.test(paragraphLine) ||
        paragraphLine.startsWith("- ")
      ) {
        break;
      }
      paragraph.push(paragraphLine);
      index += 1;
    }
    blocks.push({ type: "paragraph", text: paragraph.join(" ") });
  }

  return blocks;
}

function renderInlineMarkdown(text: string): ReactNode[] {
  const tokens: ReactNode[] = [];
  const pattern = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|\*\*([^*]+)\*\*/g;
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > cursor) tokens.push(text.slice(cursor, match.index));

    if (match[1] && match[2]) {
      tokens.push(
        <a key={`${match.index}-${match[2]}`} href={match[2]} target="_blank" rel="noreferrer">
          {match[1]}
        </a>,
      );
    } else if (match[3]) {
      tokens.push(<strong key={`${match.index}-strong`}>{match[3]}</strong>);
    }

    cursor = pattern.lastIndex;
  }

  if (cursor < text.length) tokens.push(text.slice(cursor));
  return tokens;
}

export function MarkdownContent({
  markdown,
  afterFirstHeading,
}: {
  markdown: string;
  afterFirstHeading?: ReactNode;
}) {
  const blocks = parseMarkdown(markdown);

  return (
    <div className="project-markdown">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          return (
            <Fragment key={`${block.text}-${index}`}>
              {block.level === 2 ? (
                <h2>{block.text}</h2>
              ) : (
                <h3>{block.text}</h3>
              )}
              {index === 0 ? afterFirstHeading : null}
            </Fragment>
          );
        }

        if (block.type === "list") {
          return (
            <ul key={`list-${index}`}>
              {block.items.map((item) => (
                <li key={item}>{renderInlineMarkdown(item)}</li>
              ))}
            </ul>
          );
        }

        return <p key={`paragraph-${index}`}>{renderInlineMarkdown(block.text)}</p>;
      })}
    </div>
  );
}
