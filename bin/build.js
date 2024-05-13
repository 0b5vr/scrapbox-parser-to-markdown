const path = require('path');
const esbuild = require('esbuild');
const packageJson = require('../package.json');

// == env ==========================================================================================
const SERVE = process.env.SERVE === '1';

// == banner =======================================================================================
const copyright = '(c) 2024 0b5vr';
const licenseName = 'MIT License';
const licenseUri = 'https://github.com/0b5vr/scrapbox-parser-to-markdown/blob/release/LICENSE';

const bannerTextDev = `/*!
* ${packageJson.name} v${packageJson.version}
* ${packageJson.description}
*
* Copyright ${copyright}
* ${packageJson.name} is distributed under ${licenseName}
* ${licenseUri}
*/`;

const bannerTextProd = `//! ${copyright} - ${licenseUri}`;

// == build ========================================================================================
function createBuildOptions(format, dev) {
  const ext = format === 'cjs' ? '.cjs' : '.mjs';
  const filename = `scrapbox-parser-to-markdown${dev ? '' : '.min'}${ext}`;

  /** @type {esbuild.BuildOptions} */
  const buildOptions = {
    entryPoints: [path.resolve( __dirname, '../src/index.ts' )],
    bundle: true,
    outfile: path.resolve(__dirname, '../dist', filename),
    format,
    target: 'es2020',
    sourcemap: true,
    minify: !dev,
    banner: {
      js: dev ? bannerTextDev : bannerTextProd,
    },
  };

  return buildOptions;
}

esbuild.build(createBuildOptions('cjs', true));
esbuild.build(createBuildOptions('cjs', false));
esbuild.build(createBuildOptions('esm', true));
esbuild.build(createBuildOptions('esm', false));

// == serve ========================================================================================
if (SERVE) {
  esbuild.context(createBuildOptions('esm', true)).then(async (context) => {
    const { host, port } = await context.serve({
      servedir: path.resolve(__dirname, '..'),
      port: 3800,
    });
    console.log(`Serving on http://${host}:${port}`);
  });
}
