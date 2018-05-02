// Get single resource information
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
        if($("#resource-img").data("homepage")){
          // Someday we'll pull in open graph data.
        } else if(data.data.itemType === "book"){
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

// Get resource list
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

// Get GitHub avatar.
$(".github-img").each(function() {
  const ghUser = $( this ).data("githubuser");
  $.getJSON("https://api.github.com/users/" + ghUser, (data) => {
    $( this ).attr("src", data.avatar_url);
  }, 
    () => { console.log("Couldn't get a github avatar for ", ghUser); }
           );
});


