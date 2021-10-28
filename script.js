d3.csv("driving.csv", d3.autoType)
    .then(data => {
        console.log("Driving data: ", data);
        
        // margin convention
        const margin = ({top: 20, right: 40, bottom: 20, left: 40})

        const width = 650 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        const svg = d3.select(".line-chart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        const xScale = d3.scaleLinear()
            .domain(d3.extent(data, d => d.miles)).nice()
            .range([0, width]) 
        
        const yScale = d3.scaleLinear()
            .domain(d3.extent(data, d => d.gas)).nice()
            .range([height, 0])
        
        svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(d.miles))
            .attr("cy", d => yScale(d.gas))
            .attr("r", 5)
            .attr("fill", "white")
            .attr("opacity", 0.6)
            .attr("stroke", "black");
        
        svg.selectAll("text")
            .data(data)
            .enter()
            .append("text")
            .text(d => d.year)
            .attr("x", d => xScale(d.miles))
            .attr("y", d => yScale(d.gas))
            .attr("font-size", 10)
            .each(position)
            .call(halo);

        
        // using axis
        const xAxis = d3.axisBottom()
	        .scale(xScale)
            .ticks(5, "s")

        const yAxis = d3.axisLeft()
	        .scale(yScale)

        // Draw the axis
        let xAxisGroup = svg.append("g")
            .attr("class", "axis x-axis")
            .attr("transform", `translate(0, ${height})`)
        
        xAxisGroup.call(xAxis)
            .call(g => g.select(".domain").remove())

        xAxisGroup.selectAll(".tick line")
            .clone()
            .attr("y2", 0 - height)
            .attr("stroke-opacity", 0.1) // make it transparent

        let yAxisGroup = svg.append("g")
            .attr("class", "axis y-axis")
            .attr("transform", `translate(0, ${0})`)

        yAxisGroup.call(yAxis)
            .call(g => g.select(".domain").remove())

        yAxisGroup.selectAll(".tick line")
            .clone()
            .attr("x2", width)
            .attr("stroke-opacity", 0.1) // make it transparent

        // adding labels
        svg.append("text")
            .attr("class", "xlabel")
            .attr('x', width - 150)
            .attr('y', height - 10)
            .attr("alignment-baseline", "baseline")
            .text("Miles per person per year")

        svg.append("text")
            .attr("class", "ylabel")
            .attr('x', 10)
            .attr('y', 5)
            .attr("alignment-baseline", "baseline")
            .text("Cost per gallon ($)")

        // line and path
        const line = d3
            .line()
            .x(d => xScale(d.miles))
            .y(d => yScale(d.gas));

        const path = svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("d", line);
    })

function position(d) {
    const t = d3.select(this);
    switch (d.side) {
        case "top":
        t.attr("text-anchor", "middle").attr("dy", "-0.7em");
        break;
        case "right":
        t.attr("dx", "0.5em")
            .attr("dy", "0.32em")
            .attr("text-anchor", "start");
        break;
        case "bottom":
        t.attr("text-anchor", "middle").attr("dy", "1.4em");
        break;
        case "left":
        t.attr("dx", "-0.5em")
            .attr("dy", "0.32em")
            .attr("text-anchor", "end");
        break;
    }
}

function halo(text) {
    text
      .select(function() {
        return this.parentNode.insertBefore(this.cloneNode(true), this);
      })
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-width", 4)
      .attr("stroke-linejoin", "round");
  }