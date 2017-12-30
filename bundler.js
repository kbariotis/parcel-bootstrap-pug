const Bundler = require('parcel-bundler');
const path = require('path')

const bundler = new Bundler(path.resolve('src/pug/index.pug'));
bundler.addAssetType('pug', path.resolve('./assets/PugAsset.js'));

// bundler.bundle();
bundler.serve();
