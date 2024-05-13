import type { CodeBlock, CommandLineNode, DecorationNode, FormulaNode, GoogleMapNode, HashTagNode, HelpfeelNode, IconNode, ImageNode, LinkNode, StrongIconNode, StrongImageNode, Title } from '@progfay/scrapbox-parser';

export interface ScrapboxParserToMarkdownOptions {
  /**
   * Specify the project name of the Scrapbox, which is required to convert relative links to absolute links.
   * This option is ignored when {@link relativeLinkHandler} is specified.
   * If neither {@link projectName} nor {@link relativeLinkHandler} is specified, it throws an error.
   */
  projectName?: string;

  /**
   * Specify the indentation style of list items.
   * `space` by default.
   */
  indentStyle?: 'space' | 'tab';

  /**
   * Specify the indentation size of list items.
   * This only works when {@link indentStyle} is `space`.
   * `2` by default.
   */
  indentSize?: number;

  /**
   * Specify the bullet character of list items.
   * By default, it uses a hyphen.
   */
  listBullet?: string;

  /**
   * Specify how it handles the relative links.
   * By default, it converts the relative links to absolute links to scrapbox using {@link projectName}.
   * This option supercedes {@link projectName}.
   * @param title The linked page title.
   * @returns The link in a markdown.
   */
  relativeLinkHandler?: (title: string) => string;

  /**
   * Specify how it handles title blocks.
   * If the handler returns `null` or `undefined`, it uses the default behavior as if the handler is not specified.
   * By default, it converts the title block to a markdown h1.
   * @param title The title in a plain text.
   * @returns The title in a markdown.
   */
  titleHandler?: (title: Title) => string | null | undefined;

  /**
   * Specify how it handles code blocks.
   * If the handler returns `null` or `undefined`, it uses the default behavior as if the handler is not specified.
   * By default, it converts the code block to a markdown code block.
   * This option supercedes {@link codeLangHandler}.
   * @param codeBlock The code block.
   * @returns The code block in a markdown.
   */
  codeBlockHandler?: (codeBlock: CodeBlock) => string | null | undefined;

  /**
   * Specify how it handles code block languages.
   * If the handler returns `null` or `undefined`, it uses the file name extension as if the handler is not specified.
   * By default, it uses the file name extension as is.
   * This option is ignored when {@link codeBlockHandler} is specified.
   * @param codeBlock The code block.
   * @returns The language specifier in a markdown code block.
   */
  codeLangHandler?: (codeBlock: CodeBlock) => string | null | undefined;

  /**
   * Specify how it handles link nodes.
   * If the handler returns `null` or `undefined`, it uses the default behavior as if the handler is not specified.
   * By default, it converts the link node to a markdown link.
   * @param link The link node.
   * @returns The link in a markdown.
   */
  linkHandler?: (link: LinkNode) => string | null | undefined;

  /**
   * Specify how it handles hash tag nodes.
   * If the handler returns `null` or `undefined`, it uses the default behavior as if the handler is not specified.
   * By default, it converts the hash tag node to a markdown link.
   * @param hashTag The hash tag node.
   * @returns The hash tag in a markdown.
   */
  hashTagHandler?: (hashTag: HashTagNode) => string | null | undefined;

  /**
   * Specify how it handles decoration nodes.
   * If the handler returns `null` or `undefined`, it uses the default behavior as if the handler is not specified.
   * @param decorationNode The decoration node.
   * @returns The text with the decoration behaviors in a markdown.
   */
  decoHandler?: (decorationNode: DecorationNode) => string | null | undefined;

  /**
   * Specify how it handles command line nodes.
   * If the handler returns `null` or `undefined`, it uses the default behavior as if the handler is not specified.
   * By default, it converts the node as an inline code including the prefix symbol.
   * @param commandLine The command line node.
   * @returns The command in a markdown.
   */
  commandLineHandler?: (commandLine: CommandLineNode) => string | null | undefined;

  /**
   * Specify how it handles formula nodes.
   * If the handler returns `null` or `undefined`, it uses the default behavior as if the handler is not specified.
   * By default, it converts the formula node to a GitHub flavored inline math (`$ formula $`).
   */
  formulaHandler?: (formula: FormulaNode) => string | null | undefined;

  /**
   * Specify how it handles image nodes.
   * If the handler returns `null` or `undefined`, it uses the default behavior as if the handler is not specified.
   * By default, it converts the image node to a markdown image.
   * @param image The image node.
   * @returns The image in a markdown.
   */
  imageHandler?: (image: ImageNode | StrongImageNode) => string | null | undefined;

  /**
   * Specify how it handles icon nodes.
   * If the handler returns `null` or `undefined`, it uses the default behavior as if the handler is not specified.
   * By default, it simply outputs the raw text as is.
   * @param icon The icon node.
   * @returns The icon in a markdown.
   */
  iconHandler?: (icon: IconNode | StrongIconNode) => string | null | undefined;

  /**
   * Specify how it handles location nodes.
   * If the handler returns `null` or `undefined`, it uses the default behavior as if the handler is not specified.
   * By default, it converts the location node to a markdown link to Google Maps.
   * @param location The location node.
   * @returns The location in a markdown.
   */
  locationHandler?: (location: GoogleMapNode) => string | null | undefined;

  /**
   * Specify how it handles helpfeel nodes.
   * If the handler returns `null` or `undefined`, it uses the default behavior as if the handler is not specified.
   * By default, it converts the helpfeel node as is including the prefix question mark.
   * @param helpfeel The helpfeel node.
   * @returns The text in a markdown.
   */
  helpfeelHandler?: (helpfeel: HelpfeelNode) => string | null | undefined;
}
