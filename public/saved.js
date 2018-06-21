// Grab the articles as a json
$.getJSON("/api/saved", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
        var row = $('<div>');
        row.addClass('row article-style');

        var col3 = $('<div>');
        col3.addClass('col-3');
     
        var img = $('<img>');
        img.attr('src', data[i].img);
        img.addClass('img-style');

        col3.append(img);

        var col9 = $('<div>');
        col9.addClass('col-9');

        var link = $('<a>');
        link.addClass('link-style');
        link.attr('href', data[i].link);

        var title = $('<h3>');
        title.addClass('card-title').text(data[i].title);

        link.append(title);

        var info = $('<p>');
        info.addClass('card-text').text(data[i].info);

        var save = $('<a>');
        save.addClass('btn btn-primary');
        save.attr('href', "/save/"+data[i]._id);
        save.text("/save/"+data[i]._id);

        col9.append(link).append(info).append(save);

        row.append(col3).append(col9);

        
        // cardBody.append(title).append(info);
        // card.append(img).append(cardBody);
        // link.append(card);

        

      $('#saved-articles').append(row);
    //   $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "<br />" + data[i].info + "<br />" + data[i].img + "</p>");
    }
  });
  
  
  // Whenever someone clicks a p tag
  $(document).on("click", "p", function() {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
  
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .then(function(data) {
        console.log("((((((999999999999999%%%%%%%%%%%%%%%%%%%%%%");
        console.log(data);
        // The title of the article
        $("#notes").append("<h2>" + data.title + "</h2>");
        // An input to enter a new title
        $("#notes").append("<input id='titleinput' name='title' >");
        // A textarea to add a new note body
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
        
        // If there's a note in the article
        if (data.note) {
          // Place the title of the note in the title input
          $("#titleinput").val(data.note.title);
          // Place the body of the note in the body textarea
          $("#bodyinput").val(data.note.body);
        }
      });
  });
  
  // When you click the savenote button
  $(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });
  