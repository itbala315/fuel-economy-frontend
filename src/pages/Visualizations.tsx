import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { PieChart, BarChart3, TrendingUp } from 'lucide-react';
import * as d3 from 'd3';
import { useGetCarsQuery, useGetStatisticsQuery } from '../services/api';

// Utility function to position tooltips smartly
const positionTooltip = (event: MouseEvent, tooltipWidth = 200, tooltipHeight = 80) => {
  const mouseX = event.clientX;
  const mouseY = event.clientY;
  
  let left = mouseX + 10;
  let top = mouseY - 10;
  
  // Check if tooltip would go off the right edge
  if (left + tooltipWidth > window.innerWidth) {
    left = mouseX - tooltipWidth - 10;
  }
  
  // Check if tooltip would go off the bottom edge
  if (top + tooltipHeight > window.innerHeight) {
    top = mouseY - tooltipHeight - 10;
  }
  
  // Ensure tooltip doesn't go off the left or top edges
  left = Math.max(10, left);
  top = Math.max(10, top);
  
  return { left, top };
};

// MPG Distribution Chart Component
const MPGDistributionChart: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const { data: cars } = useGetCarsQuery({ limit: 1000 });

  useEffect(() => {
    if (!cars?.data || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 400 - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create tooltip
    const tooltip = d3.select(tooltipRef.current)
      .style("opacity", 0)
      .style("position", "fixed")
      .style("background", "rgba(0, 0, 0, 0.9)")
      .style("color", "white")
      .style("padding", "10px")
      .style("border-radius", "6px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("z-index", "9999")
      .style("max-width", "200px")
      .style("box-shadow", "0 4px 6px rgba(0, 0, 0, 0.1)")
      .style("border", "1px solid rgba(255, 255, 255, 0.1)");

    // Create histogram bins
    const mpgValues = cars.data.map(d => d.mpg);
    const histogram = d3.histogram()
      .domain(d3.extent(mpgValues) as [number, number])
      .thresholds(15);

    const bins = histogram(mpgValues);

    // Scales
    const xScale = d3.scaleLinear()
      .domain(d3.extent(mpgValues) as [number, number])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(bins, d => d.length)] as [number, number])
      .range([height, 0]);

    // Color scale for dynamic coloring
    const colorScale = d3.scaleSequential(d3.interpolateBlues)
      .domain([0, d3.max(bins, d => d.length)] as [number, number]);

    // Create bars with animation
    const bars = g.selectAll(".bar")
      .data(bins)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => xScale(d.x0!))
      .attr("y", height)
      .attr("width", d => Math.max(0, xScale(d.x1!) - xScale(d.x0!) - 1))
      .attr("height", 0)
      .attr("fill", d => colorScale(d.length))
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 0.5)
      .style("cursor", "pointer");

    // Animate bars on load
    bars.transition()
      .duration(800)
      .delay((d, i) => i * 50)
      .attr("y", d => yScale(d.length))
      .attr("height", d => height - yScale(d.length));

    // Interactive hover effects
    bars.on("mouseover", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("stroke-width", 2)
          .attr("stroke", "#1f2937")
          .style("filter", "brightness(1.2)");

        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        
        tooltip.html(`
          <div><strong>MPG Range:</strong> ${d.x0?.toFixed(1)} - ${d.x1?.toFixed(1)}</div>
          <div><strong>Cars:</strong> ${d.length}</div>
          <div><strong>Percentage:</strong> ${((d.length / cars.data.length) * 100).toFixed(1)}%</div>
        `);
        
        const { left, top } = positionTooltip(event.sourceEvent || event);
        tooltip
          .style("left", left + "px")
          .style("top", top + "px");
      })
      .on("mousemove", function(event) {
        const { left, top } = positionTooltip(event.sourceEvent || event);
        tooltip
          .style("left", left + "px")
          .style("top", top + "px");
      })
      .on("mouseout", function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("stroke-width", 0.5)
          .attr("stroke", "#ffffff")
          .style("filter", "brightness(1)");

        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      })
      .on("click", function(event, d) {
        // Highlight clicked bar
        bars.style("opacity", 0.3);
        d3.select(this).style("opacity", 1);
        
        // Reset after 2 seconds
        setTimeout(() => {
          bars.style("opacity", 1);
        }, 2000);
      });

    // Add axes with animation
    const xAxis = g.append("g")
      .attr("transform", `translate(0,${height})`)
      .style("opacity", 0);
    
    xAxis.transition()
      .duration(1000)
      .style("opacity", 1)
      .call(d3.axisBottom(xScale));

    const yAxis = g.append("g")
      .style("opacity", 0);
    
    yAxis.transition()
      .duration(1000)
      .style("opacity", 1)
      .call(d3.axisLeft(yScale));

    // Add labels
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("opacity", 0)
      .text("Count")
      .transition()
      .duration(1200)
      .style("opacity", 1);

    g.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.bottom})`)
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("opacity", 0)
      .text("MPG")
      .transition()
      .duration(1200)
      .style("opacity", 1);

  }, [cars]);

  return (
    <div style={{ position: 'relative' }}>
      <svg ref={svgRef} width={400} height={250}></svg>
      <div ref={tooltipRef}></div>
    </div>
  );
};

// Make Comparison Chart Component
const MakeComparisonChart: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const { data: cars } = useGetCarsQuery({ limit: 1000 });

  useEffect(() => {
    if (!cars?.data || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 80, left: 50 };
    const width = 400 - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create tooltip
    const tooltip = d3.select(tooltipRef.current)
      .style("opacity", 0)
      .style("position", "fixed")
      .style("background", "rgba(0, 0, 0, 0.9)")
      .style("color", "white")
      .style("padding", "10px")
      .style("border-radius", "6px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("z-index", "9999")
      .style("max-width", "250px")
      .style("box-shadow", "0 4px 6px rgba(0, 0, 0, 0.1)")
      .style("border", "1px solid rgba(255, 255, 255, 0.1)");

    // Group by make and calculate average MPG and count
    const makeData = d3.rollups(
      cars.data,
      v => ({
        avgMpg: d3.mean(v, d => d.mpg) || 0,
        count: v.length,
        cars: v
      }),
      d => d.carName.split(' ')[0] // Extract manufacturer from car name
    ).map(([make, data]) => ({ make, ...data }))
     .sort((a, b) => b.avgMpg - a.avgMpg)
     .slice(0, 10); // Top 10 makes

    // Scales
    const xScale = d3.scaleBand()
      .domain(makeData.map(d => d.make))
      .range([0, width])
      .padding(0.2);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(makeData, d => d.avgMpg)] as [number, number])
      .range([height, 0]);

    // Custom color scale with specific colors
    const customColors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43'];
    const customColorScale = d3.scaleOrdinal(customColors)
      .domain(makeData.map(d => d.make));

    // Create bars with animation
    const bars = g.selectAll(".bar")
      .data(makeData)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => xScale(d.make)!)
      .attr("y", height)
      .attr("width", xScale.bandwidth())
      .attr("height", 0)
      .attr("fill", d => customColorScale(d.make))
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 1)
      .style("cursor", "pointer");

    // Animate bars
    bars.transition()
      .duration(1000)
      .delay((d, i) => i * 100)
      .attr("y", d => yScale(d.avgMpg))
      .attr("height", d => height - yScale(d.avgMpg));

    // Interactive effects
    bars.on("mouseover", function(event, d) {
        // Scale up the bar
        d3.select(this)
          .transition()
          .duration(200)
          .attr("y", yScale(d.avgMpg) - 5)
          .attr("height", height - yScale(d.avgMpg) + 5)
          .style("filter", "brightness(1.3)")
          .attr("stroke", "#2c3e50")
          .attr("stroke-width", 3);

        // Show value on top of bar
        g.append("text")
          .attr("class", "value-label")
          .attr("x", xScale(d.make)! + xScale.bandwidth() / 2)
          .attr("y", yScale(d.avgMpg) - 10)
          .attr("text-anchor", "middle")
          .style("font-size", "12px")
          .style("font-weight", "bold")
          .style("fill", "#2c3e50")
          .text(d.avgMpg.toFixed(1) + " MPG")
          .style("opacity", 0)
          .transition()
          .duration(200)
          .style("opacity", 1);

        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        
        tooltip.html(`
          <div><strong>${d.make}</strong></div>
          <div><strong>Avg MPG:</strong> ${d.avgMpg.toFixed(1)}</div>
          <div><strong>Cars:</strong> ${d.count}</div>
          <div><strong>Best Model:</strong> ${d.cars.reduce((best, car) => car.mpg > best.mpg ? car : best).carName}</div>
        `);
        
        const { left, top } = positionTooltip(event.sourceEvent || event, 250);
        tooltip
          .style("left", left + "px")
          .style("top", top + "px");
      })
      .on("mousemove", function(event) {
        const { left, top } = positionTooltip(event.sourceEvent || event, 250);
        tooltip
          .style("left", left + "px")
          .style("top", top + "px");
      })
      .on("mouseout", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("y", yScale(d.avgMpg))
          .attr("height", height - yScale(d.avgMpg))
          .style("filter", "brightness(1)")
          .attr("stroke", "#ffffff")
          .attr("stroke-width", 1);

        g.selectAll(".value-label").remove();

        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      })
      .on("click", function(event, d) {
        // Pulse effect
        d3.select(this)
          .transition()
          .duration(300)
          .style("filter", "brightness(1.5)")
          .transition()
          .duration(300)
          .style("filter", "brightness(1)");
      });

    // Add axes with animation
    const xAxis = g.append("g")
      .attr("transform", `translate(0,${height})`)
      .style("opacity", 0);
    
    xAxis.transition()
      .duration(1200)
      .style("opacity", 1)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)")
      .style("font-size", "11px");

    const yAxis = g.append("g")
      .style("opacity", 0);
    
    yAxis.transition()
      .duration(1200)
      .style("opacity", 1)
      .call(d3.axisLeft(yScale));

    // Add labels
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("opacity", 0)
      .text("Avg MPG")
      .transition()
      .duration(1400)
      .style("opacity", 1);

  }, [cars]);

  return (
    <div style={{ position: 'relative' }}>
      <svg ref={svgRef} width={400} height={250}></svg>
      <div ref={tooltipRef}></div>
    </div>
  );
};

// Trends Over Time Chart Component
const TrendsOverTimeChart: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const { data: cars } = useGetCarsQuery({ limit: 1000 });

  useEffect(() => {
    if (!cars?.data || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 400 - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create tooltip
    const tooltip = d3.select(tooltipRef.current)
      .style("opacity", 0)
      .style("position", "fixed")
      .style("background", "rgba(0, 0, 0, 0.9)")
      .style("color", "white")
      .style("padding", "10px")
      .style("border-radius", "6px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("z-index", "9999")
      .style("max-width", "280px")
      .style("box-shadow", "0 4px 6px rgba(0, 0, 0, 0.1)")
      .style("border", "1px solid rgba(255, 255, 255, 0.1)");

    // Group by year and calculate statistics
    const yearData = d3.rollups(
      cars.data,
      v => ({
        avgMpg: d3.mean(v, d => d.mpg) || 0,
        count: v.length,
        minMpg: d3.min(v, d => d.mpg) || 0,
        maxMpg: d3.max(v, d => d.mpg) || 0,
        cars: v
      }),
      d => d.modelYear
    ).map(([year, data]) => ({ year, ...data }))
     .sort((a, b) => a.year - b.year);

    // Scales
    const xScale = d3.scaleLinear()
      .domain(d3.extent(yearData, d => d.year) as [number, number])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([
        Math.min(...yearData.map(d => d.minMpg)) - 2,
        Math.max(...yearData.map(d => d.maxMpg)) + 2
      ])
      .range([height, 0]);

    // Line generators
    const avgLine = d3.line<any>()
      .x(d => xScale(d.year))
      .y(d => yScale(d.avgMpg))
      .curve(d3.curveMonotoneX);

    const minLine = d3.line<any>()
      .x(d => xScale(d.year))
      .y(d => yScale(d.minMpg))
      .curve(d3.curveMonotoneX);

    const maxLine = d3.line<any>()
      .x(d => xScale(d.year))
      .y(d => yScale(d.maxMpg))
      .curve(d3.curveMonotoneX);

    // Add area between min and max
    const area = d3.area<any>()
      .x(d => xScale(d.year))
      .y0(d => yScale(d.minMpg))
      .y1(d => yScale(d.maxMpg))
      .curve(d3.curveMonotoneX);

    // Add the area with animation
    const areaPath = g.append("path")
      .datum(yearData)
      .attr("fill", "#fbbf24")
      .attr("fill-opacity", 0.3)
      .attr("d", area)
      .style("opacity", 0);

    areaPath.transition()
      .duration(1500)
      .style("opacity", 1);

    // Add min/max lines
    const minPath = g.append("path")
      .datum(yearData)
      .attr("fill", "none")
      .attr("stroke", "#dc2626")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "3,3")
      .attr("d", minLine);

    const maxPath = g.append("path")
      .datum(yearData)
      .attr("fill", "none")
      .attr("stroke", "#16a34a")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "3,3")
      .attr("d", maxLine);

    // Animate lines
    [minPath, maxPath].forEach(path => {
      const pathLength = path.node()?.getTotalLength() || 0;
      path
        .attr("stroke-dasharray", pathLength + " " + pathLength)
        .attr("stroke-dashoffset", pathLength)
        .transition()
        .duration(2000)
        .attr("stroke-dashoffset", 0)
        .attr("stroke-dasharray", "3,3");
    });

    // Add main average line
    const mainPath = g.append("path")
      .datum(yearData)
      .attr("fill", "none")
      .attr("stroke", "#f59e0b")
      .attr("stroke-width", 3)
      .attr("d", avgLine);

    // Animate main line
    const mainPathLength = mainPath.node()?.getTotalLength() || 0;
    mainPath
      .attr("stroke-dasharray", mainPathLength + " " + mainPathLength)
      .attr("stroke-dashoffset", mainPathLength)
      .transition()
      .duration(2000)
      .delay(500)
      .attr("stroke-dashoffset", 0)
      .attr("stroke-dasharray", "none");

    // Add interactive dots
    const dots = g.selectAll(".dot")
      .data(yearData)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", d => xScale(d.year))
      .attr("cy", d => yScale(d.avgMpg))
      .attr("r", 0)
      .attr("fill", "#f59e0b")
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 2)
      .style("cursor", "pointer");

    // Animate dots
    dots.transition()
      .duration(500)
      .delay((d, i) => 2500 + i * 100)
      .attr("r", 5);

    // Add invisible larger circles for better hover detection
    const hoverCircles = g.selectAll(".hover-circle")
      .data(yearData)
      .enter().append("circle")
      .attr("class", "hover-circle")
      .attr("cx", d => xScale(d.year))
      .attr("cy", d => yScale(d.avgMpg))
      .attr("r", 15)
      .attr("fill", "transparent")
      .style("cursor", "pointer");

    // Interactive effects
    hoverCircles.on("mouseover", function(event, d) {        
        // Highlight the dot
        dots.filter((dotData: any) => dotData.year === d.year)
          .transition()
          .duration(200)
          .attr("r", 8)
          .attr("stroke-width", 3);

        // Add vertical line
        g.append("line")
          .attr("class", "hover-line")
          .attr("x1", xScale(d.year))
          .attr("x2", xScale(d.year))
          .attr("y1", 0)
          .attr("y2", height)
          .attr("stroke", "#374151")
          .attr("stroke-width", 1)
          .attr("stroke-dasharray", "2,2")
          .style("opacity", 0)
          .transition()
          .duration(200)
          .style("opacity", 0.7);

        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        
        tooltip.html(`
          <div><strong>Year:</strong> ${d.year}</div>
          <div><strong>Avg MPG:</strong> ${d.avgMpg.toFixed(1)}</div>
          <div><strong>Range:</strong> ${d.minMpg.toFixed(1)} - ${d.maxMpg.toFixed(1)}</div>
          <div><strong>Cars:</strong> ${d.count}</div>
          <div><strong>Best Car:</strong> ${d.cars.reduce((best, car) => car.mpg > best.mpg ? car : best).carName}</div>
        `);
        
        const { left, top } = positionTooltip(event.sourceEvent || event, 280);
        tooltip
          .style("left", left + "px")
          .style("top", top + "px");
      })
      .on("mousemove", function(event) {
        const { left, top } = positionTooltip(event.sourceEvent || event, 280);
        tooltip
          .style("left", left + "px")
          .style("top", top + "px");
      })
      .on("mouseout", function(event, d) {
        dots.filter((dotData: any) => dotData.year === d.year)
          .transition()
          .duration(200)
          .attr("r", 5)
          .attr("stroke-width", 2);

        g.selectAll(".hover-line").remove();

        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      })
      .on("click", function(event, d) {
        // Ripple effect
        g.append("circle")
          .attr("cx", xScale(d.year))
          .attr("cy", yScale(d.avgMpg))
          .attr("r", 5)
          .attr("fill", "none")
          .attr("stroke", "#f59e0b")
          .attr("stroke-width", 2)
          .transition()
          .duration(800)
          .attr("r", 30)
          .attr("stroke-width", 0)
          .style("opacity", 0)
          .remove();
      });

    // Add brush for selection
    const brush = d3.brushX()
      .extent([[0, 0], [width, height]])
      .on("brush end", function(event) {
        if (!event.selection) {
          // Reset selection
          dots.style("opacity", 1);
          return;
        }
        
        const [x0, x1] = event.selection;
        
        // Highlight selected dots
        dots.style("opacity", d => {
          const x = xScale(d.year);
          return x >= x0 && x <= x1 ? 1 : 0.3;
        });
      });

    g.append("g")
      .attr("class", "brush")
      .call(brush);

    // Add axes with animation
    const xAxis = g.append("g")
      .attr("transform", `translate(0,${height})`)
      .style("opacity", 0);
    
    xAxis.transition()
      .duration(1000)
      .delay(2000)
      .style("opacity", 1)
      .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));

    const yAxis = g.append("g")
      .style("opacity", 0);
    
    yAxis.transition()
      .duration(1000)
      .delay(2000)
      .style("opacity", 1)
      .call(d3.axisLeft(yScale));

    // Add labels
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("opacity", 0)
      .text("MPG")
      .transition()
      .duration(1000)
      .delay(2500)
      .style("opacity", 1);

    g.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.bottom})`)
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("opacity", 0)
      .text("Year")
      .transition()
      .duration(1000)
      .delay(2500)
      .style("opacity", 1);

    // Add legend
    const legend = g.append("g")
      .attr("transform", `translate(${width - 120}, 20)`);

    const legendData = [
      { color: "#f59e0b", label: "Average", dash: "none" },
      { color: "#16a34a", label: "Maximum", dash: "3,3" },
      { color: "#dc2626", label: "Minimum", dash: "3,3" }
    ];

    legendData.forEach((item, i) => {
      const legendItem = legend.append("g")
        .attr("transform", `translate(0, ${i * 20})`);

      legendItem.append("line")
        .attr("x1", 0)
        .attr("x2", 15)
        .attr("y1", 0)
        .attr("y2", 0)
        .attr("stroke", item.color)
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", item.dash);

      legendItem.append("text")
        .attr("x", 20)
        .attr("y", 0)
        .attr("dy", "0.35em")
        .style("font-size", "10px")
        .text(item.label);
    });

  }, [cars]);

  return (
    <div style={{ position: 'relative' }}>
      <svg ref={svgRef} width={400} height={250}></svg>
      <div ref={tooltipRef}></div>
    </div>
  );
};

const Visualizations: React.FC = () => {
  const { data: statistics } = useGetStatisticsQuery();

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Data Visualizations</h1>
          <p className="text-lg text-gray-600">
            Interactive charts and graphs powered by D3.js
          </p>
          {statistics && (
            <div className="mt-4 text-sm text-gray-500">
              Visualizing {statistics.totalCars} vehicles from {statistics.yearRange.min}-{statistics.yearRange.max}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center mb-4">
              <PieChart className="h-6 w-6 mr-2 text-blue-500" />
              <h3 className="text-xl font-semibold text-gray-900">MPG Distribution</h3>
            </div>
            <p className="text-gray-600 mb-4 text-sm">
              Histogram showing the distribution of fuel economy across all vehicles
            </p>
            <div className="flex justify-center">
              <MPGDistributionChart />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center mb-4">
              <BarChart3 className="h-6 w-6 mr-2 text-green-500" />
              <h3 className="text-xl font-semibold text-gray-900">Top Makes by MPG</h3>
            </div>
            <p className="text-gray-600 mb-4 text-sm">
              Average fuel economy comparison for the top 10 car manufacturers
            </p>
            <div className="flex justify-center">
              <MakeComparisonChart />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center mb-4">
              <TrendingUp className="h-6 w-6 mr-2 text-yellow-500" />
              <h3 className="text-xl font-semibold text-gray-900">MPG Trends Over Time</h3>
            </div>
            <p className="text-gray-600 mb-4 text-sm">
              How average fuel economy has changed from 1970 to 1982
            </p>
            <div className="flex justify-center">
              <TrendsOverTimeChart />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 bg-gray-50 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Interactive Features</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <strong>MPG Distribution:</strong>
              <ul className="mt-2 list-disc list-inside text-xs">
                <li>Hover for detailed statistics</li>
                <li>Click to highlight specific ranges</li>
                <li>Animated loading with color coding</li>
                <li>Dynamic tooltips with percentages</li>
              </ul>
            </div>
            <div>
              <strong>Make Comparison:</strong>
              <ul className="mt-2 list-disc list-inside text-xs">
                <li>Hover to see manufacturer details</li>
                <li>Dynamic bar scaling and highlighting</li>
                <li>Color coding by car count</li>
                <li>Click for pulse effects</li>
              </ul>
            </div>
            <div>
              <strong>Trends Over Time:</strong>
              <ul className="mt-2 list-disc list-inside text-xs">
                <li>Brush selection for time ranges</li>
                <li>Min/max range visualization</li>
                <li>Animated line drawing</li>
                <li>Interactive year-by-year data</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>💡 Pro Tip:</strong> Use your mouse to explore the data! Hover over elements for details, 
              click for special effects, and use the brush tool on the time chart to select specific year ranges.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Visualizations;
