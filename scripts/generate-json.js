/*
This script extends the Hexo static site generator by registering a custom generator named 'json-ld'.
It automatically creates JSON-LD (JavaScript Object Notation for Linked Data) files for each blog post, which are useful for structuring and linking your website's data in a way that is easily readable by search engines,enhancing SEO. The JSON-LD files include various post details such as publish date, title, content, author, tags,
and categories. These files are named using the post's date and slug, and are saved in the corresponding post's directory.
*/

const path = require('path');

// Register a Hexo generator for creating JSON-LD files for blog posts
hexo.extend.generator.register('json-ld', function (locals) {
  // Iterate over all posts to generate a JSON-LD file for each
  return locals.posts.map(post => {
    // Prefix the JSON-LD file name with the post's date in YYYYMMDD format
    const datePrefix = post.date.format('YYYYMMDD');
    const fileName = `${datePrefix}_${post.slug}.json`;
    // Generate the output path for the JSON-LD file within the post's directory
    const outputPath = path.join(post.path, fileName);

    // Prepare tags as a JSON array, defaulting to an empty array if no tags are present
    let tagNames = '[]';
    if (post.tags && post.tags.length) {
      tagNames = JSON.stringify(post.tags.toArray().map(tag => tag.name));
    }

    // Prepare categories as a JSON array, defaulting to an empty array if no categories are present
    let categoryNames = '[]';
    if (post.categories && post.categories.length) {
      categoryNames = JSON.stringify(post.categories.toArray().map(cat => cat.name));
    }

    // Render the JSON-LD content using the ejs template with post and config data
    let jsonContent = hexo.render.renderSync({
      path: 'themes/my_theme/layout/json-ld.ejs', engine: 'ejs'
    }, {
      page: {
        path: post.path,
        date: new Date(post.date).toISOString(),
        updated: new Date(post.updated).toISOString(),
        lastModified: post.lastModified ? new Date(post.lastModified).toISOString() : new Date(post.date).toISOString(),
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        author: post.author || hexo.config.author,
        image: post.image || hexo.config.default_image,
        categories: categoryNames,
        tags: tagNames
      },
      config: hexo.config
    });

    return {
      path: outputPath,
      data: jsonContent
    };
  });
});
