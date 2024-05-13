import { parse } from '@progfay/scrapbox-parser';
import { ScrapboxParserToMarkdownOptions } from '../ScrapboxParserToMarkdownOptions';
import { nodeToMarkdown } from '../nodeToMarkdown';
import type { Line, Node } from '@progfay/scrapbox-parser';

function parseAndGetFirstNode(text: string): Node {
  const block = parse(text, { hasTitle: false })[0] as Line;
  return block.nodes[0] as Node;
}

describe('nodeToMarkdown', () => {
  // -- plain node ---------------------------------------------------------------------------------
  it('converts plain node to markdown', () => {
    const input = parseAndGetFirstNode('Hello!');
    const expected = 'Hello!';
    expect(nodeToMarkdown(input)).toBe(expected);
  });

  // -- blank node ---------------------------------------------------------------------------------
  it('converts blank node to markdown', () => {
    const input = parseAndGetFirstNode('[    ]');
    const expected = '    ';
    expect(nodeToMarkdown(input)).toBe(expected);
  });

  // -- link node ----------------------------------------------------------------------------------
  it('converts absolute link node to markdown', () => {
    const input = parseAndGetFirstNode('[Google https://www.google.com]');
    const expected = '[Google](https://www.google.com)';
    expect(nodeToMarkdown(input)).toBe(expected);
  });

  it('converts root link node to markdown', () => {
    const input = parseAndGetFirstNode('[/help-jp/ブラケティング]');
    const expected = '[/help-jp/ブラケティング](https://scrapbox.io/help-jp/ブラケティング)';
    expect(nodeToMarkdown(input)).toBe(expected);
  });

  it('converts relative link node to markdown', () => {
    const input = parseAndGetFirstNode('[パチンコ]');
    const expected = '[パチンコ](https://scrapbox.io/0b5vr/パチンコ)';
    const options: ScrapboxParserToMarkdownOptions = { projectName: '0b5vr' };
    expect(nodeToMarkdown(input, options)).toBe(expected);
  });

  it('converts relative link node to markdown, with relativeLinkHandler', () => {
    const input = parseAndGetFirstNode('[パチンコ]');
    const expected = '[パチンコ](https://example.com/パチンコ)';
    const options: ScrapboxParserToMarkdownOptions = {
      projectName: '0b5vr',
      relativeLinkHandler: (link) => `https://example.com/${link}`,
    };
    expect(nodeToMarkdown(input, options)).toBe(expected);
  });

  it('converts a relative link node with a link to markdown, with linkHandler', () => {
    const input = parseAndGetFirstNode('[パチンコ]');
    const expected = '[[パチンコ]]';
    const options: ScrapboxParserToMarkdownOptions = {
      linkHandler: ({ href }) => `[[${href}]]`,
    };
    expect(nodeToMarkdown(input, options)).toBe(expected);
  });

  // -- hashtag node -------------------------------------------------------------------------------
  it('converts hashtag node to markdown', () => {
    const input = parseAndGetFirstNode('#パチンコ');
    const expected = '[#パチンコ](https://scrapbox.io/0b5vr/パチンコ)';
    const options: ScrapboxParserToMarkdownOptions = { projectName: '0b5vr' };
    expect(nodeToMarkdown(input, options)).toBe(expected);
  });

  it('converts hashtag node to markdown, with relativeLinkHandler', () => {
    const input = parseAndGetFirstNode('#パチンコ');
    const expected = '[#パチンコ](https://example.com/パチンコ)';
    const options: ScrapboxParserToMarkdownOptions = {
      projectName: '0b5vr',
      relativeLinkHandler: (link) => `https://example.com/${link}`,
    };
    expect(nodeToMarkdown(input, options)).toBe(expected);
  });

  it('converts a hashtag node with a link to markdown, with hashTagHandler', () => {
    const input = parseAndGetFirstNode('#パチンコ');
    const expected = '#パチンコ';
    const options: ScrapboxParserToMarkdownOptions = {
      hashTagHandler: ({ href }) => `#${href}`,
    };
    expect(nodeToMarkdown(input, options)).toBe(expected);
  });

  // -- decoration node ----------------------------------------------------------------------------
  it('converts heading decoration to markdown', () => {
    const input = parseAndGetFirstNode('[*** 概要]');
    const expected = '## 概要';
    expect(nodeToMarkdown(input)).toBe(expected);
  });

  it('converts bold decoration to markdown', () => {
    const input = parseAndGetFirstNode('[* 極めて太い]');
    const expected = '**極めて太い**';
    expect(nodeToMarkdown(input)).toBe(expected);
  });

  it('converts italic decoration to markdown', () => {
    const input = parseAndGetFirstNode('[/ インターネット]');
    const expected = '*インターネット*';
    expect(nodeToMarkdown(input)).toBe(expected);
  });

  it('converts underline decoration to markdown', () => {
    const input = parseAndGetFirstNode('[_ 下線]');
    const expected = '<u>下線</u>';
    expect(nodeToMarkdown(input)).toBe(expected);
  });

  it('converts strikethrough decoration to markdown', () => {
    const input = parseAndGetFirstNode('[- えっち]');
    const expected = '~~えっち~~';
    expect(nodeToMarkdown(input)).toBe(expected);
  });

  // -- number list node ---------------------------------------------------------------------------
  it('converts number list node to markdown', () => {
    const input = parseAndGetFirstNode('1. First');
    const expected = '1. First';
    expect(nodeToMarkdown(input)).toBe(expected);
  });

  // -- command line node --------------------------------------------------------------------------
  it('converts command line node to markdown', () => {
    const input = parseAndGetFirstNode('$ echo Hello!');
    const expected = '`$ echo Hello!`';
    expect(nodeToMarkdown(input)).toBe(expected);
  });

  it('converts command line node to markdown, with commandLineHandler', () => {
    const input = parseAndGetFirstNode('$ echo Hello!');
    const expected = '\n```sh\n$ echo Hello!\n```\n';
    const options: ScrapboxParserToMarkdownOptions = {
      commandLineHandler: ({ symbol, text }) => `\n\`\`\`sh\n${symbol} ${text}\n\`\`\`\n`,
    };
    expect(nodeToMarkdown(input, options)).toBe(expected);
  });

  // -- code node ----------------------------------------------------------------------------------
  it('converts code node to markdown', () => {
    const input = parseAndGetFirstNode('`code`');
    const expected = '`code`';
    expect(nodeToMarkdown(input)).toBe(expected);
  });

  // -- quote node ---------------------------------------------------------------------------------
  it('converts quote node to markdown', () => {
    const input = parseAndGetFirstNode('> Lorem ipsum dolor sit amet,');
    const expected = '> Lorem ipsum dolor sit amet,';
    expect(nodeToMarkdown(input)).toBe(expected);
  });

  // -- formula node -------------------------------------------------------------------------------
  it('converts formula node to markdown', () => {
    const input = parseAndGetFirstNode('[$ E=mc^2]');
    const expected = '$E=mc^2$';
    expect(nodeToMarkdown(input)).toBe(expected);
  });

  it('converts formula node to markdown, with formulaHandler', () => {
    const input = parseAndGetFirstNode('[$ E=mc^2]');
    const expected = '$$ E=mc^2 $$';
    const options: ScrapboxParserToMarkdownOptions = {
      formulaHandler: ({ formula }) => `$$ ${formula} $$`,
    };
    expect(nodeToMarkdown(input, options)).toBe(expected);
  });

  // -- image node ---------------------------------------------------------------------------------
  it('converts an image node to markdown', () => {
    const input = parseAndGetFirstNode('[https://gyazo.com/505e94b5dbfefb247d67d631f26f6210]');
    const expected = '![image](https://gyazo.com/505e94b5dbfefb247d67d631f26f6210/thumb/1000)';
    expect(nodeToMarkdown(input)).toBe(expected);
  });

  it('converts a strong image node to markdown', () => {
    const input = parseAndGetFirstNode('[[https://gyazo.com/505e94b5dbfefb247d67d631f26f6210]]');
    const expected = '![image](https://gyazo.com/505e94b5dbfefb247d67d631f26f6210/thumb/1000)';
    expect(nodeToMarkdown(input)).toBe(expected);
  });

  it('converts an image node with a link to markdown', () => {
    const input = parseAndGetFirstNode('[https://gyazo.com/505e94b5dbfefb247d67d631f26f6210 https://knowyourmeme.com/memes/party-parrot]');
    const expected = '[![image](https://gyazo.com/505e94b5dbfefb247d67d631f26f6210/thumb/1000)](https://knowyourmeme.com/memes/party-parrot)';
    expect(nodeToMarkdown(input)).toBe(expected);
  });

  it('converts an image node to markdown, with imageHandler', () => {
    const input = parseAndGetFirstNode('[https://gyazo.com/505e94b5dbfefb247d67d631f26f6210]');
    const expected = '<img src="https://gyazo.com/505e94b5dbfefb247d67d631f26f6210/thumb/1000" alt="image" class="spin" />';
    const options: ScrapboxParserToMarkdownOptions = {
      imageHandler: ({ src }) => `<img src="${src}" alt="image" class="spin" />`,
    };
    expect(nodeToMarkdown(input, options)).toBe(expected);
  });

  // -- icon node ----------------------------------------------------------------------------------
  it('converts an icon node to markdown', () => {
    const input = parseAndGetFirstNode('[0b5vr.icon]');
    const expected = '[0b5vr.icon]';
    expect(nodeToMarkdown(input)).toBe(expected);
  });

  it('converts a string icon node to markdown', () => {
    const input = parseAndGetFirstNode('[[0b5vr.icon]]');
    const expected = '[[0b5vr.icon]]';
    expect(nodeToMarkdown(input)).toBe(expected);
  });

  it('converts an icon node to markdown, with iconHandler', () => {
    const input = parseAndGetFirstNode('[0b5vr.icon]');
    const expected = '![0b5vr](./icons/0b5vr.png)';
    const options: ScrapboxParserToMarkdownOptions = {
      iconHandler: ({ path }) => `![${path}](./icons/${path}.png)`,
    };
    expect(nodeToMarkdown(input, options)).toBe(expected);
  });

  // -- google maps node ---------------------------------------------------------------------------
  it('converts a Google Maps node to markdown', () => {
    const input = parseAndGetFirstNode('[N35.692161,E139.6998928,Z15 パチンコ]');
    const expected = '[パチンコ - Google Maps](https://www.google.com/maps/place/%E3%83%91%E3%83%81%E3%83%B3%E3%82%B3/@35.692161,139.6998928,15z)';
    expect(nodeToMarkdown(input)).toBe(expected);
  });

  it('converts a Google Maps node to markdown, with locationHandler', () => {
    const input = parseAndGetFirstNode('[N35.692161,E139.6998928,Z15 パチンコ]');
    const expected = '<iframe src="https://example.com/パチンコ/35.692161,139.6998928,15"></iframe>';
    const options: ScrapboxParserToMarkdownOptions = {
      locationHandler: ({ latitude, longitude, zoom, place }) => `<iframe src="https://example.com/${place}/${latitude},${longitude},${zoom}"></iframe>`,
    };
    expect(nodeToMarkdown(input, options)).toBe(expected);
  });

  // -- helpfeel node ------------------------------------------------------------------------------
  it('converts a helpfeel node to markdown', () => {
    const input = parseAndGetFirstNode('? Helpfeel記法とは?');
    const expected = '? Helpfeel記法とは?';
    expect(nodeToMarkdown(input)).toBe(expected);
  });

  it('converts a helpfeel node to markdown, with helpfeelHandler', () => {
    const input = parseAndGetFirstNode('? Helpfeel記法とは?');
    const expected = '🤔 Helpfeel記法とは? 🤔';
    const options: ScrapboxParserToMarkdownOptions = {
      helpfeelHandler: ({ text }) => `🤔 ${text} 🤔`,
    };
    expect(nodeToMarkdown(input, options)).toBe(expected);
  });
});
