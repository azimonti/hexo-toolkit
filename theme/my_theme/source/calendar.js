/*
This script enhances a Hexo blog with a dynamic calendar feature, allowing users to browse posts by date. It leverages the Bootstrap datepicker for the calendar UI and fetches post data from JSON files organized by date.

Please ensure to customize the datepicker's appearance by modifying the CSS classes according to your chosen Bootstrap datepicker theme. Additionally, adapt the `postHTML` structure in the displayPosts function to seamlessly integrate with your Hexo theme's styling.
*/

$(document).ready(function() {
  // Formats date to mm/dd/yyyy
  function formatDate(date) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [month, day, year].join('/');
  }

  // Initialize date picker with today's date
  document.querySelectorAll('.date-picker').forEach(function(picker) {
    picker.value = formatDate(new Date());
  });

  // Fetches and processes active dates for the calendar
  fetch('/json/calendar/posts.json').then(function(response) {
    return response.json();
  }).then(function(activeDates) {
    var allowedDates = [];

    // Populates allowedDates array with formatted date strings
    Object.keys(activeDates).forEach(year => {
      Object.keys(activeDates[year]).forEach(month => {
        Object.keys(activeDates[year][month]).forEach(day => {
          var date = new Date(year, month - 1, day);
          var formattedDate = formatDate(date);
          allowedDates.push(formattedDate);
        });
      });
    });

    allowedDates.sort((a, b) => new Date(a) - new Date(b));

    var defaultDateStr = allowedDates[allowedDates.length - 1];
    var defaultDate = new Date(defaultDateStr);

    // Initializes the Bootstrap datepicker
    $('#date-picker-calendar').datepicker({
      templates: {
        leftArrow: '<i class="now-ui-icons arrows-1_minimal-left"></i>',
        rightArrow: '<i class="now-ui-icons arrows-1_minimal-right"></i>'
      },
      startDate: new Date(2024, 0, 1),
      endDate: new Date(new Date().setDate(new Date().getDate() + 10)),
      beforeShowDay: function(date) {
        var formattedDate = formatDate(date);
        return allowedDates.includes(formattedDate) ? {enabled: true} : {enabled: false, classes: 'datepicker-calendar-disabled-date'};
      }
    }).on('show', function() {
      var datepickerContainer = $(this).data('datepicker').picker;
      datepickerContainer.addClass('datepicker-calendar-visible');
      var datepickerColor = $(this).data('datepicker-color');
      if (datepickerColor) {
        datepickerContainer.addClass('datepicker-' + datepickerColor);
      }
    }).on('hide', function() {
      $(this).data('datepicker').picker.removeClass('datepicker-calendar-visible');
    });

    // Set and trigger the default date for the datepicker
    $('#date-picker-calendar').datepicker('setDate', defaultDate).trigger({
      type: 'changeDate',
      date: defaultDate
    });
  }).catch(function(error) {
    console.error('Error loading active dates:', error);
  });

  var postCache = {}; // Cache for storing fetched post data

  // Handles date selection and displays posts for the selected date
  $('#date-picker-calendar').on('changeDate', function(event) {
    let selectedDate = event.date;
    let year = selectedDate.getFullYear();
    let month = selectedDate.getMonth() + 1; // +1 because months are 0-indexed
    let day = selectedDate.getDate();
    let formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    let cacheKey = `postData_${year}${month.toString().padStart(2, '0')}`;

    function displayPosts(data) {
      $('#postsContainer').empty(); // Clears previous posts
      if (data[day.toString().padStart(2, '0')]) {
        data[day.toString().padStart(2, '0')].forEach(function(post, index) {
          // Reminder: Customize postHTML structure to fit your Hexo theme
          let postHTML = `<article id="post-${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}-${index}"><div><a class="post-creation-date" href="/${post.u}"><time datetime="${post.d}">${formattedDate}</time></a></div><div><header><h4><a href="/${post.u}">${post.t}</a></h4></header><p>${post.e}</p></div></article>`;
          $('#postsContainer').append(postHTML);
        });
      } else {
        $('#postsContainer').html('<p>No posts available for this date.</p>');
      }
    }

    // Utilizes cached data if available to avoid redundant fetches
    if (postCache[cacheKey]) {
      displayPosts(postCache[cacheKey]);
    } else {
      let url = `/json/calendar/${year}/posts_${month.toString().padStart(2, '0')}.json`;
      fetch(url).then(response => response.json()).then(data => {
        postCache[cacheKey] = data; // Updates cache
        displayPosts(data);
      }).catch(error => {
        console.error('Error fetching posts for the selected date:', error);
        $('#postsContainer').html('<p>Error loading posts.</p>');
      });
    }
  });
});

