/*
This script generates feed files (RSS, Atom, etc.) for a Hexo blog based on provided templates.
It dynamically filters and limits the number of posts included in the feed according to the blog's configuration, renders the feed using an EJS template, and writes the output to the specified feed file.

@param {Object} hexo - The Hexo instance, providing access to global configurations and utilities.
@param {String} feedType - The type of feed to generate (e.g., 'rss', 'atom').
@param {String} templateName - The name of the EJS template file (without extension) to use for rendering the feed.
@param {Object} locals - The local variables provided by Hexo, including all posts, pages, etc.
*/
const path = require('path');
const fs = require('fs');
function feedGenerator(hexo, feedType, templateName, locals) {
  // Filter and limit posts based on the global configuration
  let posts = locals.posts.sort('-date').toArray();
  if (hexo.config.feed && hexo.config.feed.post_limit) {
    posts = posts.slice(0, hexo.config.feed.post_limit); // Apply post limit
  }

  // Warn and exit if no posts are available for the feed
  if (posts.length === 0) {
    hexo.log.warn(`No posts found for ${feedType.toUpperCase()} feed generation.`);
    return;
  }

  // Prepare template variables
  const templateLocals = {
    posts: posts,
    config: hexo.config,
    feed: hexo.config.feed,
    url: hexo.config.url
  };

  // Construct the path to the EJS template based on the Hexo theme and feed type
  const themeName = hexo.config.theme;
  const ejsPath = path.join(hexo.base_dir, 'themes', themeName, 'layout', 'feeds', `${templateName}.xml.ejs`);

  // Render the feed content using the EJS template and template variables
  const feedContent = hexo.render.renderSync({ path: ejsPath }, templateLocals);

  // Define the output path for the generated feed file
  const outputPath = path.join(hexo.public_dir, 'feeds', `${feedType}.xml`);

  // Ensure the output directory exists and write the feed content to the file
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, feedContent);

  // Log successful feed generation
  hexo.log.info(`${feedType.toUpperCase()} feed generated successfully at ${outputPath}`);
}

module.exports = feedGenerator;
