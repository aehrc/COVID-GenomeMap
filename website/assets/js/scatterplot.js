// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 20, bottom: 30, left: 50},
    width = 900 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;


var dataset = [];
var point_to_zoom_to;

// var xAxis = d3.axisBottom(x);
var zoom = d3.zoom()
    .scaleExtent([1, Infinity])
    .translateExtent([[0, 0], [width, height]])
    .extent([[0, 0], [width, height]])
    .on("zoom", zoomed);

// var yAxis = d3.axisLeft(y);
var svg = d3.select("body").select("#container")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height  + margin.top + margin.bottom)
    .append("g")
        .attr("id", "the_g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");
    // .call(zoom);

var rect = svg.append("rect")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .style("fill", "none")
      .style("pointer-events", "all")
      // .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .call(zoom);


var clip = svg.append("defs").append("SVG:clipPath")
      .attr("id", "clip")
      .append("SVG:rect")
      .attr("width", width )
      .attr("height", height )
      .attr("x", 0)
      .attr("y", 0);


var x = d3.scaleLinear()
    .domain([0, 1])
    .range([ 0, width ]);
var xAxis = svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
var y = d3.scaleLinear()
    .domain([0, 1])
    .range([ height, 0]);
var yAxis = svg.append("g")
    .call(d3.axisLeft(y));



// Define the div for the tooltip
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
var scatter = svg.append('g')
    .attr("clip-path", "url(#clip)");


function unique(x) {
    return x.reverse().filter(function (e, i, x) {return x.indexOf(e, i+1) === -1;}).reverse();
}

// Get the data
$.ajax({
    url: '../../covid19data/kmerSigs.csv',
    type: 'get',
    success: function(csv_string) {
        var data_a = d3.csvParseRows(csv_string);
        var data_headers = data_a.shift();
        var data = data_a.map(function (row_array) {
            return data_headers.reduce(function (row_obj, val, header_i) {
                row_obj[val] = row_array[header_i];
                return row_obj;
            }, {});
        });


        // Scale the range of the data
        // x.domain(d3.extent(data, function(d) { return d.date; }));
        x.domain([0, d3.max(data, function(d){return d.PCA1; })]);
        y.domain([0, d3.max(data, function(d) { return d.PCA2; })]);


        data.forEach(function(d,i){
          var the_id = d.id;
              the_id = the_id.replace("/", "");
              the_id = the_id.replace("|", "_");
              the_id = the_id.replace("|", "_");
          dataset.push({"PCA1": d.PCA1, "PCA2": d.PCA2, "id": the_id, "class": d.class});
        });



      // Add circles
      // Add the scatterplot
        // svg.selectAll("dot")
      scatter.selectAll('circle')
            .data(data)
          .enter().append("circle")
            .attr("r", function(d){ return (d.mSize/d.bSize); })
            .attr("cx", function(d) { return x(d.PCA1); })
            .attr("cy", function(d) { return y(d.PCA2); })
            .attr("class", function(d){
              var the_id = d.id;
              the_id = the_id.replace("/", "");
              the_id = the_id.replace("|", "_");
              the_id = the_id.replace("|", "_");
             return the_id;
           })
            .attr("data-legend",function(d) { return d.class;})
            .style("opacity", 0.3)
            .style("fill", function(d) { return d.color; })
            .on("click", function(d){

              d3.selectAll('circle').classed("clicked", false);
              scatter.selectAll("circle").style("stroke", "transparent").style("opacity", 0.3);
              d3.select(this).classed("clicked", true);
              d3.select(this).style("stroke", "black");
              d3.select(this).style("opacity", 1);

              var the_id = d.id;
              the_id = the_id.replace("/", "");
              the_id = the_id.replace("|", "_");
              the_id = the_id.replace("|", "_");
              document.getElementById("data_id").value = the_id;
              // d3.select(this).classed("clicked", true);

            })
            .on("mouseover", function(d) {
                var the_id = d.id;
              the_id = the_id.replace("/", "");
              the_id = the_id.replace("|", "_");
              the_id = the_id.replace("|", "_");
              // d3.select(this).classed("mouseover", true);
              // d3.select(this).classed("mouseout", false);

                d3.select(this).style("stroke", "black");
                d3.select(this).style("opacity", 1);
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div .html(the_id)
                    .style("left", (d3.event.pageX ) + "px")
                    .style("top", (d3.event.pageY - 30) + "px");
                })
            .on("mouseout", function(d) {
                var item_class = d3.select(this).attr("class");

                if(item_class.includes("clicked")){
                    return;
                }else{
                   d3.select(this).style("stroke", "transparent");
                  d3.select(this).style("opacity", 0.3);
                  div.transition()
                    .duration(500)
                    .style("opacity", 0);
                  }

            });



        svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width  /2)
        .attr("y", height  + 30)
        .text("PCA1");


        // Add the text label for the Y axis
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x",0 - (height  / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("PCA2");


        var legendData = d3.values(data.map(function (d) { return d.color; }));
        var unique_values = unique(legendData.map(function(d){return d}));

        var legendDataid = d3.values(data.map(function (d) { return d.class; }));
        var unique_values_id = unique(legendDataid.map(function(d){return d}));


        var legend = svg.selectAll(".legend")
          .data(unique_values)
        .enter().append("g")
          .attr("class", "legend")
          .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });


        legend.append("rect")
          .attr("x",  100)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", function(d) {return d;});

        legend.append("text")
          .attr("x",  90)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "end")
          .text(function(d, i) { return unique_values_id[i]; });


        zoom_clicked();
    }
});


function filter_data(id){
  point_to_zoom_to = dataset.filter(function(d){return d.id == id;});
  console.log(point_to_zoom_to);
  var classed = String("circle." + id);

  console.log(scatter.selectAll("circle"));
  console.log(scatter.selectAll(classed));
  scatter.selectAll("circle").style("stroke", "transparent").style("opacity", 0.3);
  scatter.selectAll(classed).style("stroke", "black").style("opacity", 1);



  }

document.getElementById("reset").addEventListener("click", reset_clicked);

function reset_clicked() {
  console.log("reset clicked!")
    rect.transition().duration(750).call(
      zoom.transform,
      d3.zoomIdentity,
      d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
    );
    scatter.selectAll("circle").style("stroke", "transparent").style(
      "opacity", 0.3);
    scatter.selectAll("circle").classed("clicked", false);
  }

document.getElementById("example").addEventListener("click", example);
function example(){
  document.getElementById("data_id").value = "Australia/VIC01|EPI_ISL_406844|2020-01-25";
  zoom_clicked()
}
document.getElementById("submit").addEventListener("click", zoom_clicked);
function zoom_clicked() {
  console.log("zoom clicked!");


  var data_id = document.getElementById("data_id").value;
  data_id = data_id.replace("/", "");
  data_id = data_id.replace("|", "_");
  data_id = data_id.replace("|", "_");
  console.log(data_id);
  selected_id = data_id;
  zoom_scale = document.getElementById("zoom_scale").value;

  filter_data(selected_id);
  if(selected_id != ""){

    // svg.call(zoom.event); // https://github.com/mbostock/d3/issues/2387
  rect.call(zoom);
  // Record the coordinates (in data space) of the center (in screen space).

  var center0 = [point_to_zoom_to[0].PCA1, point_to_zoom_to[0].PCA2];
  translate0 = [d3.zoomTransform(rect).x, d3.zoomTransform(rect).y];
  coordinates0 = [x(center0[0]), y(center0[1])];
  zoom.scaleBy(rect, d3.zoomTransform(rect).k * Math.pow(2, +1));

  // Translate back to the center.
  var center1 = coordinates0;
  // zoom.translate([translate0[0] + center0[0] - center1[0], translate0[1] + center0[1] - center1[1]]);

  rect.transition().duration(750).call(
      zoom.transform,
      d3.zoomIdentity.translate(width / 2, height / 2).scale(zoom_scale).translate(translate0[0] + center0[0] - center1[0], translate0[1] + center0[1] - center1[1])
    );

  }

}


function zoomed() {
  // if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
  console.log("zooming");
  // recover the new scale
    var newX = d3.event.transform.rescaleX(x);
    var newY = d3.event.transform.rescaleY(y);

    // update axes with these new boundaries
    xAxis.call(d3.axisBottom(newX))
    yAxis.call(d3.axisLeft(newY))

    // update circle position
    svg
      .selectAll("circle")
      .attr('cx', function(d) {return newX(d.PCA1)})
      .attr('cy', function(d) {return newY(d.PCA2)});

};
