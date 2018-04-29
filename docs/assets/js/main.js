// flesh out source list
$(document).ready(function() {
  if ($("#sourceList").length > 0){
    $.getJSON("https://api.zotero.org/groups/2178810/items?include=bib", (data) => {
        $(".source-list").each(function(){
          $( this ).html( (_, old) => {
              return data.filter((el) => {
              return el.key === $( this ).data("zoterokey");
            })[0].bib.replace(/<\/div>\n<\/div>$/,  " (<a href='/sources/" + old + "'>our notes</a>)</div></div>");
          });
        });
        $(".csl-bib-body").each(function(){
          $( this ).attr("style", "");
        });
      },
      () => { console.log("<li>Could not load Zotero library</li>"); }
    );
  }
});

$(document).ready(function() {
  // Add icon for external links.
  let externalLink = $.parseHTML("<span>&nbsp;<i style='vertical-align: baseline; font-size: 60%;' class='fa fa-small fa-external-link-alt'></i></span>");
  $("a[href^='http']:not(a:has(img))").append(externalLink);
  $("a[href^='http']").attr("target", "_blank");

  // flesh out table of contents.
  $("#tocList").append(function(){
    let contents =  ""
    $("article > h2").each(function(){
      contents += "<div class='nav-item'><a class='nav-link' href='#" + $( this ).attr("id") + "'>" + $( this ).text() + "</a></div>\n";
    });
    return contents;
  });

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
