const { Asset } = require('parcel-bundler');
const walk = require('pug-walk');
const parse = require('pug-parser');
const lex = require('pug-lexer');
const generateCode = require('pug-code-gen');
const wrap = require('pug-runtime/wrap');
const link = require('pug-linker');
const load = require('pug-load');

const path = require('path');
const urlJoin = require('parcel-bundler/src/utils/urlJoin');
const render = require('posthtml-render');
const posthtmlTransform = require('parcel-bundler/src/transforms/posthtml');
const isURL = require('parcel-bundler/src/utils/is-url');

// A list of all attributes that should produce a dependency
// Based on https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes
const ATTRS = {
  src: [
    'script',
    'img',
    'audio',
    'video',
    'source',
    'track',
    'iframe',
    'embed'
  ],
  href: ['link', 'a'],
  poster: ['video']
};

class JadeAsset extends Asset {
  constructor(name, pkg, options) {
    super(name, pkg, options);
    this.type = 'html';
    this.isAstDirty = false;

    this.name = name;
  }

  parse(code) {
    let res = link(load(parse(lex(code, {
      filename: this.name,
    }), {
      filename: this.name,
      src: code
    }), {
      lex,
      parse,
    }));

    return res;
  }

  collectDependencies() {
    walk(this.ast, node => {
      if (node.attrs) {
        node.attrs.forEach(attr => {
          let elements = ATTRS[attr.name];
          if (elements && elements.includes(node.name)) {
            const path = attr.val.replace(/\'/g, '')

            let assetPath = this.addURLDependency(path);
            if (!isURL(assetPath)) {
              assetPath = urlJoin(this.options.publicURL, assetPath);
            }
            attr.val = `\'${assetPath}\'`;
            this.isAstDirty = true;
          }
        })
      }

      return node;
    });
  }

  async transform() {
    await posthtmlTransform(this);
  }

  generate() {
    let html = this.isAstDirty ? wrap(generateCode(this.ast, {
      compileDebug: true,
      pretty: true,
    }))() : this.contents;

    return { html };
  }
}

module.exports = JadeAsset;
