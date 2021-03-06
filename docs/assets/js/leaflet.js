if ($("#travel").length > 0){
  const map = L.map("travel", {
    center: [40.730833, -73.9975],
    zoom: 16,
    minZoom: 14
  });
  L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>' }).addTo(map);

  const places = [
    { name: "W. 4th St.-Washington Sq. (A, C, E, B, D, F, M)",
      coords: [40.731113, -74.001224],
      icon: "subway"
  },
    { name: "8th St.-NYU (R, W [N, Q])",
      coords: [40.730641, -73.992684],
      icon: "subway"
  },
    { name: "Bobst Library",
      coords: [40.729628, -73.997293],
      icon: "book"
  },
    { name: "244 Greene",
      coords: [40.730024, -73.994911],
      icon: "graduation-cap"
  },
    { name: "Washington Sq. Hotel",
      coords: [40.732675, -73.998731],
      icon: "bed"
  },
    { name: "NY Dosa Truck",
      coords: [40.731032, -73.998967],
      icon: "utensils"
  },
    { name: "Mamoun’s Falafel",
      coords: [40.730186, -74.000473],
      icon: "utensils"
  },
    { name: "Ben’s Pizzeria",
      coords: [40.730604, -74.000419],
      icon: "utensils"
  },
    { name: "Tiny Atlas Café",
      coords: [40.728791, -73.994798],
      icon: "utensils"
  }
  ];
  const placesLayer = L.layerGroup();
  places.forEach( place => {
    placesLayer.addLayer(L.marker(place.coords,
      { icon: L.divIcon(
        { html: "<i class='fa fa-" + place.icon + "'></i>", iconSize: [30, 30] }
      )}
    ).bindTooltip(place.name))
  });
  placesLayer.addTo(map);
}


if ($("#baburnama").length > 0){
  let map = L.map("baburnama", {
    zoom: 4,
    minZoom: 4,
    center: [31.952162238024975, 69.91699218750001],
    maxBounds: L.latLngBounds([[3.037, 24.565], [52, 98.426]])
  });
  L.tileLayer("/assets/tiles/{z}/{x}/{y}.png", {
      attribution: "&copy; <a href='http://www.naturalearthdata.com/'>Natural Earth Data</a> | Geospatial and sentiment analysis on <em>The Baburnama</em> (1530)<br /> by Sriharsha Devulapalli and Manan Ahmed using <a href='http://nywalker.newyorkscapes.org/'>NYWalker</a>, by Moacir P. de Sá Pereira",
      tms: true,
      maxZoom: 10,
      maxNativeZoom: 8
    }).addTo(map);
    map.setZoom(4);

  var getSentiment = function(callBack){
    $.getJSON("https://mananahmed.github.io/baburnama/json-files/sentiment-analysis.json", function(sentiments){
      let constants = {};
      let folioSentiments = [];
      for (let i = 1; i < 383; i += 1){
        let entry = {folio: i};
        const sentimentsArray = sentiments.data.filter( row => (Number(row.folio) === i || Number(row.folio.replace(/b$/, "").replace(/^0*/, "")) === i) );
        const polarities = sentimentsArray.map( row => row.polarity );
        const subjectivities = sentimentsArray.map( row => row.subjectivity );
        entry.polarity = polarities.reduce((s, v) => s + v) / 2;
        entry.subjectivity = subjectivities.reduce((s, v) => s + v) / 2;
        entry.year = sentimentsArray[0].year;
        folioSentiments.push(entry);
      }
      const polarities = folioSentiments.map(folio => folio.polarity);
      const subjectivities = folioSentiments.map(folio => folio.subjectivity);
      constants.avgPolarity = polarities.reduce((s, v) => s + v) / folioSentiments.length;
      constants.avgSubjectivity = subjectivities.reduce((s, v) => s + v) / folioSentiments.length;
      constants.sdPolarity = Math.sqrt((polarities.reduce((s, v) => s + Math.pow(v - constants.avgPolarity, 2))) / (folioSentiments.length - 1));
      constants.sdSubjectivity = Math.sqrt((subjectivities.reduce((s, v) => s + Math.pow(v - constants.avgSubjectivity, 2))) / (folioSentiments.length - 1));
      callBack(folioSentiments, constants);
    });
  };

  var norms = [];
  getSentiment(function(folioSentiments){
    $.getJSON("https://mananahmed.github.io/baburnama/json-files/the-baburnama-1530_places.geo.json", function(data){
      let polarities = [];
      turf.featureEach(data, feature => {
        const pages = $.unique(feature.properties.pages);
        feature.properties.polarities = pages.map( page => {
          return folioSentiments.filter( folio => folio.folio === page)[0].polarity;
        });
        feature.properties.avgPolarity = ss.mean(feature.properties.polarities);
        polarities.push(feature.properties.avgPolarity);
      });
      const avgPolarity = ss.mean(polarities);
      const sdPolarity = ss.standardDeviation(polarities);
      turf.featureEach(data, feature => {
        feature.properties.polarityNorm = ss.zScore(feature.properties.avgPolarity, avgPolarity, sdPolarity);
        norms.push(feature.properties.polarityNorm);
        if(feature.properties.polarityNorm > 2) {
          feature.properties.fillColor = "#dc322f";
        } else if (feature.properties.polarityNorm > 1) {
          feature.properties.fillColor = "#cb4b16";
        } else if (feature.properties.polarityNorm < -2) {
          feature.properties.fillColor = "#6c71c4";
        } else if (feature.properties.polarityNorm < -1) {
          feature.properties.fillColor = "#268bd2";
        } else {
          feature.properties.fillColor = "#b58900";
        }
        if (feature.properties.instance_count > 17) {
          feature.properties.radius = 7;
          feature.properties.opacity = 1;
        } else if (feature.properties.instance_count > 12) {
          feature.properties.radius = 7;
          feature.properties.opacity = 0.8;
        } else if (feature.properties.instance_count > 3) {
          feature.properties.radius = 7;
          feature.properties.opacity = 0.6;
        } else {
          feature.properties.radius = 4;
          feature.properties.fillColor = "#657b83";
        }

      });
      let points = L.geoJson(data, {
        pointToLayer: function(f, ll){
          return L.circleMarker(ll, {
            fillOpacity: f.properties.opacity,
            radius: f.properties.radius,
            fillColor: f.properties.fillColor,
            weight: 1,
            color: "#657b83"}).bindPopup(`<h4>${f.properties.name}</h4><p><strong>Referred to as:</strong> ${f.properties.nicknames}<br /><strong>Mentioned:</strong> ${f.properties.instance_count} times<br /><strong>Sentiment polarity (normed):</strong> ${f.properties.polarityNorm.toFixed(3)}`).bindTooltip(f.properties.name);}
      }).addTo(map);
    });
  });
}
