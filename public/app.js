// Grab the articles as a json
$.getJSON("/articles", function(data) {

    for (var i = 0; i < data.length; i++) {
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
        save.addClass('btn btn-outline-dark btn-sm save-btn');
        save.attr('href', "/save/"+data[i]._id);
        save.attr('data-id', data[i]._id);
        save.attr('data-toggle', "popover");
        save.attr('data-trigger', 'focus');
        save.attr('data-content', 'saved!');
        save.text("save");

        col9.append(link).append(info).append(save);

        row.append(col3).append(col9);

      $('#articles').append(row);
    }
  });
  
  $(document).on("click", ".save-btn", function(){
    var thisId = $(this).attr('data-id');
    console.log(thisId);
      $('.save-btn').addClass('btn-secondary');
      $('.save-btn').removeClass('btn-primary');
  });
  $(document).ready(function(){
    $('[data-toggle="popover"]').popover();
    $('.popover-dismiss').popover({
        trigger: 'focus'
      });
  });
