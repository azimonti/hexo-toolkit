/*
This Hexo plugin defines a custom tag 'include_raw_contents' that allows including the raw content of a file directly into a blog post or page. It's particularly useful for embedding code snippets, configuration files, or any HTML content directly into your content without the need to copy and paste it into a Markdown file.
Files to be included should be placed in the 'source/_raw' directory of your Hexo site.
When the tag is used in a post or page, it reads the specified file's content and includes it as raw HTML in the output.
*/

const fs = require('hexo-fs');  // Use Hexo's filesystem module for enhanced features like promise-based functions
const path = require('path');

hexo.extend.tag.register('include_raw_contents', async function(args) {
  // Join the arguments to allow spaces in filenames
  const relativeFilePath = args.join(' ');

  // Construct the absolute path to the file within the '_raw' directory
  const actualFilePath = path.join(hexo.base_dir, 'source', '_raw', relativeFilePath);

  // Check if the file exists and read its content asynchronously
  if (await fs.exists(actualFilePath)) {
    const content = await fs.readFile(actualFilePath);  // Read the file's content if it exists
    return content;  // Return the content to be included in the post or page
  } else {
    hexo.log.error(`File not found: ${actualFilePath}`);  // Log an error if the file does not exist
    return '';  // Return an empty string to avoid breaking the page
  }
}, {async: true});  // Mark the tag as asynchronous since file operations are async
