$(document).ready(function() {
  let externalLink = $.parseHTML("<span>&nbsp;<i class='fa fa-small fa-external-link'></i></span>");
  $("a[href^='http']:not(a:has(img))").append(externalLink);
  // $("a[href^='http'] :not(img)").append(externalLink);
  $("a[href^='http']").attr("target", "_blank");


  $("#abstract").on("keyup", function() {
    if (this.value.match(/\S+/g)){
      let words = this.value.match(/\S+/g).length;

      if (words > 200) {
        // Split the string on first 200 words and rejoin on spaces
        var trimmed = $(this).val().split(/\s+/, 200).join(" ");
        // Add a space at the end to make sure more typing creates new words
        $(this).val(trimmed + " ");
      }
      else {
        $("#display_count").text(words);
        $("#word_left").text(200-words);
      }
    }
  });

  $("#bio").on("keyup", function() {
    if (this.value.match(/\S+/g)){
      let words = this.value.match(/\S+/g).length;

      if (words > 25) {
        // Split the string on first 200 words and rejoin on spaces
        var trimmed = $(this).val().split(/\s+/, 25).join(" ");
        // Add a space at the end to make sure more typing creates new words
        $(this).val(trimmed + " ");
      }
      else {
        $("#display_count_bio").text(words);
      }
    }
  });
}); 

$("#alert").html("<h2>Registration is <i>Mandatory</i></h2>");

var request;
$("#submission").submit(function(event){
  event.preventDefault();
  if(request){ request.abort(); }

  // var form = $( this );
  var serializedData = $( this ).serialize();
  var inputs = $( this ).find("#name, #email, #abstract, #bio, #url");
  var name = $("#name").val();
  var email = $("#email").val();
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  if (!regex.test(email)){
    $("#alert").addClass("alert alert-danger").html("The email address does not appear valid.");
    request.abort();
  } else {
    inputs.prop("disabled", true);
    request = $.ajax({
      type: "get",
      url: "https://script.google.com/a/nyu.edu/macros/s/AKfycbwxWSylUgl8I9_EF21f5TopJZXBmkhaHS3UROY-ptC---5uu-o/exec",
      data: serializedData
    });
    // request.done(function (response, textStatus, jqXHR){
    request.done(function (){
      $("#alert").removeClass("alert alert-danger");
      $("#alert").addClass("alert alert-success").html("Thank you for your registration, " + name + ". See you in April!");
    });

    request.fail(function (jqXHR, textStatus, errorThrown){
      $("#alert").addClass("alert alert-danger").html("The following error occurred: "+
        textStatus + ", " +  errorThrown);
    });

    request.always(function () {
      inputs.prop("disabled", false);
    });
  }
});
