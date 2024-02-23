/*
This Hexo generator script creates JSON files containing post data organized by date, facilitating the integration of a dynamic calendar feature on a Hexo blog. It processes each post, grouping them by year and month, and generates JSON files for each month. These files contain information about the posts such as title, excerpt, and publication date.

The script also accumulates data into a calendar structure that maps each day to the number of posts, enabling the frontend to highlight active dates in the calendar. This enhances the blog's user interface by allowing visitors to browse posts based on the selected dates in the calendar.
*/

const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');

hexo.extend.generator.register('post_calendar', function(locals) {
  let posts = locals.posts.sort('-date').toArray();
  let index = 0;
  let currentYear = null;
  let currentMonth = null;
  let monthlyPosts = {}; // Stores posts for the current month being processed
  let calendarData = {}; // Aggregates post counts by date for the calendar
  const excerptCharacterLimit = hexo.config.post_calendar?.excerpt_character_limit || 0;
  const contentsCharacterLimit = hexo.config.post_calendar?.contents_character_limit || 140;
  const timezone = hexo.config.timezone || 'UTC'; // Default timezone is 'UTC' if not specified in config

  while (index < posts.length) {
    const post = posts[index];
    const postDate = moment(post.date).tz(timezone); // Convert post date to configured timezone
    const year = postDate.format('YYYY');
    const month = postDate.format('MM');
    const day = postDate.format('DD');

    // Check for a change in year or month to start a new JSON file
    if (year !== currentYear || month !== currentMonth) {
      if (currentMonth !== null) {
        // Write the accumulated posts for the previous month to a JSON file
        const outputPath = path.join(hexo.public_dir, 'json/calendar', currentYear, `posts_${currentMonth}.json`);
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, JSON.stringify(monthlyPosts, null, 2));
      }
      monthlyPosts = {}; // Reset for a new month
      currentYear = year;
      currentMonth = month;
    }

    if (!monthlyPosts[day]) monthlyPosts[day] = [];

    // Prepare post data, truncating excerpts and content if limits are set
    const excerpt = post.excerpt
      ? (excerptCharacterLimit > 0 ? post.excerpt.substring(0, excerptCharacterLimit) : post.excerpt)
      : (contentsCharacterLimit > 0 ? JSON.stringify(post.content.replace(/<[^>]*>/g, '')).slice(1, -1).substring(0, contentsCharacterLimit) : JSON.stringify(post.content.replace(/<[^>]*>/g, '')).slice(1, -1));

    monthlyPosts[day].push({
      t: post.title, // Title
      e: excerpt, // Excerpt
      d: postDate.format(), // Date in ISO format
      u: post.path // URL path
    });

    // Accumulate calendar data to highlight active dates
    if (!calendarData[year]) calendarData[year] = {};
    if (!calendarData[year][month]) calendarData[year][month] = {};
    if (!calendarData[year][month][day]) calendarData[year][month][day] = 0;
    calendarData[year][month][day] += 1;

    index++;
  }

  // Write the data for the last processed month
  if (currentMonth !== null) {
    const outputPath = path.join(hexo.public_dir, 'json/calendar', currentYear, `posts_${currentMonth}.json`);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(monthlyPosts, null, 2));
  }

  // Generate a summary JSON file for the calendar to use in highlighting active dates
  const postsJSONPath = path.join(hexo.public_dir, 'json/calendar', 'posts.json');
  fs.writeFileSync(postsJSONPath, JSON.stringify(calendarData, null, 2));
});

