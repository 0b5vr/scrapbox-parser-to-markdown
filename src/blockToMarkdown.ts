import { nodeToMarkdown } from './nodeToMarkdown';
import type { Block, CodeBlock, Line, Table, Title } from '@progfay/scrapbox-parser';
import type { ScrapboxParserToMarkdownOptions } from './ScrapboxParserToMarkdownOptions';

function indentToLi(indent: number, options: ScrapboxParserToMarkdownOptions = {}): string {
  if (indent < 1) {
    return '';
  } else {
    const whitespace = options.indentStyle === 'tab'
      ? '\t'
      : ' '.repeat(options.indentSize ?? 2);
    const bullet = options.listBullet ?? '-';
    return whitespace.repeat(indent - 1) + bullet + ' ';
  }
}

function titleBlockToMarkdown(block: Title, options: ScrapboxParserToMarkdownOptions = {}): string {
  const custom = options.titleHandler?.(block);
  if (custom != null) {
    return custom;
  }

  return `# ${block.text}`;
}

function lineBlockToMarkdown(block: Line, options: ScrapboxParserToMarkdownOptions = {}): string {
  const text = block.nodes.map((node) => nodeToMarkdown(node, options)).join('');
  return indentToLi(block.indent, options) + text;
}

function codeBlockToMarkdown(block: CodeBlock, options: ScrapboxParserToMarkdownOptions = {}): string {
  const custom = options.codeBlockHandler?.(block);
  if (custom != null) {
    return custom;
  }

  let lang = options.codeLangHandler
    ? options.codeLangHandler(block)
    : null;

  if (lang == null) {
    const splitted = block.fileName.split('.');
    lang = splitted[splitted.length - 1];
  }

  return '```' + lang + '\n' + block.content + '\n```';
}

function tableBlockToMarkdown(block: Table, options: ScrapboxParserToMarkdownOptions = {}): string {
  if (block.cells.length === 0) {
    console.warn(`invalid table "${block.fileName}": no rows`);
    return '';
  }

  const lines = block.cells.map((cols) => {
    const nodes = cols.map((cell) => cell.map(
      (node) => nodeToMarkdown(node, options)).join('')
    );
    return '|' + nodes.join('|') + '|';
  });

  lines.splice(1, 0, '|:-'.repeat(block.cells[0].length) + '|');
  return lines.join('\n');
}

export function blockToMarkdown(block: Block, options: ScrapboxParserToMarkdownOptions = {}): string {
  if (block.type === 'title') {
    return titleBlockToMarkdown(block, options);
  } else if (block.type === 'line') {
    return lineBlockToMarkdown(block, options);
  } else if (block.type === 'codeBlock') {
    return codeBlockToMarkdown(block, options);
  } else if (block.type === 'table') {
    return tableBlockToMarkdown(block, options);
  } else {
    console.warn(`Unknown block type: "${(block as any).type}"`);
    return '';
  }
}
