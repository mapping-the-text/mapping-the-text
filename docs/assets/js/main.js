$(document).ready(function() {
  // Add icon for external links.
  let externalLink = $.parseHTML("<span>&nbsp;<i style='vertical-align: baseline; font-size: 60%;' class='fa fa-small fa-external-link-alt'></i></span>");
  $("a[href^='http']:not(a:has(img))").append(externalLink);
  $("a[href^='http']").attr("target", "_blank");

  // flesh out table of contents.
  $("#tocList").append(function(){
    let contents =  ""
    $("article > h2").each(function(){
      contents += "<li class='nav-item'><a class='nav-link' href='#" + $( this ).attr("id") + "'>" + $( this ).text() + "</a></li>\n";
    });
    return contents;
  });

  // flesh out sources.
  if ($("#sourceList").length > 0){
    $(".source-list").each(function(){
      let entry = "";
      if ($( this ).data("isbn")){
        $.getJSON("https://www.googleapis.com/books/v1/volumes?q=isbn:" + $( this ).data("isbn"), (data) => {
            const book = data.items[0].volumeInfo;
            // authors
            if(book.authors){ // more than one author
              if(book.authors.length === 2){
                entry = entry + book.authors.join(" and ") + ". ";
              } else {
                entry = entry + book.authors.join(", ") + ". ";
              }
            }
            // title
            entry = entry + " <a href='" + book.previewLink + "'><em>" + book.title + "</em></a>. ";
            // Publishing
            entry = entry + "(" + book.publisher + ", " + book.publishedDate + ").";
            $( this ).html(entry);
          },
          () => { console.log("could not find isbn info for ", $( this ).data("isbn")); }
        );
      } else if ($( this ).data("doi")) {
        // do non-existent doi work.
      } else {
        const source = $( this ).data("source");
        // authors
        entry = entry + source.authors.join(", ") + ". ";
        switch (source.type) {
          case "article":
            // title
            if(source.url){
              entry = entry + "“<a href='" + source.url + "'>" + source.title + "</a>.” ";
            } else {
              entry = entry + "“" + source.title + ".” ";
            }
            // journal
            entry = entry + "<em>" + source.journalTitle + "</em> " + source.volume + "." + source.number + " (" + source.year + "), " + source.pages + "."
            break;
        }
        $( this ).html(entry);
      }
    })
  }


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
