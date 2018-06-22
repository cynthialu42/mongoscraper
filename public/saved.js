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

        // var save = $('<a>');
        // save.addClass('btn btn-primary');
        // save.attr('href', "/save/"+data[i]._id);
        // save.text("/save/"+data[i]._id);

        

        // var numberOfComments = $('<p>');
        
        // if(data[i].note.length === 0){
        //     numberOfComments.text("0 Comments");
        // }
        // else{
        //     numberOfComments.text(data[i].note.length + " Comments");
        // }
        var comment = $('<button>');
        // comment.attr('type', 'button');
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
    //   $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "<br />" + data[i].info + "<br />" + data[i].img + "</p>");
    }
  });
  
//   $(document).on('click', '.comment-btn', function(){
//     var thisId = $(this).attr('data-id');
//     console.log(thisId);

//     $.ajax({
//         method: "GET",
//         url: "/api/saved/"+thisId
//     }).then(function(data){

//     })
//   });

  $(document).on('click', '.delete-btn', function(){
    var thisId = $(this).attr('data-id');
    console.log(thisId);

  });
  // Whenever someone clicks a p tag
  $(document).on("click", ".comment-btn", function() {
    // Empty the notes from the note section
    // $("#notes").empty();
    // Save the id from the p tag
    // $('.modal-popup').empty();
    $('.modal-header').empty();
    $('.modal-footer').empty();
    $('.modal-body').empty();

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
        // var modal = $("<div class = 'modal fade' id = 'exampleModal' tabindex= '-1' role = 'dialog'>");
        // var modalDialog = $("<div class = 'modal-dialog' role = 'document'>");
        // var modalContent = $("<div class = 'modal-content'>");
        // var modalHeader = $("<div class = 'modal-header'>");
        var modalTitle = $("<h5 class = 'modal-title'>");
        modalTitle.text(data.title);
        // var modalBody = $("<div class = 'modal-body'>");

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

        // var modalFooter = $("<div class = 'modal-footer'>");
        var close = $("<button type = 'button' class = 'btn btn-secondary' data-dismiss = 'modal'>");
        close.text("Close");
        var save = $("<button type = 'button' class = 'btn btn-primary' data-dismiss='modal' id = 'savenote'>");
        save.attr('data-id', data._id);
        save.text("Save Changes");

        $('.modal-footer').append(close).append(save);
        // modalFooter.append(close).append(save);
        // modalHeader.append(modalTitle);
        // modalContent.append(modalHeader).append(modalBody).append(modalFooter);
        // modalDialog.append(modalContent);
        // modal.append(modalDialog);

        // $(".modal-popup").append(modal);
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
    }
    
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
    location.reload();
  });
  