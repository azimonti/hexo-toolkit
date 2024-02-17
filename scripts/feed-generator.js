/*
This script registers a universal feed generator for both RSS and Atom feeds in a Hexo blog.
It checks the blog's configuration to determine which types of feeds to generate and then invokes a generic feed generator function for each enabled feed type.

The script also includes a check to skip feed generation in development environments to speed up the development process and avoid generating unnecessary files.
*/

const feedGenerator = require('./feeds/generic-generator');

hexo.extend.generator.register('feed', function(locals) {
  // Check if the script is running in a development environment or if the NODE_ENV is not set
  if (process.env.NODE_ENV === 'development' || typeof process.env.NODE_ENV === 'undefined') {
    hexo.log.info('Skipping feed generation in development or undefined environment.');
    return; // Exit the function to skip feed generation
  }

  // Retrieve the feed configuration from Hexo's global configuration
  const config = this.config.feed || {};

  // Generate RSS feed if enabled in the configuration
  if (config.rss) {
    feedGenerator(hexo, 'rss', 'rss', locals); // 'rss' templateName is used for the RSS feed
  }

  // Generate Atom feed if enabled in the configuration
  if (config.atom) {
    feedGenerator(hexo, 'atom', 'atom', locals); // 'atom' templateName is used for the Atom feed
  }

  // Additional feed types can be added here as needed, using a similar pattern
});


