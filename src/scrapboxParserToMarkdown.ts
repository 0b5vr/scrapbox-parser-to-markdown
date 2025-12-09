import { blockToMarkdown } from './blockToMarkdown';
import type { Block } from '@progfay/scrapbox-parser';
import type { ScrapboxParserToMarkdownOptions } from './ScrapboxParserToMarkdownOptions';

export function scrapboxParserToMarkdown(
  blocks: Block[],
  options: ScrapboxParserToMarkdownOptions = {},
): string {
  const delimiter = (options.strictLineBreaks ?? true) ? '  \n' : '\n';
  return blocks.map((block) => blockToMarkdown(block, options)).join(delimiter);
}
