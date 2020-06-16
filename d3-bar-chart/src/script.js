const w = 800;
const h = 500;
const margin = 40;

const req = new XMLHttpRequest();
req.open('GET', 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json', true);


req.send();
req.onload = function(){
  const json = JSON.parse(req.responseText);
  
  
  const heights = json.data.map(elem => elem[1])
  let years = json.data.map(elem => elem[0])
  
  const maxData = d3.max(heights)
  const scaleY = d3.scaleLinear();
  scaleY.domain([0, maxData]);
  scaleY.range([0, h]);
  
  const scale = d3.scaleLinear();
  scale.domain([0, maxData]);
  scale.range([h, 0]);
  
  const xScale = d3.scaleLinear();
  
  const regex = /\d+/;
  
  years = years.map(elem => elem.match(regex))
  
  const minYear = d3.min(years);
  const maxYear = d3.max(years);
 
  xScale.domain([minYear, maxYear])
        .range([40, w ])
  
  
  const yAxis = d3.axisLeft(scale)
  const xAxis = d3.axisBottom(xScale)
  .tickFormat(d3.format('d'));
 
  let div = d3.select('body')
               .append('div')
               .attr('id', 'tooltip')
               .style('opacity', 0)
  
  const readyData = heights.map(elem => scaleY(elem))
  
  
 
  const svg = d3.select('#chart')
                .append('svg')
                .attr('width', w + 40)
                .attr('height', h + 200)
  
  svg.selectAll('rect')
     .data(json.data)
     .enter()
     .append('rect')
     .attr('data-date', d => d[0])
     .attr('data-gdp', d => d[1])
     .attr('x', (d, i) => i * 2.8 + 40)
     .attr('y', d =>  h - scaleY(d[1]))
     .attr('width', 2.7)
     .attr('height', d =>  scaleY(d[1]))
     .attr('fill', '#0090d3')
     .attr('class', 'bar')
     .on('mouseover', 
         function(d, i){
            
            div.transition()
            .duration(200)
            .style('opacity', 1)
           
            
            div.html(d[0])
            .attr('data-date', d[0])
            .style('left', d3.event.pageX + 10  + 'px')
            
       } 
        )
     .on('mouseout', 
         function(d, i){
            div.transition()
            .duration(200)
            .style('opacity', 0)
       }
        )
     .text((d, i) => d[0])
  
   svg.append('g')
     .attr('transform', 'translate(40, 0)')
     .attr('id', 'y-axis')
     .call(yAxis)
   svg.append('g')
      .attr('transform', "translate(0," + (h) + ")")
      .attr('id', 'x-axis')
      .call(xAxis);
}
