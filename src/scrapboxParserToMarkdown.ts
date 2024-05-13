import { blockToMarkdown } from './blockToMarkdown';
import type { Block } from '@progfay/scrapbox-parser';
import type { ScrapboxParserToMarkdownOptions } from './ScrapboxParserToMarkdownOptions';

export function scrapboxParserToMarkdown(
  blocks: Block[],
  options: ScrapboxParserToMarkdownOptions = {},
): string {
  return blocks.map((block) => blockToMarkdown(block, options)).join('  \n');
}
