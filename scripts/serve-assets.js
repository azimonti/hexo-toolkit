/*
This script enhances the Hexo server with custom middleware to serve static assets from a root '/assets' directory, making it particularly useful for blogs hosted as a subset of a larger site (e.g., under '/blog/').
It intercepts requests to '/assets', resolves the asset's path relative to the Hexo base directory, and serves the file if it exists. This approach allows for centralized management of static assets outside the Hexo source folder, ensuring they are accessible even when the blog is not hosted at the domain root.
*/

const fs = require('fs');
const path = require('path');
const url = require('url');
const mime = require('mime');

hexo.extend.filter.register('server_middleware', function(app) {
  app.use('/assets', (req, res, next) => {
    // Parse the request URL to get only the pathname
    const parsedUrl = url.parse(req.url);
    const assetPath = path.join(hexo.base_dir, 'assets', parsedUrl.pathname);

    fs.stat(assetPath, (err, stats) => {
      if (err || !stats.isFile()) return next();  // If no file is found, move to the next middleware

      const contentType = mime.getType(assetPath);  // Determine the file's MIME type for proper content delivery
      res.setHeader('Content-Type', contentType);  // Set the Content-Type header

      fs.createReadStream(assetPath).pipe(res);  // Stream the file to the response
    });
  });
});
