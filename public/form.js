$(window).on('load', function() {
    checkSupported();
  
    var form = $('#form')[0];
    var URI = 'https://example.com/submit';
  
    $('#email-form')
      .parsley()
      .on('field:validated', function() {
        var ok = $('.parsley-error').length === 0;
        $('.bs-callout-info').toggleClass('hidden', !ok);
        $('.bs-callout-warning').toggleClass('hidden', ok);
      })
      .on('form:submit', function() {
        var formData = new FormData(form);
        sendAJAX(formData);
        return false;
      });
  
    function sendAJAX(data) {
      $('#result-message-div').css('display', 'none');
      $("button[id='submit']").prop('type', 'button');
      $('#submit').html("Sending...   <i class='fas fa-spinner fa-spin'></i>");
      axios({
        method: 'post',
        url: URI,
        data: data,
        config: { headers: { 'Content-Type': 'multipart/form-data' } }
      })
        .then(function(response) {
          // handle success
          $('#result-message-heading')
            .css('color', 'white')
            .html('Thank you!');
          displayResultMessage(response.data);
          $('#email-form').trigger('reset');
          resetFormMessages();
        })
        .catch(function(error) {
          // handle error
          resetFormMessages();
          $('#result-message-heading')
            .css('color', 'red')
            .html('UH OH!');
  
          if (error.response) {
            displayResultMessage(
              "<span style='color: red'>" + error.response.data + '</span>'
            );
          } else {
            displayResultMessage(
              "<span style='color: red'>Something went wrong! Please try again!</span>"
            );
          }
        })
        .then(function() {
          // always executed
        });
    }
  
    function resetFormMessages() {
      $("button[id='submit']").prop('type', 'submit');
      $('#submit').html('Submit');
    }
  
    function displayResultMessage(response) {
      $('#result-message-div').css('display', 'block');
      $('#result-message').html(response);
      $('html, body').animate(
        {
          scrollTop: $('#result-message-div').offset().top
        },
        1000
      );
    }
  
    function supportAjaxFilesFormdata() {
      return supportAjaxUpload() && supportFormData();
      // Is XHR supported?
      function supportAjaxUpload() {
        var xhr = new XMLHttpRequest();
        return !!xhr;
      }
      // Is FormData supported?
      function supportFormData() {
        return !!window.FormData;
      }
    }
    function checkSupported() {
      if (!supportAjaxFilesFormdata()) {
        var elements = form.elements;
        for (var i = 0, len = elements.length; i < len; ++i) {
          elements[i].readOnly = true;
        }
        $("button[id='submit']").prop('type', 'button');
        $('#submit').html('Disabled');
        $('#supportMessage').html(
          'Sorry. Your browser is not supported. Please update or or try a different browser.'
        );
      }
    }
  });
  