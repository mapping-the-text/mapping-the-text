// Add icon for external links & flesh out ToC
$(document).ready(function() {
  let externalLink = $.parseHTML("<span>&nbsp;<i style='vertical-align: baseline; font-size: 60%;' class='fa fa-small fa-external-link-alt'></i></span>");
  $("a[href^='http']:not(a:has(img))").append(externalLink);
  $("a[href^='http']").attr("target", "_blank");

  // flesh out table of contents.
  if($( "h2" ).not(".resource-authors").length > 0 ){
    $("#tocList").append(function(){
      let contents =  ""
      $("article > h2").not(".resource-authors").each(function(){
        contents += "<div class='nav-item'><a class='nav-link' href='#" + $( this ).attr("id") + "'>" + $( this ).text() + "</a></div>\n";
      });
      if(contents.length > 0){
        $("#tocDiv").attr("style", "display: block;");
      }
      return contents;
    });
  }
}); 

// Bump down content
if($(".fixed-top").length){
  $("#main").css("margin-top",  $("#navbar").height() + $(".fixed-top").data("margin") + "px");
}

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

