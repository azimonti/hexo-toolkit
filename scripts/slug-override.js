/*
This script is a Hexo filter that modifies the slug of each post based on its file path, allowing for a more structured organization of posts in nested directories within the '_posts' folder. It's particularly useful for organizing posts by date (e.g., YYYY/MM/posts), providing clarity and a hierarchical structure to the content. When a post resides in nested directories, the filter extracts the file name and sets it as the post's slug, ensuring unique and meaningful URLs that reflect the post's placement in the directory structure.
*/

hexo.extend.filter.register('before_post_render', function(data) {
  // Split the source path to extract parts
  const parts = data.source.split('/');

  // Check if the post is within the _posts directory and has additional nested directories
  if (parts.length > 1 && parts[0] === '_posts') {
    // Use the last part of the path (the filename without the extension) as the slug
    data.slug = parts[parts.length - 1].replace(/\.\w+$/, '');
  }

  return data;
});
