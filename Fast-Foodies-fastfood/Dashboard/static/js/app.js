//Load the json data and call functions to construct plots
function init() {
    var selector = d3.select("#selDataset");
    d3.json("data/fastfood.json").then((data) => {
      var foodChain = data.features;
      const FoodChain = [];
      foodChain.forEach((item)=> {
          i=item.properties;   
    // Push unique values of restaurants in the FoodChain array  
            if (FoodChain.indexOf(i.Big4) == '-1') {
                FoodChain.push(i.Big4); 
                }
        })
        //sort the drop down menu list 
        sortedArr=FoodChain.sort();
        //Render the Sorted array as a dropdown 
        sortedArr.forEach((item)=> {
      //      console.log(item)
            selector 
                .append("option")
                .text(item)
                .property("value", item);
        })
    //Construct initial plots with the first data value
    createChart(sortedArr[0]); 
//    createInfo(sortedArr[0])
    
});
}
// function createInfo(id){
//     d3.json("data/samples.json").then((data) => {
//         var metadata= data.metadata;
//         var filteredId = metadata.filter(d => d.id.toString() === id);
//         showDemographics(filteredId);
    
//     });
// }  
// function showInfo(id){
//     demographics = d3.select("#sample-metadata")
//     //clear the panel 
//     demographics.html('');
//     //get the key/value pair
//     Object.entries(metadata[0]).forEach(([key, value]) => {
//         console.log(key);
//         demographics.append("h5").text(`${key} : ${value}`)
//     })
// }

function createChart(id){
    console.log("Big5", id)
    d3.json("data/fastfood.json").then((data) => {
        var foodChain = data.features;
        var filtered = foodChain.filter(d => d.properties.Big4.toString() === id);
        var big5=[], province=[], big4=[], population=[];
        filtered.forEach((item)=> {
            province.push(item.properties.province); 
            population.push(item.properties.Population);
            big4.push(item.properties.Big4) 
        })
        results=arrCount(province, population);
        states=results[0];
        scores=results[1];
        state_pop = results[2]
        console.log(states, state_pop)
        var scoresMap = {};
        //Sort the States with respect to the number of restaurants
        scores.forEach(function(el, i) {
            scoresMap[states[i]] = el;
           });
        
        states.sort(function(a, b) {
             return scoresMap[b] - scoresMap[a];
        });

        //Top ten locations 
        sorted_scores=scores.sort(function(a,b){return b-a;});
        var toptenProvince = states
                            .slice(0, 10)
                            .reverse()
                            .map(st => st);
        console.log(toptenProvince);
        var toptenScores= scores
                           .slice(0, 10)
                           .reverse();
                        //    .sort(function(a,b){return b-a;});
        console.log(toptenScores);
        // //Hover text
         var labels = "locations";
        // Build Bar charts 
        switch(id){
                case "Burger King":
                  color = "rgb(24, 84, 148)";
                  title = "Burger King";
                  image = "images/bk.png"
                  break;
                case "Taco Bell":
                  color= "rgb(104, 42, 141)";
                  title = "Taco Bell";
                  image = "images/tb.png"
                  break;
                case "McDonalds":
                  color= "rgb(255 199 44)";
                  title = "McDonald's";
                  image = "images/Mcdonalds.png"
                  break;
                case "Subway":
                  color= "rgb(0, 140, 21)";
                  title = "Subway";
                  image = "images/subway.png"
                  break;
                case "Wendys":
                  color= "rgb(221, 20, 56)";
                  title = "Wendys";
                  image = "images/Wendys.png"
                  break;
                }
        var trace = {
            x: toptenScores,
            y: toptenProvince,
            text: labels,
            // marker: {color: 'rgb(106, 83, 184)'},
            marker: {color: color},
            type:"bar",
            orientation: "h"
            };
        var layout = {
            title: "<b>"+title+"</b>",
            height: 500,
		  	    width: 600,
             "titlefont": {
                "size": 20
              },
            yaxis: {
                 tickmode: "linear",
             },
            margin: {
                l: 100,
                r: 100,
                t: 50,
                b: 20
            },
            images: [
              {
                x: 0.3,
                y: 1.02,
                sizex: 0.1,
                sizey: 0.1,
                source: image,
                xanchor: "right",
                xref: "paper",
                yanchor: "bottom",
                yref: "paper"
              }
            ],

            
         };
        //Plot the bars
        Plotly.newPlot("bar", [trace], layout)
    })
}

function optionChanged(id) {
    console.log("In OptionChanged "+ id);
    // createDemographics(id);
    createChart(id);
   };

 init();
//Count the restaurants by states; Returns 3 lists 
//a => sorted array of states; 
//b => number of times each states repeats
//c => Population for each zip code summed up
function arrCount(states, pop) {
    var a = [],
      b = [],
      c = [],
      prev;
    states.sort();
    for (var i = 0; i < states.length; i++) {
      if (states[i] !== prev) {
        a.push(states[i]);
        b.push(1);
        c.push(parseInt(pop[i]))
      } else {
        b[b.length - 1]++;
        c[c.length -1] = parseInt(c[c.length -1]) + parseInt(pop[i])
      }
      prev = states[i];
    }
  
    return [a, b, c];
  }
  
 
