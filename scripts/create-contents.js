/*
This script allows for dynamic content generation based on a template file. The path to the template file is constructed using the first argument passed to the tag, which is expected to be the template file name. This enables the insertion of flexible and reusable content in Hexo posts or pages by reading and processing the specified template file.
*/

const fs = require('hexo-fs');
const path = require('path');
hexo.extend.tag.register('create_content', async function(args) {
  // Ensure at least one argument (the pattern file name) is provided
  if (args.length < 1) {
    hexo.log.error('Invalid number of arguments. Expected at least 1.');
    return '';
  }

  const patternFileName = args[0]; // The first argument is the template file name, e.g., 'template.txt'

  // Construct the path to the template file located in the '_patterns' directory within the 'source' folder
  const patternFilePath = path.join(hexo.base_dir, 'source', '_patterns', patternFileName);

  let generatedContent = ''; // Initialize the variable to hold the generated content

  // Check if the template file exists
  if (await fs.exists(patternFilePath)) {
    // Read the content of the template file
    generatedContent = await fs.readFile(patternFilePath);

    // Process additional arguments as placeholders replacements within the template
    args.slice(1).forEach((param, index) => {
      // Placeholders in the template are expected to be in the form $PARAM1, $PARAM2, etc.
      // Replace each placeholder with the corresponding argument value
      generatedContent = generatedContent.replace(new RegExp(`\\$PARAM${index + 1}`, 'g'), param);
    });
  } else {
    // Log an error if the template file does not exist
    hexo.log.error(`Pattern file not found: ${patternFilePath}`);
  }

  // Return the generated content to be included in the Hexo post or page
  return generatedContent;
}, {async: true}); // Mark the tag as asynchronous
