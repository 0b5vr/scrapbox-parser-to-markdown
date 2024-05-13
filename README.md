# @0b5vr/scrapbox-parser-to-markdown

[![@0b5vr/scrapbox-parser-to-markdown on npm](https://img.shields.io/npm/v/%400b5vr%2Fscrapbox-parser-to-markdown?style=flat-square&logo=npm)](https://www.npmjs.com/package/@0b5vr/scrapbox-parser-to-markdown)

Convert [@progfay/scrapbox-parser](https://github.com/progfay/scrapbox-parser) parsed result to Markdown

https://0b5vr.com/scrapbox-parser-to-markdown/example.html

```js
import { parse } from '@progfay/scrapbox-parser';
import { scrapboxParserToMarkdown } from '@0b5vr/scrapbox-parser-to-markdown';

const sb = `Title

[* Hello!]`;

const parsed = parse(sb);
const md = scrapboxParserToMarkdown(parsed, { projectName: '0b5vr' });
```
