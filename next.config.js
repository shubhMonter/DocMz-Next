// next.config.js
const withImages = require('next-images');
const withSass = require('@zeit/next-sass')
const withCss = require('@zeit/next-css')

module.exports = withImages(withCss(withSass({
    /* config options here */
   
    experimental: { css: true }
})))