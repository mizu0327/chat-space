$(function(){
  function buildHTML(message) {
    var imageHTML = message.image ?  ` <img src="${ message.image }" />` : "";
    var html = `<div class="main_chat__messages__message">
                    <div class="main_chat__messages__message__upper-info">
                      <div class="main_chat__messages__message__upper-info__talker">
                        ${message.user_name}
                        </div>
                      <div class="main_chat__messages__message__upper-info__date">
                        ${message.date}
                        </div>
                      </div>
                    <div class="main_chat__messages__message__text">
                      ${message.body}
                      </div>
                      ${ imageHTML }
                    </div>`;
    return html;
  };

  $('#new_message').on('submit', function(e){
    e.preventDefault()
    var formData = new FormData(this);
    var url = $(this).attr('action')
    $.ajax({
      url: url,
      type: 'POST',
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data) {
      var html = buildHTML(data);
      $('.main_chat__messages').append(html);
      $('.main_chat__messages').animate({ scrollTop: $('.main_chat__messages')[0].scrollHeight});
      $('form')[0].reset();
    })
    .fail(function(){
      alert('error');
    });
    return false;
  });

  var reloadMessages = function() {
    if (window.location.href.match(/\/groups\/\d+\/messages/)){
    var last_message_id = $(".main_chat__messages__message:last").data("message-id");
    $.ajax({
      url: 'api/messages',
      type: 'get',
      dataType: 'json',
      data: {id: last_message_id}
    })
    .done(function(messages) {
      var insertHTML = '';
      $.each(messages, function(i, message) {
        insertHTML += buildHTML(message)
      });
      $('.messages').append(insertHTML);
      if (last_message_id !== $(".main_chat__messages__message:last").data("message-id")){
        $('.main_chat__messages').animate({ scrollTop: $('.main_chat__messages')[0].scrollHeight, ‘fast’});
      }
      })
    .fail(function() {
      alert('error');
      });
    }
  };
  setInterval(reloadMessages, 7000);
});

