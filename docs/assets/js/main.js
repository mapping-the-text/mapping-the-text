$(document).ready(function() {
  let externalLink = $.parseHTML("<span>&nbsp;<i style='vertical-align: baseline; font-size: 60%;' class='fa fa-small fa-external-link-alt'></i></span>");
  $("a[href^='http']:not(a:has(img))").append(externalLink);
  // $("a[href^='http'] :not(img)").append(externalLink);
  $("a[href^='http']").attr("target", "_blank");

}); 

if($(".fixed-top").length){
  $("#main").css("margin-top",  $("#navbar").height() + $(".fixed-top").data("margin") + "px");
}

$(".profile").each(function() {
  const ghUser = $( this ).attr("id").replace(/^github-/, "");
  $.getJSON("https://api.github.com/users/" + ghUser, (data) => {
    $("#" + ghUser + "-avatar").attr("src", data.avatar_url);
  }, 
    () => { alert("Could not get GitHub user data for " + ghUser + "!"); }
           );
});
