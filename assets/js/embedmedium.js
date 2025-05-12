$(function () {
    var mediumPromise = new Promise(function (resolve) {
        var $content = $('#jsonContent');
        var data = { rss: 'https://medium.com/feed/@daryl-goh' };

        // Fetch the RSS feed and parse the JSON response
        $.get(
            'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fmedium.com%2Ffeed%2F%40daryl-goh',
            data,
            function (response) {
                if (response.status == 'ok') {
                    var display = '';
                    $.each(response.items, function (k, item) {
                        var content = item.content;

                        // Attempt to extract the image URL from the content
                        var src = '';
                        var imgTag = content.match(/<img[^>]+src="([^">]+)"/); // Match the image src URL in the content
                        if (imgTag && imgTag[1]) {
                            src = imgTag[1];  // Extract the image URL
                        }

                        // Fallback if no image is found
                        if (!src) {
                            src = 'https://via.placeholder.com/150';  // Default placeholder image if no image found
                        }

                        display += `<div class="card medium-card mb-3 mx-auto mr-5" style="width: 20rem;">`;
                        display += `  <span>
                                        <img src="${src}" class="card-img-top" alt="Cover image">
                                      </span>`;
                        display += `  <div class="card-body">`;
                        display += `    <h5 class="card-title">${item.title}</h5>`;

                        // Add categories if they exist
                        display += '    <p>';
                        var categories = item.categories || [];
                        for (var i = 0; i < categories.length; i++) {
                            display += `  <a href="#"><i>#${categories[i]}</i></a> &nbsp;`;
                        }
                        display += '    </p>';

                        // Add a Read More link
                        display += `    <a href="${item.link}" target="_blank" class="btn btn-outline-success">Read More</a>`;
                        display += `  </div>
                                    </div>`;

                        return k < 10; // Limit to 10 items
                    });

                    // Display the content in the designated div
                    resolve($content.html(display));
                } else {
                    console.error('Failed to load Medium feed');
                }
            }
        );
    });

    mediumPromise.then(function () {
        // Pagination
        pageSize = 4;
        var pageCount = $(".medium-card").length / pageSize;
        for (var i = 0; i < pageCount; i++) {
            $("#pagin").append(`<a class="page-link" href="#">${(i + 1)}</a>`);
        }

        $("#pagin a:nth-child(1)").addClass("active");
        showPage = function (page) {
            $(".medium-card").hide();
            $(".medium-card").each(function (n) {
                if (n >= pageSize * (page - 1) && n < pageSize * page)
                    $(this).show();
            });
        };

        showPage(1);

        $("#pagin a").click(function () {
            $("#pagin a").removeClass("active");
            $(this).addClass("active");
            showPage(parseInt($(this).text()));
            return false;
        });
    });
});
