// Get resource information
$(document).ready(function() {
  $(".resource-article").each(function(){
    const zoterokey = $( this ).data("zoterokey");
    $.getJSON("https://api.zotero.org/groups/2178810/items/" + zoterokey + "?include=bib,citation,data", (data) => {
        document.title = data.citation.replace(/<\/*span>/g, "").replace(/<\/*i>/g, "_") + " | Mapping the Text";
        $(".resource-title").each(function(){
          let title;
          if(data.data.itemType === "journalArticle") {
            title = "“" + data.data.title + "”";
          } else {
            title = data.data.title;
          }
          $( this ).html(title);
        });
        $(".resource-authors").each(function(){
          $( this ).html(() => {
            return data.data.creators.filter((el) => {
              return el.creatorType === "author";
            }).map((el) => {
              return el.firstName + " " + el.lastName;
            }).join(", ");
          });
        });
        $(".resource-citation").each(function(){
          $( this ).html("Citation: " + data.bib);
          $(".csl-bib-body").each(function(){
            $( this ).attr("style", "");
          });
        });
        if(data.data.itemType === "book"){
          const isbn = data.data.ISBN.replace(/-/g, "");
          $.getJSON("https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn, (data) => {
              $("#resource-img").attr("src", data.items[0].volumeInfo.imageLinks.thumbnail).attr("style", "display: block;");
            }, 
            () => { console.log("Could not get book image from Google books"); }
          );
        }
      },
      () => { console.log("Could not load Zotero item"); }
    );
  });
});
// flesh out resource list
$(document).ready(function() {
  if ($(".resource-list").length > 0 || $(".resource-citation").length > 0){
    $.getJSON("https://api.zotero.org/groups/2178810/items?include=bib,citation", (data) => {
        $(".resource-citation").each(function(){
          $( this ).html(() => {
            return data.filter((el) => {
              return el.key === $( this ).data("zoterokey");
            })[0].citation;
          });
        });
        $(".resource-list").each(function(){
          $( this ).html( (_, old) => {
              return data.filter((el) => {
              return el.key === $( this ).data("zoterokey");
            })[0].bib.replace(/<\/div>\n<\/div>$/,  " (<a href='/resources/" + old + "'>our notes</a>)</div></div>");
          });
        });
        $(".csl-bib-body").each(function(){
          $( this ).attr("style", "");
        });
      },
      () => { console.log("Could not load Zotero library"); }
    );
  }
});

// Add icon for external links & flesh out ToC
$(document).ready(function() {
  let externalLink = $.parseHTML("<span>&nbsp;<i style='vertical-align: baseline; font-size: 60%;' class='fa fa-small fa-external-link-alt'></i></span>");
  $("a[href^='http']:not(a:has(img))").append(externalLink);
  $("a[href^='http']").attr("target", "_blank");

  // flesh out table of contents.
  $("#tocList").append(function(){
    let contents =  ""
    $("article > h2").each(function(){
      contents += "<div class='nav-item'><a class='nav-link' href='#" + $( this ).attr("id") + "'>" + $( this ).text() + "</a></div>\n";
    });
    if(contents.length > 0){
      $("#tocDiv").attr("style", "display: block;");
    }
    return contents;
  });
}); 


// Bump down content
if($(".fixed-top").length){
  $("#main").css("margin-top",  $("#navbar").height() + $(".fixed-top").data("margin") + "px");
}

// Feed in GitHub avatar.
$(".github-img").each(function() {
  const ghUser = $( this ).data("githubuser");
  $.getJSON("https://api.github.com/users/" + ghUser, (data) => {
    $( this ).attr("src", data.avatar_url);
  }, 
    () => { console.log("Couldn't get a github avatar for ", ghUser); }
           );
});

// Make the first paragraph a lead.
$("article p").first().addClass("lead");

// filter by tags.
$(document).ready(function(){
  $("#resetTags").click(() => {
    console.log("Reset clicked");
    $(".resource").each(function(){
      $( this ).attr("style", "display: list-item;").addClass("legit-resource");
    });
    $("#tagPool > a > .badge-tag").each(function(){
      $( this ).removeClass("clicked-badge");
    });
  });
  $("#tagPool > a > .badge-tag").click(filterSources);
});

function filterSources(){
  $(".resource").each(function(){
    $( this ).removeClass("filtered-resource").attr("style", "display: list-item");
  });
  $( this ).toggleClass("clicked-badge");
  // button.toggleClass("clicked-badge");
  const selectedTags = $("#tagPool > a > .clicked-badge").map(function(){
    return $( this ).data("tag");
  });
  $(".resource").filter(function(){
    for(let i = 0 , len = selectedTags.length; i < len; i = i + 1){
      if($( this ).data("tags").split(" ").includes(selectedTags[i]) === false) return false;
    }
    return true;
  }).addClass("filtered-resource");
  $(".resource").each(function(){
    if(!$( this ).hasClass("filtered-resource")){
      $( this ).removeClass("legit-resource").attr("style", "display: none;");
    }
  });
}

// Feed in last modified.
function fetchHeader(url, wch) {
  try {
    var req=new XMLHttpRequest();
    req.open("HEAD", url, false);
    req.send(null);
    if(req.status === 200){
      return req.getResponseHeader(wch);
    }
    else { return "Failed to get 200 status"; }
  } catch(er) {
    return "Failed to get date."
  }
}

const lastMod = fetchHeader(location.href, "Last-Modified");
$("#last-modified").html(lastMod.replace(/ \S+ \S+$/, ""));

