# @0b5vr/scrapbox-parser-to-markdown

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
