// building the metadata and plots design essentials
var dataVisuals = function (metadata, otuValues, sampleValues, hoverText, xValues, yValues, labels) {
  
   var panel = d3.select("#sample-metadata");
   panel.html("");
    Object.entries(metadata).forEach(([key, value]) => {
      panel.append("h6").text(`${key}: ${value}`);
    });
        
 //creating bar graph     
      var trace1 = {
          x: sampleValues,
          y: otuValues,
          text: hoverText,
          marker: {
          color: 'olive'},
          type:"bar",
          orientation: "h",
      };

      var data = [trace1];
    
          
    var layout = {
        title: "Top 10 OTU",

        margin: {
          l: 150,
          r: 50,
          b: 50,
          t: 30,
         
        },
               
            };
    
    Plotly.newPlot("bar", data, layout);
    
    //creating bubble plot
    var trace2 = {
    
    
      x: xValues,
      y: yValues,
      mode: "markers",
      marker:{
          size: yValues,
          color: xValues,
          colorbar: {
            thickness: 20,
            y: 0.5,
            ypad: 0,
            title: 'OTU IDs',
            titleside: 'bottom',
            outlinewidth: 1,
            outlinecolor: 'black'
          }
          
      },
      text:  labels

  };
  
          // set the layout for the bubble plot
          var layout_2 = {
              xaxis:{title: "OTU ID"},
              yaxis: {title:"sample values"},
              height: 600,
              width: 1000
          };
  
          // creating data variable 
          var data1 = [trace2];
  
      // create the bubble plot
      Plotly.newPlot("bubble", data1, layout_2); 

  };

//filtering  metadata and plots
  var optionChanged = function(newSample){

    d3.json("samples.json").then(function(data){
    
    var sampleFiltered = data["samples"].filter(function(sample){
      return sample.id ==newSample;
    })


    var metadataFiltered = data["metadata"].filter(function(metadata){
      return metadata.id ==newSample;

    });

    otu = sampleFiltered[0]["otu_ids"].slice(0, 10).reverse();

    otuValues = otu.map(d => "OTU " + d);
    
    sampleValues =  sampleFiltered[0]["sample_values"].slice(0,10).reverse();
  
    hoverText =  sampleFiltered[0]["otu_labels"].slice(0,10); 

    xValues = sampleFiltered[0]["otu_ids"]
    yValues = sampleFiltered[0]["sample_values"]
    labels = sampleFiltered[0]["otu_labels"]
    dataVisuals(metadataFiltered[0], otuValues, sampleValues, hoverText, xValues, yValues, labels)
    });

  }
 

function init() {
  // select dropdown menu 
  var dropdown = d3.select("#selDataset");

  // read the data 
  d3.json("samples.json").then((data)=> {
      // console.log(data)

      // get the id data to the dropdwown menu
      data.names.forEach(function(name) {
          dropdown.append("option").text(name).property("value");
      });

      //display the data and the plots to the page
      otu = data["samples"][0]["otu_ids"].slice(0, 10).reverse();

      otuValues = otu.map(d => "OTU " + d);
          
      sampleValues =  data["samples"][0]["sample_values"].slice(0,10).reverse();
        
      hoverText =  data["samples"][0]["otu_labels"].slice(0,10); 
      
      
      xValues = data["samples"][0]["otu_ids"];
      yValues = data["samples"][0]['sample_values']
      labels = data["samples"][0]["otu_labels"]
      metadata = data["metadata"][0];
      dataVisuals(metadata, otuValues, sampleValues, hoverText, xValues, yValues, labels);
  });
}

init();


