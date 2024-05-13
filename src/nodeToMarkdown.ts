import type { CommandLineNode, DecorationNode, FormulaNode, GoogleMapNode, HashTagNode, HelpfeelNode, IconNode, ImageNode, LinkNode, Node, StrongIconNode, StrongImageNode, StrongNode } from '@progfay/scrapbox-parser';
import { ScrapboxParserToMarkdownOptions } from './ScrapboxParserToMarkdownOptions';
import { NumberListNode } from '@progfay/scrapbox-parser/lib/block/node/type';

function relativeLinkToAbsolute(link: string, options: ScrapboxParserToMarkdownOptions = {}): string {
  if (options.relativeLinkHandler != null) {
    return options.relativeLinkHandler(link);
  } else if (options.projectName != null) {
    return `https://scrapbox.io/${options.projectName}/${link}`;
  } else {
    throw new Error('Either projectName or relativeLinkHandler must be specified in options!');
  }
}

function linkNodeToMarkdown(node: LinkNode, options: ScrapboxParserToMarkdownOptions = {}): string {
  const custom = options.linkHandler?.(node);
  if (custom != null) {
    return custom;
  }

  if (node.pathType === 'absolute') {
    return `[${node.content}](${node.href})`;
  } else if (node.pathType === 'root') {
    const href = `https://scrapbox.io${node.href}`;
    return `[${node.href}](${href})`;
  } else {
    const href = relativeLinkToAbsolute(node.href, options);
    return `[${node.href}](${href})`;
  }
}

function hashTagNodeToMarkdown(node: HashTagNode, options: ScrapboxParserToMarkdownOptions = {}): string {
  const custom = options.hashTagHandler?.(node);
  if (custom != null) {
    return custom;
  }

  const href = relativeLinkToAbsolute(node.href, options);
  return `[#${node.href}](${href})`;
}

function decorationNodeToMarkdown(node: DecorationNode, options: ScrapboxParserToMarkdownOptions = {}): string {
  const custom = options.decoHandler?.(node);
  if (custom != null) {
    return custom;
  }

  let text = node.nodes.map((n) => nodeToMarkdown(n, options)).join('');

  let headerPrefix = '';
  node.decos.map((deco) => {
    if (deco[0] === '*') {
      if (deco[2] === '1') {
        text = `**${text}**`;
      } else {
        const decoCount = parseInt(deco[2]);
        const mdLevel = Math.max(5 - decoCount, 1);
        headerPrefix = '#'.repeat(mdLevel) + ' ';
      }
    } else if (deco[0] === '/') {
      text = `*${text}*`;
    } else if (deco[0] === '_') {
      text = `<u>${text}</u>`;
    } else if (deco[0] === '-') {
      text = `~~${text}~~`;
    }
  });

  return headerPrefix + text;
}

function strongNodeToMarkdown(node: StrongNode, options: ScrapboxParserToMarkdownOptions = {}): string {
  const text = node.nodes.map((n) => nodeToMarkdown(n, options)).join('');
  return `**${text}**`;
}

function numberListNodeToMarkdown(node: NumberListNode, options: ScrapboxParserToMarkdownOptions = {}): string {
  return `${node.number}. ${node.nodes.map((n) => nodeToMarkdown(n, options)).join('')}`;
}

function commandLineNodeToMarkdown(node: CommandLineNode, options: ScrapboxParserToMarkdownOptions = {}): string {
  const custom = options.commandLineHandler?.(node);
  if (custom != null) {
    return custom;
  }

  return `\`${node.symbol} ${node.text}\``;
}

function formulaNodeToMarkdown(node: FormulaNode, options: ScrapboxParserToMarkdownOptions = {}): string {
  const custom = options.formulaHandler?.(node);
  if (custom != null) {
    return custom;
  }

  return `$${node.formula}$`;
}

function imageNodeToMarkdown(node: ImageNode | StrongImageNode, options: ScrapboxParserToMarkdownOptions = {}): string {
  const custom = options.imageHandler?.(node);
  if (custom != null) {
    return custom;
  }

  let text = `![image](${node.src})`;
  if (node.type === 'image' && node.link !== '') {
    text = `[${text}](${node.link})`;
  }
  return text;
}

function iconNodeToMarkdown(node: IconNode | StrongIconNode, options: ScrapboxParserToMarkdownOptions = {}): string {
  const custom = options.iconHandler?.(node);
  if (custom != null) {
    return custom;
  }

  return node.raw;
}

function locationNodeToMarkdown(node: GoogleMapNode, options: ScrapboxParserToMarkdownOptions = {}): string {
  const custom = options.locationHandler?.(node);
  if (custom != null) {
    return custom;
  }

  return `[${node.place} - Google Maps](${node.url})`;
}

function helpfeelNodeToMarkdown(node: HelpfeelNode, options: ScrapboxParserToMarkdownOptions = {}): string {
  const custom = options.helpfeelHandler?.(node);
  if (custom != null) {
    return custom;
  }

  return `? ${node.text}`;
}

export function nodeToMarkdown(node: Node, options: ScrapboxParserToMarkdownOptions = {}): string {
  if (node.type === 'plain') {
    return node.text;
  } else if (node.type === 'blank') {
    return node.text;
  } else if (node.type === 'link') {
    return linkNodeToMarkdown(node, options);
  } else if (node.type === 'hashTag') {
    return hashTagNodeToMarkdown(node, options);
  } else if (node.type === 'decoration') {
    return decorationNodeToMarkdown(node, options);
  } else if (node.type === 'strong') {
    return strongNodeToMarkdown(node, options);
  } else if (node.type === 'numberList') {
    return numberListNodeToMarkdown(node, options);
  } else if (node.type === 'commandLine') {
    return commandLineNodeToMarkdown(node, options);
  } else if (node.type === 'code') {
    return '`' + node.text + '`';
  } else if (node.type === 'quote') {
    return `> ${node.nodes.map((n) => nodeToMarkdown(n, options)).join('').trim()}`;
  } else if (node.type === 'formula') {
    return formulaNodeToMarkdown(node, options);
  } else if (node.type === 'image' || node.type === 'strongImage') {
    return imageNodeToMarkdown(node, options);
  } else if (node.type === 'icon' || node.type === 'strongIcon') {
    return iconNodeToMarkdown(node, options);
  } else if (node.type === 'googleMap') {
    return locationNodeToMarkdown(node, options);
  } else if (node.type === 'helpfeel') {
    return helpfeelNodeToMarkdown(node, options);
  } else {
    console.warn(`Unsupported node type: "${(node as any).type}"`);
    return '';
  }
}
