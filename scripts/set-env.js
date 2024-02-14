/*
This script adds a small utility to the Hexo framework by registering a filter on 'template_locals'.
It ensures that an environment variable, 'env', is always defined for the template's local variables.
If 'NODE_ENV' is set in the process environment, it uses that value; otherwise, it defaults to 'development'.
This is particularly useful for adjusting template behavior based on the environment,
such as toggling debug information or feature flags.
*/

hexo.extend.filter.register('template_locals', locals => {
  locals.env = process.env.NODE_ENV || 'development';
});
