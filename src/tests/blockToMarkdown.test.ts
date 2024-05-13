import { parse } from '@progfay/scrapbox-parser';
import { blockToMarkdown } from '../blockToMarkdown';
import type { ScrapboxParserToMarkdownOptions } from '../ScrapboxParserToMarkdownOptions';
import type { Block } from '@progfay/scrapbox-parser';

function parseAndGetFirstBlock(text: string): Block {
  return parse(text, { hasTitle: false })[0];
}

describe('blockToMarkdown', () => {
  // -- title block --------------------------------------------------------------------------------
  it('converts title block to markdown', () => {
    const input = parse('タイトル')[0];
    const expected = '# タイトル';
    expect(blockToMarkdown(input)).toBe(expected);
  });

  it('converts title block to markdown with titleHandler', () => {
    const input = parse('タイトル')[0];
    const expected = '# `-=-=- タイトル -=-=-`';
    const options: ScrapboxParserToMarkdownOptions = {
      titleHandler: ({ text }) => `# \`-=-=- ${text} -=-=-\``,
    };
    expect(blockToMarkdown(input, options)).toBe(expected);
  });

  // -- line block ---------------------------------------------------------------------------------
  it('converts a plain line block to markdown', () => {
    const input = parseAndGetFirstBlock('Hello!');
    const expected = 'Hello!';
    expect(blockToMarkdown(input)).toBe(expected);
  });

  it('converts a plain line block with an indent to markdown', () => {
    const input = parseAndGetFirstBlock(' Hello!');
    const expected = '- Hello!';
    expect(blockToMarkdown(input)).toBe(expected);
  });

  it('converts a plain line block with two indents to markdown', () => {
    const input = parseAndGetFirstBlock('  Hello!');
    const expected = '  - Hello!';
    expect(blockToMarkdown(input)).toBe(expected);
  });

  it('converts a plain line block with two indents to markdown, tab indentation', () => {
    const input = parseAndGetFirstBlock('  Hello!');
    const options: ScrapboxParserToMarkdownOptions = {
      indentStyle: 'tab',
    };
    const expected = '	- Hello!';
    expect(blockToMarkdown(input, options)).toBe(expected);
  });

  it('converts a plain line block with two indents to markdown, 8 spaces indentation', () => {
    const input = parseAndGetFirstBlock('  Hello!');
    const options: ScrapboxParserToMarkdownOptions = {
      indentStyle: 'space',
      indentSize: 8,
    };
    const expected = '        - Hello!';
    expect(blockToMarkdown(input, options)).toBe(expected);
  });

  it('converts a line block consists of multiple nodes', () => {
    const input = parseAndGetFirstBlock('Hello, [World]!');
    const options: ScrapboxParserToMarkdownOptions = {
      projectName: 'progfay',
    };
    const expected = 'Hello, [World](https://scrapbox.io/progfay/World)!';
    expect(blockToMarkdown(input, options)).toBe(expected);
  });

  // -- code block ---------------------------------------------------------------------------------
  it('converts code block to markdown', () => {
    const input = parseAndGetFirstBlock('code:main.py\n print("haha")\n');
    const expected = '```py\nprint("haha")\n```';
    expect(blockToMarkdown(input)).toBe(expected);
  });

  it('converts code block to markdown with codeLangHandler', () => {
    const input = parseAndGetFirstBlock('code:uv.frag\n #version 300 es\n');
    const expected = '```glsl\n#version 300 es\n```';
    const options: ScrapboxParserToMarkdownOptions = {
      codeLangHandler: ({ fileName }) => {
        if (fileName.endsWith('.frag')) {
          return 'glsl';
        }
      },
    };
    expect(blockToMarkdown(input, options)).toBe(expected);
  });

  it('converts code block to markdown with codeBlockHandler', () => {
    const input = parseAndGetFirstBlock('code:main.py\n print("haha")\n');
    const expected = '<textarea>print("haha")</textarea>';
    const options: ScrapboxParserToMarkdownOptions = {
      codeBlockHandler: ({ content }) => `<textarea>${content}</textarea>`,
    };
    expect(blockToMarkdown(input, options)).toBe(expected);
  });

  // -- table block --------------------------------------------------------------------------------
  it('converts table block to markdown', () => {
    const input = parseAndGetFirstBlock('table:テーブル\n a	b\n c	d\n');
    const expected = '|a|b|\n|:-|:-|\n|c|d|';
    expect(blockToMarkdown(input)).toBe(expected);
  });
});
