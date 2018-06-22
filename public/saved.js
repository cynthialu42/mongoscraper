// Grab the articles as a json
$.getJSON("/api/saved", function(data) {
    for (var i = 0; i < data.length; i++) {
        var row = $('<div>');
        row.addClass('row article-style');

        var col3 = $('<div>');
        col3.addClass('col-3');
     
        var img = $('<img>');
        img.attr('src', data[i].img);
        img.addClass('img-style');

        col3.append(img);

        var col8 = $('<div>');
        col8.addClass('col-8');

        var link = $('<a>');
        link.addClass('link-style');
        link.attr('href', data[i].link);

        var title = $('<h3>');
        title.addClass('card-title').text(data[i].title);

        link.append(title);

        var info = $('<p>');
        info.addClass('card-text').text(data[i].info);

        var comment = $('<button>');
        comment.attr('data-toggle', 'modal');
        comment.attr('data-target', '#exampleModal');
        comment.attr('data-id', data[i]._id);
        comment.addClass('comment-btn');
        comment.text(data[i].note.length + " Comments");

        col8.append(link).append(info).append(comment);

        var col1 = $('<div>');
        col1.addClass('col-1');

        var button = $('<a>');
        button.addClass('delete-btn');
        button.attr('href', '/delete/'+data[i]._id);
        var ximg = $('<i>');
        ximg.addClass('fas fa-times');
        button.attr('data-id', data[i]._id);

        button.append(ximg);
        col1.append(button);
        row.append(col3).append(col8).append(col1);

      $('#saved-articles').append(row);
    }
  });

  $(document).on("click", ".comment-btn", function() {
    // Empty the notes from the note section
    $('.modal-header').empty();
    $('.modal-footer').empty();
    $('.modal-body').empty();

    var thisId = $(this).attr("data-id");
  
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      .then(function(data) {
 
        var modalTitle = $("<h5 class = 'modal-title'>");
        modalTitle.text(data.title);

        $('.modal-header').append(modalTitle);
        for( var i = 0; i < data.note.length; i++){
            console.log(i);
            var notesBlock = $('<div class = "d-flex">');
            var prevName = $("<p class = 'text-left' style = 'width: 30%;left:0;'>");
            prevName.text(data.note[i].title +" :");

            var prevComment = $("<p class = 'text-left' style = 'width: 70%;left:0;'>");
            prevComment.text(data.note[i].body);
            notesBlock.append(prevName).append(prevComment);
            $('.modal-body').append(notesBlock);
        }


        var form = $("<form>");
        var nameGroup = $("<div class='form-group'>");
        var nameLabel = $('<label for="titleinput" class="col-form-label">');
        nameLabel.text('Name:');
        var name = $("<input id = 'titleinput' name = 'title' type = 'text' class = 'form-control' placeholder='Enter your name'>");
        nameGroup.append(nameLabel).append(name);
        

        var commentGroup = $("<div class='form-group'>");
        var commentLabel = $('<label for="bodyinput" class="col-form-label">');
        commentLabel.text('Comment:');
        var commentArea = $("<textarea id = 'bodyinput' name = 'body' class = 'form-control' placeholder = 'Enter a comment'>");
        commentGroup.append(commentLabel).append(commentArea);

        form.append(nameGroup).append(commentGroup);

        $('.modal-body').append(form);

        var close = $("<button type = 'button' class = 'btn btn-secondary' data-dismiss = 'modal'>");
        close.text("Close");
        var save = $("<button type = 'button' class = 'btn btn-primary' data-dismiss='modal' id = 'savenote'>");
        save.attr('data-id', data._id);
        save.text("Save Changes");

        $('.modal-footer').append(close).append(save);

      });
  });
  
  // When you click the savenote button
  $(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
    console.log($("#titleinput").val());
    if($("#titleinput").val() == "" || $("#bodyinput").val() == ""){
        console.log('EMPTY');
    }
    else{
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
            .then(function(data) {
            console.log(data);
            $("#notes").empty();
        });
    }
    
    $("#titleinput").val("");
    $("#bodyinput").val("");
    location.reload();
  });
  