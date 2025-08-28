import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, BarChart3, TrendingUp } from 'lucide-react';
import * as d3 from 'd3';
import { useGetCarsQuery, useGetStatisticsQuery } from '../services/api';
import { Car } from '../types';

// Function to safely create histogram
function createHistogram(data: any[]) {
  // Extract valid MPG values
  const mpgValues = data.map((d: any) => {
    // Ensure we have a valid number for MPG
    if (typeof d.mpg !== 'number' || isNaN(d.mpg) || d.mpg <= 0) {
      console.warn('Invalid MPG value:', d.mpg, 'for car:', d.carName);
      return null;
    }
    return d.mpg;
  }).filter(Boolean) as number[];
  
  console.log('Valid MPG values:', mpgValues.length, 'of', data.length);
  console.log('Sample MPG values:', mpgValues.slice(0, 5));
  
  // Handle empty or invalid data
  if (mpgValues.length === 0) {
    throw new Error('No valid MPG data available');
  }
  
  // Ensure we have valid extent values
  let minMpg = d3.min(mpgValues) || 0;
  let maxMpg = d3.max(mpgValues) || 100;
  
  // Add a small buffer to prevent single-value domains
  if (minMpg === maxMpg) {
    minMpg = Math.max(0, minMpg - 5);
    maxMpg = maxMpg + 5;
  }
  
  console.log('MPG extent:', [minMpg, maxMpg]);
  
  // Create histogram function with 15 bins
  const histogram = d3.histogram<number, number>()
    .domain([minMpg, maxMpg])
    .thresholds(15);

  // Generate bins
  const bins = histogram(mpgValues);
  console.log('Generated bins:', bins.length, 'with data distribution:', bins.map(b => b.length));
  
  // Create custom bins with cars
  const binsWithCars = bins.map(bin => {
    // Ensure x0 and x1 are defined
    const x0 = bin.x0 !== undefined ? bin.x0 : 0;
    const x1 = bin.x1 !== undefined ? bin.x1 : 100;
    
    const binData = {
      x0,
      x1,
      length: bin.length, // Explicitly preserve the bin count
      cars: data.filter((d: any) => 
        d.mpg >= x0 && d.mpg < x1
      )
    };
    
    console.log(`Bin ${x0}-${x1}: count=${bin.length}, cars=${binData.cars.length}`);
    return binData;
  });
  
  return { mpgValues, minMpg, maxMpg, binsWithCars };
}

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
  
  // Filter state
  const [yearRange, setYearRange] = useState<[number, number]>([1970, 1982]);
  const [selectedOrigin, setSelectedOrigin] = useState<number | null>(null);
  const [filteredCars, setFilteredCars] = useState<any[]>([]);
  const [chartError, setChartError] = useState<string | null>(null);
  
  // Initialize filteredCars when data is first loaded - using a simpler approach
  useEffect(() => {
    if (cars?.data) {
      // Ensure numbers are properly parsed
      const parsedCars = cars.data.map(car => ({
        ...car,
        mpg: typeof car.mpg === 'string' ? parseFloat(car.mpg) : car.mpg,
        modelYear: (() => {
          let year = typeof car.modelYear === 'string' ? parseInt(car.modelYear) : car.modelYear;
          // Convert 2-digit years to 4-digit years (70-82 becomes 1970-1982)
          if (year < 100) {
            year = year + 1900;
          }
          return year;
        })(),
        origin: typeof car.origin === 'string' ? parseInt(car.origin) : car.origin
      }));
      
      console.log('Initial data parse complete. First car:', parsedCars[0]);
      setFilteredCars(parsedCars);
    }
  }, [cars]);
  
  // Process and filter data when dependencies change
  useEffect(() => {
    if (!cars?.data) return;
    
    try {
      // Apply year filter with additional logging and validation
      let filtered = [...cars.data].map(car => ({
        ...car,
        mpg: typeof car.mpg === 'string' ? parseFloat(car.mpg) : car.mpg,
        modelYear: (() => {
          let year = typeof car.modelYear === 'string' ? parseInt(car.modelYear) : car.modelYear;
          // Convert 2-digit years to 4-digit years (70-82 becomes 1970-1982)
          if (year < 100) {
            year = year + 1900;
          }
          return year;
        })(),
        origin: typeof car.origin === 'string' ? parseInt(car.origin) : car.origin
      }));
      
      console.log('Filtering between years:', yearRange[0], 'and', yearRange[1]);
      
      // Validate model years for debugging
      const allYears = new Set(filtered.map(car => car.modelYear));
      console.log('Available model years:', Array.from(allYears).sort());
      
      filtered = filtered.filter(car => {
        const matchesYear = car.modelYear >= yearRange[0] && car.modelYear <= yearRange[1];
        return matchesYear;
      });
      
      // Apply origin filter if selected
      if (selectedOrigin !== null) {
        filtered = filtered.filter(car => car.origin === selectedOrigin);
      }
      
      // Ensure MPG values are proper numbers
      filtered = filtered.map(car => ({
        ...car,
        mpg: typeof car.mpg === 'string' ? parseFloat(car.mpg) : car.mpg
      }));
      
      // Log first few cars to see what we're working with
      if (filtered.length > 0) {
        console.log('First 3 filtered cars:', filtered.slice(0, 3).map(car => ({
          modelYear: car.modelYear,
          mpg: car.mpg,
          origin: car.origin,
          carName: car.carName
        })));
      }
      
      // Log for debugging
      console.log('Filtered cars count:', filtered.length);
      console.log('Year range:', yearRange);
      console.log('Selected origin:', selectedOrigin);
      
      setFilteredCars(filtered);
      setChartError(null);
    } catch (err) {
      console.error('Error filtering cars:', err);
      setChartError('Error filtering data');
    }
  }, [cars, yearRange, selectedOrigin]);

  useEffect(() => {
    // Check if we have data and a DOM element to render to
    if (!filteredCars.length || !svgRef.current) {
      console.log('No filtered cars or no SVG ref');
      return;
    }

    console.log('Rendering chart with', filteredCars.length, 'cars');
    
    try {
      // Check for valid data
      if (filteredCars.length === 0) {
        setChartError('No data to display');
        return;
      }
      
      // Clear existing chart
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();
      
      // Ensure tooltip is cleared
      if (tooltipRef.current) {
        d3.select(tooltipRef.current).style("opacity", 0);
      }
      
      // Set up chart
      const margin = { top: 20, right: 30, bottom: 40, left: 40 };
      const width = 400 - margin.left - margin.right;
      const height = 250 - margin.top - margin.bottom;

      const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
        
      setChartError(null); // Clear any previous errors
      
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
        .style("max-height", "300px")
        .style("overflow-y", "auto")
        .style("box-shadow", "0 4px 6px rgba(0, 0, 0, 0.1)")
        .style("border", "1px solid rgba(255, 255, 255, 0.1)");
      
  // Create the histogram data
  const { mpgValues, minMpg, maxMpg, binsWithCars } = createHistogram(filteredCars);
  
  console.log('Successfully created histogram with', binsWithCars.length, 'bins');
  console.log('Histogram data sample:', binsWithCars.slice(0, 3));
  console.log('Chart dimensions - width:', width, 'height:', height);
  
  // Scales
  const chartXScale = d3.scaleLinear()
    .domain([minMpg, maxMpg])
    .range([0, width]);

  const chartYScale = d3.scaleLinear()
    .domain([0, d3.max(binsWithCars, d => d.length) || 1])
    .range([height, 0]);

  // Color scale for dynamic coloring
  const colorScale = d3.scaleSequential(d3.interpolateBlues)
    .domain([0, d3.max(binsWithCars, d => d.length) || 1]);
    
  console.log('Scales created:');
  console.log('X domain:', [minMpg, maxMpg], 'X range:', [0, width]);
  console.log('Y domain:', [0, d3.max(binsWithCars, d => d.length) || 1], 'Y range:', [height, 0]);
  console.log('Max bin count:', d3.max(binsWithCars, d => d.length));

      // Create bars with animation
      const bars = g.selectAll(".bar")
        .data(binsWithCars)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => {
          const xPos = chartXScale(d.x0 || 0);
          return Number.isFinite(xPos) ? xPos : 0;
        })
        .attr("y", height)
        .attr("width", d => {
          const width = Math.max(0, chartXScale(d.x1 || 0) - chartXScale(d.x0 || 0) - 1);
          return Number.isFinite(width) ? width : 0;
        })
        .attr("height", 0)
        .attr("fill", d => {
          const color = colorScale(d.length);
          return color || "#ccc";
        })
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 0.5)
        .style("cursor", "pointer");
        
      console.log('Created', bars.size(), 'bars');
      
      // Debug: Check bar data and positioning
      console.log('Sample bar data:', binsWithCars.slice(0, 3).map(d => ({
        x0: d.x0,
        x1: d.x1,
        count: d.length, // This should be the count of items in each bin
        xPos: chartXScale(d.x0 || 0),
        yPos: chartYScale(d.length || 0),
        width: chartXScale(d.x1 || 0) - chartXScale(d.x0 || 0),
        height: height - chartYScale(d.length || 0)
      })));

      // Animate bars on load
      bars.transition()
        .duration(800)
        .delay((d, i) => i * 50)
        .attr("y", d => {
          const count = d.length || 0;
          const yPos = chartYScale(count);
          console.log(`Bar ${d.x0}-${d.x1}: yPos=${yPos}, count=${count}, chartYScale(${count})=${yPos}`);
          return Number.isFinite(yPos) ? yPos : height;
        })
        .attr("height", d => {
          const count = d.length || 0;
          const barHeight = height - chartYScale(count);
          console.log(`Bar ${d.x0}-${d.x1}: barHeight=${barHeight}, count=${count}, height=${height}, chartYScale(${count})=${chartYScale(count)}`);
          return Number.isFinite(barHeight) ? Math.max(0, barHeight) : 0;
        })
        .on("end", () => console.log('Bar animation completed'));

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
          
          // Get cars in this bin
          const carsInBin = d.cars || [];
          const carList = carsInBin.slice(0, 10).map((car: any) => 
            `<li>${car.carName} (${car.mpg} MPG)</li>`
          ).join('');
          
          const moreText = carsInBin.length > 10 ? 
            `<div class="text-xs italic">+ ${carsInBin.length - 10} more cars</div>` : '';
          
          tooltip.html(`
            <div><strong>MPG Range:</strong> ${d.x0?.toFixed(1)} - ${d.x1?.toFixed(1)}</div>
            <div><strong>Cars:</strong> ${d.length}</div>
            <div><strong>Percentage:</strong> ${((d.length / filteredCars.length) * 100).toFixed(1)}%</div>
            ${carsInBin.length > 0 ? 
              `<div class="mt-2"><strong>Top Cars in Range:</strong>
                <ul class="list-disc pl-4 mt-1 text-xs">${carList}</ul>
                ${moreText}
              </div>` : ''
            }
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
        .call(d3.axisBottom(chartXScale));

      const yAxis = g.append("g")
        .style("opacity", 0);
      
      yAxis.transition()
        .duration(1000)
        .style("opacity", 1)
        .call(d3.axisLeft(chartYScale));

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

      // Return cleanup function
      return () => {
        console.log('Cleaning up chart');
        // Stop any in-progress transitions
        svg.selectAll('*').interrupt();
        // Remove all elements
        svg.selectAll('*').remove();
      };
    } catch (error) {
      console.error('Error rendering chart:', error);
      setChartError('Failed to render chart: ' + (error instanceof Error ? error.message : 'Unknown error'));
      // Return empty cleanup function
      return () => {};
    }
  }, [filteredCars]);

  // Get all available years for filter (convert 2-digit to 4-digit years)
  const yearOptions = cars?.data ? 
    Array.from(new Set(cars.data.map(car => {
      let year = typeof car.modelYear === 'string' ? parseInt(car.modelYear) : car.modelYear;
      // Convert 2-digit years to 4-digit years (70-82 becomes 1970-1982)
      if (year < 100) {
        year = year + 1900;
      }
      return year;
    }))).sort() : 
    [];
  
  // Get min and max years for range slider
  const minYear = yearOptions.length ? Math.min(...yearOptions as number[]) : 1970;
  const maxYear = yearOptions.length ? Math.max(...yearOptions as number[]) : 1982;
  
  // Reset filters function
  const resetFilters = () => {
    setYearRange([minYear, maxYear]);
    setSelectedOrigin(null);
  };
  
  // Handle year range change
  const handleYearChange = (value: [number, number]) => {
    setYearRange(value);
  };
  
  // Origin options for dropdown
  const originOptions = [
    { value: 1, label: 'USA' },
    { value: 2, label: 'Europe' },
    { value: 3, label: 'Japan' }
  ];
  
  return (
    <div className="relative space-y-4">
      {/* Filters */}
      <div className="flex flex-col space-y-3 bg-gray-50 p-3 rounded-lg mb-2">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-medium text-gray-700">Filter Options</h4>
          <button 
            onClick={resetFilters}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            Reset Filters
          </button>
        </div>
        
        {/* Year Range Filter */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-xs font-medium text-gray-600">Year Range: {yearRange[0]} - {yearRange[1]}</label>
            <div className="flex space-x-2">
              <input 
                type="number" 
                min={minYear} 
                max={yearRange[1]}
                value={yearRange[0]}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val) && val >= minYear && val <= yearRange[1]) {
                    setYearRange([val, yearRange[1]]);
                  }
                }}
                className="w-16 h-6 text-xs border rounded px-1"
              />
              <span className="text-xs">-</span>
              <input 
                type="number" 
                min={yearRange[0]} 
                max={maxYear}
                value={yearRange[1]}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val) && val >= yearRange[0] && val <= maxYear) {
                    setYearRange([yearRange[0], val]);
                  }
                }}
                className="w-16 h-6 text-xs border rounded px-1"
              />
            </div>
          </div>
        </div>
        
        {/* Origin Filter */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">Origin:</label>
          <select 
            className="w-full rounded-md border-gray-300 text-xs py-1 px-2"
            value={selectedOrigin === null ? "" : selectedOrigin}
            onChange={(e) => {
              console.log('Origin changed to:', e.target.value);
              const value = e.target.value;
              setSelectedOrigin(value === "" ? null : parseInt(value));
            }}
          >
            <option value="">All Origins</option>
            {originOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Stats */}
        <div className="text-xs text-gray-500 border-t pt-2">
          <div className="flex items-center space-x-1">
            <span>Showing {filteredCars.length} of {cars?.data?.length || 0} cars</span>
            {filteredCars.length > 0 && (
              <span className="text-green-500">•</span>
            )}
          </div>
          {filteredCars.length === 0 && cars && Array.isArray(cars.data) && cars.data.length > 0 && (
            <div className="text-red-500 mt-1">
              No cars match the current filters. Try adjusting the filters.
            </div>
          )}
        </div>
      </div>
      
      {/* Chart */}
      {chartError ? (
        <div className="flex items-center justify-center h-[250px] bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-center space-y-2">
            <p className="text-red-500 text-sm">{chartError}</p>
            <button 
              className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
              onClick={resetFilters}
            >
              Reset Filters
            </button>
          </div>
        </div>
      ) : filteredCars.length > 0 ? (
        <>
          <svg ref={svgRef} width={400} height={250}></svg>
          <div id="chart-status" className="text-center text-xs text-red-500 mt-1">
            {/* This will be populated by D3 if there are rendering issues */}
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-[250px] bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500 text-sm">No data to display with current filters</p>
        </div>
      )}
      <div ref={tooltipRef}></div>
      
      {/* Diagnostic panel - only show when we have filtered cars but no chart */}
      {filteredCars.length > 0 && chartError && (
        <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="text-sm font-medium text-yellow-800">Chart Diagnostics</h4>
          <div className="text-xs space-y-1 mt-1">
            <p>Filtered cars: {filteredCars.length}</p>
            <p>Year range: {yearRange[0]} - {yearRange[1]}</p>
            <p>Origin: {selectedOrigin === null ? 'All' : originOptions.find(o => o.value === selectedOrigin)?.label}</p>
            <p>Error: {chartError}</p>
            {filteredCars.length > 0 && (
              <div>
                <p className="font-medium">Sample Car Data:</p>
                <pre className="bg-gray-100 p-1 mt-1 rounded text-xs overflow-x-auto">
                  {JSON.stringify(filteredCars.slice(0, 2), null, 2)}
                </pre>
              </div>
            )}
            <button 
              className="mt-2 px-3 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600 transition-colors"
              onClick={() => {
                // Force redraw the chart
                const temp = [...filteredCars];
                setFilteredCars([]);
                setTimeout(() => setFilteredCars(temp), 100);
              }}
            >
              Force Redraw
            </button>
          </div>
        </div>
      )}
    </div>
  );
};// Make Comparison Chart Component
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

// Origin Distribution Pie Chart Component
const OriginDistributionChart: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const { data: cars } = useGetCarsQuery({ limit: 1000 });

  useEffect(() => {
    if (!cars?.data || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

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
      .style("z-index", "1000");

    // Calculate origin distribution
    const originCounts = cars.data.reduce((acc, car) => {
      switch (car.origin) {
        case 1:
          acc['USA'] = (acc['USA'] || 0) + 1;
          break;
        case 2:
          acc['Europe'] = (acc['Europe'] || 0) + 1;
          break;
        case 3:
          acc['Japan'] = (acc['Japan'] || 0) + 1;
          break;
        default:
          acc['Unknown'] = (acc['Unknown'] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const data = Object.entries(originCounts).map(([origin, count]) => ({
      origin,
      count,
      percentage: (count / cars.data.length) * 100
    }));

    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2 - 10;

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Color scale
    const colorScale = d3.scaleOrdinal<string>()
      .domain(['USA', 'Europe', 'Japan', 'Unknown'])
      .range(['#3B82F6', '#10B981', '#F59E0B', '#6B7280']);

    // Pie generator
    const pie = d3.pie<any>()
      .value(d => d.count)
      .sort(null);

    // Arc generator
    const arc = d3.arc<any>()
      .innerRadius(radius * 0.4) // Creates donut chart
      .outerRadius(radius);

    const arcHover = d3.arc<any>()
      .innerRadius(radius * 0.4)
      .outerRadius(radius + 10);

    // Create arcs
    const arcs = g.selectAll(".arc")
      .data(pie(data))
      .enter().append("g")
      .attr("class", "arc");

    // Add path elements
    arcs.append("path")
      .attr("d", arc)
      .attr("fill", d => colorScale(d.data.origin))
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .style("opacity", 0.8)
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("d", arcHover)
          .style("opacity", 1);

        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        
        tooltip.html(`
          <div><strong>${getOriginFlag(d.data.origin)} ${d.data.origin}</strong></div>
          <div>Count: ${d.data.count}</div>
          <div>Percentage: ${d.data.percentage.toFixed(1)}%</div>
        `);
        
        const { left, top } = positionTooltip(event);
        tooltip
          .style("left", left + "px")
          .style("top", top + "px");
      })
      .on("mousemove", function(event) {
        const { left, top } = positionTooltip(event);
        tooltip
          .style("left", left + "px")
          .style("top", top + "px");
      })
      .on("mouseout", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("d", arc)
          .style("opacity", 0.8);

        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      })
      .on("click", function(event, d) {
        // Add click effect
        d3.select(this)
          .transition()
          .duration(150)
          .attr("transform", "scale(0.95)")
          .transition()
          .duration(150)
          .attr("transform", "scale(1)");
      });

    // Add labels
    arcs.append("text")
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .attr("dy", "0.35em")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .style("fill", "white")
      .style("pointer-events", "none")
      .text(d => d.data.percentage > 5 ? `${d.data.percentage.toFixed(0)}%` : '');

    // Add center text
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "-0.5em")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .style("fill", "#374151")
      .text("Origin");

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "1em")
      .style("font-size", "12px")
      .style("fill", "#6B7280")
      .text("Distribution");

    // Animate the chart
    arcs.select("path")
      .attr("d", d3.arc<any>().innerRadius(radius * 0.4).outerRadius(0))
      .transition()
      .duration(1000)
      .delay((d, i) => i * 200)
      .attr("d", arc);

  }, [cars]);

  // Helper function for origin flags
  const getOriginFlag = (origin: string) => {
    switch (origin) {
      case 'USA': return '🇺🇸';
      case 'Europe': return '🇪🇺';
      case 'Japan': return '🇯🇵';
      default: return '🌍';
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <svg ref={svgRef}></svg>
      <div ref={tooltipRef}></div>
    </div>
  );
};

// Stacked Area Chart: Car Counts by Model Year and Cylinder Type
const StackedAreaChart: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { data: cars } = useGetCarsQuery({ limit: 1000 });

  useEffect(() => {
    if (!cars?.data || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 80, bottom: 40, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    const g = svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create tooltip
    const tooltip = d3.select("body").append("div")
      .style("opacity", 0)
      .style("position", "fixed")
      .style("background", "rgba(0, 0, 0, 0.9)")
      .style("color", "white")
      .style("padding", "10px")
      .style("border-radius", "6px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("z-index", "1000");

    // Process data: group by year and cylinder count
    const dataByYear = d3.group(cars.data, d => d.modelYear);
    const cylinderCategories = ['3', '4', '5', '6', '8'];
    
    const processedData = Array.from(dataByYear, ([year, cars]) => {
      const cylinderCounts = cylinderCategories.reduce((acc, cylCount) => {
        acc[`cyl_${cylCount}`] = cars.filter(car => car.cylinders.toString() === cylCount).length;
        return acc;
      }, {} as Record<string, number>);
      
      return {
        year: +year,
        ...cylinderCounts,
        total: cars.length
      };
    }).sort((a, b) => a.year - b.year);

    // Create stack generator
    const stack = d3.stack<any>()
      .keys(cylinderCategories.map(c => `cyl_${c}`))
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetNone);

    const stackedData = stack(processedData);

    // Scales
    const xScale = d3.scaleLinear()
      .domain(d3.extent(processedData, d => d.year) as [number, number])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(processedData, d => d.total) || 0])
      .nice()
      .range([height, 0]);

    // Color scale for cylinder types
    const colorScale = d3.scaleOrdinal<string>()
      .domain(cylinderCategories.map(c => `cyl_${c}`))
      .range(['#EF4444', '#F97316', '#EAB308', '#22C55E', '#3B82F6']);

    // Area generator
    const area = d3.area<any>()
      .x(d => xScale(d.data.year))
      .y0(d => yScale(d[0]))
      .y1(d => yScale(d[1]))
      .curve(d3.curveCardinal);

    // Add gradient definitions
    const defs = svg.append("defs");
    cylinderCategories.forEach((cyl, i) => {
      const gradient = defs.append("linearGradient")
        .attr("id", `gradient-${cyl}`)
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0).attr("y1", height)
        .attr("x2", 0).attr("y2", 0);
      
      gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", colorScale(`cyl_${cyl}`))
        .attr("stop-opacity", 0.1);
      
      gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", colorScale(`cyl_${cyl}`))
        .attr("stop-opacity", 0.8);
    });

    // Create areas
    const areas = g.selectAll(".area")
      .data(stackedData)
      .enter().append("g")
      .attr("class", "area");

    areas.append("path")
      .attr("d", area)
      .attr("fill", d => `url(#gradient-${cylinderCategories[stackedData.indexOf(d)]})`)
      .attr("stroke", d => colorScale(d.key))
      .attr("stroke-width", 1.5)
      .style("opacity", 0.8)
      .on("mouseover", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .style("opacity", 1);

        // Show tooltip
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        
        tooltip.html(`
          <div><strong>${getCylinderLabel(d.key)} Cylinders</strong></div>
          <div>Total Cars: ${d3.sum(d, layer => layer[1] - layer[0])}</div>
          <div>Years: ${d3.min(d, layer => layer.data.year)}-${d3.max(d, layer => layer.data.year)}</div>
        `);
        
        const { left, top } = positionTooltip(event);
        tooltip
          .style("left", left + "px")
          .style("top", top + "px");
      })
      .on("mousemove", function(event) {
        const { left, top } = positionTooltip(event);
        tooltip
          .style("left", left + "px")
          .style("top", top + "px");
      })
      .on("mouseout", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .style("opacity", 0.8);

        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      })
      .on("click", function(event, d) {
        // Add click effect
        d3.select(this)
          .transition()
          .duration(150)
          .style("opacity", 0.6)
          .transition()
          .duration(150)
          .style("opacity", 0.8);
      });

    // Add axes
    const xAxis = d3.axisBottom(xScale)
      .tickFormat(d => d.toString())
      .ticks(8);

    const yAxis = d3.axisLeft(yScale)
      .ticks(6);

    g.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .selectAll("text")
      .style("font-size", "12px")
      .style("fill", "#6B7280");

    g.append("g")
      .attr("class", "y-axis")
      .call(yAxis)
      .selectAll("text")
      .style("font-size", "12px")
      .style("fill", "#6B7280");

    // Add axis labels
    g.append("text")
      .attr("class", "x-label")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", height + 35)
      .style("font-size", "12px")
      .style("fill", "#6B7280")
      .style("font-weight", "500")
      .text("Model Year");

    g.append("text")
      .attr("class", "y-label")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -35)
      .style("font-size", "12px")
      .style("fill", "#6B7280")
      .style("font-weight", "500")
      .text("Number of Cars");

    // Add legend
    const legend = g.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${width + 10}, 20)`);

    const legendItems = legend.selectAll(".legend-item")
      .data(cylinderCategories)
      .enter().append("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) => `translate(0, ${i * 25})`);

    legendItems.append("rect")
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", d => colorScale(`cyl_${d}`))
      .attr("stroke", d => colorScale(`cyl_${d}`))
      .attr("stroke-width", 1)
      .style("opacity", 0.8);

    legendItems.append("text")
      .attr("x", 20)
      .attr("y", 12)
      .style("font-size", "11px")
      .style("fill", "#374151")
      .style("font-weight", "500")
      .text(d => `${d} Cyl`);

    // Animate the chart
    areas.select("path")
      .attr("d", d => {
        const zeroArea = d3.area<any>()
          .x(d => xScale(d.data.year))
          .y0(height)
          .y1(height)
          .curve(d3.curveCardinal);
        return zeroArea(d);
      })
      .transition()
      .duration(1500)
      .delay((d, i) => i * 200)
      .attr("d", area);

  }, [cars]);

  // Helper function to get cylinder label
  const getCylinderLabel = (key: string) => {
    return key.replace('cyl_', '');
  };

  return (
    <div className="relative">
      <svg ref={svgRef}></svg>
    </div>
  );
};

// Scatter Plot: MPG vs. Weight
const ScatterPlotChart: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const { data: cars } = useGetCarsQuery({ limit: 1000 });

  useEffect(() => {
    if (!cars?.data || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 80, bottom: 50, left: 60 };
    const width = 500 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    const g = svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
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
      .style("z-index", "1000");

    // Filter out invalid data
    const validData = cars.data.filter(car => car.weight && car.mpg && car.weight > 0 && car.mpg > 0);

    // Scales
    const xScale = d3.scaleLinear()
      .domain(d3.extent(validData, d => d.weight) as [number, number])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain(d3.extent(validData, d => d.mpg) as [number, number])
      .range([height, 0]);

    // Color scale by origin
    const colorScale = d3.scaleOrdinal<string>()
      .domain(['1', '2', '3'])
      .range(['#3B82F6', '#10B981', '#F59E0B']);

    // Add circles
    const circles = g.selectAll(".dot")
      .data(validData)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", d => xScale(d.weight))
      .attr("cy", d => yScale(d.mpg))
      .attr("r", 4)
      .attr("fill", d => colorScale(d.origin.toString()))
      .attr("stroke", "white")
      .attr("stroke-width", 1)
      .style("opacity", 0.7)
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 6)
          .style("opacity", 1);

        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        
        tooltip.html(`
          <div><strong>${d.carName}</strong></div>
          <div>MPG: ${d.mpg}</div>
          <div>Weight: ${d.weight} lbs</div>
          <div>Origin: ${getOriginName(d.origin)}</div>
        `);
        
        const { left, top } = positionTooltip(event);
        tooltip
          .style("left", left + "px")
          .style("top", top + "px");
      })
      .on("mousemove", function(event) {
        const { left, top } = positionTooltip(event);
        tooltip
          .style("left", left + "px")
          .style("top", top + "px");
      })
      .on("mouseout", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 4)
          .style("opacity", 0.7);

        d3.select(tooltipRef.current).style("opacity", 0);
      });

    // Add axes
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("font-size", "12px");

    g.append("g")
      .call(d3.axisLeft(yScale))
      .selectAll("text")
      .style("font-size", "12px");

    // Add labels
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", height + 40)
      .style("font-size", "12px")
      .style("font-weight", "500")
      .text("Weight (lbs)");

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -40)
      .style("font-size", "12px")
      .style("font-weight", "500")
      .text("MPG");

    // Add legend
    const legend = g.append("g")
      .attr("transform", `translate(${width + 10}, 20)`);

    const origins = ['1', '2', '3'];
    const originNames = ['USA', 'Europe', 'Japan'];

    origins.forEach((origin, i) => {
      const legendItem = legend.append("g")
        .attr("transform", `translate(0, ${i * 25})`);

      legendItem.append("circle")
        .attr("r", 5)
        .attr("fill", colorScale(origin))
        .attr("stroke", "white");

      legendItem.append("text")
        .attr("x", 15)
        .attr("y", 5)
        .style("font-size", "11px")
        .text(originNames[i]);
    });

    // Helper function
    const getOriginName = (origin: number) => {
      switch (origin) {
        case 1: return 'USA';
        case 2: return 'Europe';
        case 3: return 'Japan';
        default: return 'Unknown';
      }
    };

    // Animate circles
    circles
      .attr("r", 0)
      .transition()
      .duration(800)
      .delay((d, i) => i * 2)
      .attr("r", 4);

  }, [cars]);

  return (
    <div style={{ position: 'relative' }}>
      <svg ref={svgRef}></svg>
      <div ref={tooltipRef}></div>
    </div>
  );
};

// Bar Chart: Average MPG by Cylinder Count
const AvgMPGByCylinderChart: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const { data: cars } = useGetCarsQuery({ limit: 1000 });

  useEffect(() => {
    if (!cars?.data || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    const width = 400 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const g = svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
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
      .style("z-index", "1000");

    // Process data
    const cylinderData = d3.rollup(
      cars.data,
      v => d3.mean(v, d => d.mpg) || 0,
      d => d.cylinders
    );

    const data = Array.from(cylinderData, ([cylinders, avgMPG]) => ({
      cylinders,
      avgMPG: Math.round(avgMPG * 10) / 10
    })).sort((a, b) => a.cylinders - b.cylinders);

    // Scales
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.cylinders.toString()))
      .range([0, width])
      .padding(0.2);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.avgMPG) || 0])
      .range([height, 0]);

    // Color scale
    const colorScale = d3.scaleSequential()
      .domain([d3.min(data, d => d.avgMPG) || 0, d3.max(data, d => d.avgMPG) || 0])
      .interpolator(d3.interpolateViridis);

    // Add bars
    const bars = g.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => xScale(d.cylinders.toString()) || 0)
      .attr("width", xScale.bandwidth())
      .attr("y", height)
      .attr("height", 0)
      .attr("fill", d => colorScale(d.avgMPG))
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("opacity", 0.8);

        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        
        tooltip.html(`
          <div><strong>${d.cylinders} Cylinders</strong></div>
          <div>Average MPG: ${d.avgMPG}</div>
        `);
        
        const { left, top } = positionTooltip(event);
        tooltip
          .style("left", left + "px")
          .style("top", top + "px");
      })
      .on("mousemove", function(event) {
        const { left, top } = positionTooltip(event);
        tooltip
          .style("left", left + "px")
          .style("top", top + "px");
      })
      .on("mouseout", function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("opacity", 1);

        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });

    // Add value labels on bars
    g.selectAll(".bar-label")
      .data(data)
      .enter().append("text")
      .attr("class", "bar-label")
      .attr("x", d => (xScale(d.cylinders.toString()) || 0) + xScale.bandwidth() / 2)
      .attr("y", d => yScale(d.avgMPG) - 5)
      .attr("text-anchor", "middle")
      .style("font-size", "11px")
      .style("font-weight", "bold")
      .style("fill", "#374151")
      .text(d => d.avgMPG);

    // Add axes
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("font-size", "12px");

    g.append("g")
      .call(d3.axisLeft(yScale))
      .selectAll("text")
      .style("font-size", "12px");

    // Add labels
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", height + 40)
      .style("font-size", "12px")
      .style("font-weight", "500")
      .text("Number of Cylinders");

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -40)
      .style("font-size", "12px")
      .style("font-weight", "500")
      .text("Average MPG");

    // Animate bars
    bars
      .transition()
      .duration(800)
      .delay((d, i) => i * 100)
      .attr("y", d => yScale(d.avgMPG))
      .attr("height", d => height - yScale(d.avgMPG));

  }, [cars]);

  return (
    <div style={{ position: 'relative' }}>
      <svg ref={svgRef}></svg>
      <div ref={tooltipRef}></div>
    </div>
  );
};

// Line Chart: Average Horsepower Over Model Years
const HorsepowerTrendsChart: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { data: cars } = useGetCarsQuery({ limit: 1000 });

  useEffect(() => {
    if (!cars?.data || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 80, bottom: 50, left: 60 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const g = svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create tooltip
    const tooltip = d3.select("body").append("div")
      .style("opacity", 0)
      .style("position", "fixed")
      .style("background", "rgba(0, 0, 0, 0.9)")
      .style("color", "white")
      .style("padding", "10px")
      .style("border-radius", "6px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("z-index", "1000");

    // Filter valid horsepower data - handle both string '?' and null values
    const validData = cars.data.filter(car => 
      car.horsepower && 
      car.horsepower !== null &&
      String(car.horsepower) !== '?' && 
      typeof car.horsepower !== 'undefined' &&
      !isNaN(Number(car.horsepower))
    );

    // Process data by year and origin
    const dataByYearOrigin = d3.rollup(
      validData,
      v => d3.mean(v, d => Number(d.horsepower)) || 0,
      d => d.modelYear,
      d => d.origin
    );

    const origins = [1, 2, 3];
    const lineData = origins.map(origin => ({
      origin,
      values: Array.from(dataByYearOrigin.keys())
        .sort((a, b) => a - b)
        .map(year => ({
          year,
          avgHP: dataByYearOrigin.get(year)?.get(origin) || 0
        }))
        .filter(d => d.avgHP > 0)
    }));

    // Scales
    const allYears = lineData.flatMap(d => d.values.map(v => v.year));
    const allHP = lineData.flatMap(d => d.values.map(v => v.avgHP));

    const xScale = d3.scaleLinear()
      .domain(d3.extent(allYears) as [number, number])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain(d3.extent(allHP) as [number, number])
      .range([height, 0]);

    // Color scale
    const colorScale = d3.scaleOrdinal<string>()
      .domain(['1', '2', '3'])
      .range(['#3B82F6', '#10B981', '#F59E0B']);

    // Line generator
    const line = d3.line<any>()
      .x(d => xScale(d.year))
      .y(d => yScale(d.avgHP))
      .curve(d3.curveMonotoneX);

    // Add lines
    const lines = g.selectAll(".line")
      .data(lineData)
      .enter().append("g")
      .attr("class", "line");

    const paths = lines.append("path")
      .attr("fill", "none")
      .attr("stroke", d => colorScale(d.origin.toString()))
      .attr("stroke-width", 3)
      .attr("d", d => line(d.values))
      .style("opacity", 0.8);

    // Add dots
    lines.selectAll(".dot")
      .data(d => d.values.map(v => ({ ...v, origin: d.origin })))
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", d => xScale(d.year))
      .attr("cy", d => yScale(d.avgHP))
      .attr("r", 4)
      .attr("fill", d => colorScale(d.origin.toString()))
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        
        tooltip.html(`
          <div><strong>${d.year}</strong></div>
          <div>Avg HP: ${Math.round(d.avgHP)}</div>
          <div>Origin: ${getOriginName(d.origin)}</div>
        `);
        
        const { left, top } = positionTooltip(event);
        tooltip
          .style("left", left + "px")
          .style("top", top + "px");
      })
      .on("mousemove", function(event) {
        const { left, top } = positionTooltip(event);
        tooltip
          .style("left", left + "px")
          .style("top", top + "px");
      })
      .on("mouseout", function() {
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });

    // Add axes
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickFormat(d => d.toString()))
      .selectAll("text")
      .style("font-size", "12px");

    g.append("g")
      .call(d3.axisLeft(yScale))
      .selectAll("text")
      .style("font-size", "12px");

    // Add labels
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", height + 40)
      .style("font-size", "12px")
      .style("font-weight", "500")
      .text("Model Year");

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -40)
      .style("font-size", "12px")
      .style("font-weight", "500")
      .text("Average Horsepower");

    // Add legend
    const legend = g.append("g")
      .attr("transform", `translate(${width + 10}, 20)`);

    const originNames = ['USA', 'Europe', 'Japan'];
    origins.forEach((origin, i) => {
      const legendItem = legend.append("g")
        .attr("transform", `translate(0, ${i * 25})`);

      legendItem.append("line")
        .attr("x1", 0)
        .attr("x2", 15)
        .attr("stroke", colorScale(origin.toString()))
        .attr("stroke-width", 3);

      legendItem.append("text")
        .attr("x", 20)
        .attr("y", 5)
        .style("font-size", "11px")
        .text(originNames[i]);
    });

    const getOriginName = (origin: number) => {
      switch (origin) {
        case 1: return 'USA';
        case 2: return 'Europe';
        case 3: return 'Japan';
        default: return 'Unknown';
      }
    };

    // Animate lines
    const totalLength = paths.node()?.getTotalLength() || 0;
    paths
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(2000)
      .attr("stroke-dashoffset", 0);

  }, [cars]);

  return (
    <div className="relative">
      <svg ref={svgRef}></svg>
    </div>
  );
};

// Box Plot: MPG Distribution by Origin
const BoxPlotChart: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const { data: cars } = useGetCarsQuery({ limit: 1000 });

  useEffect(() => {
    if (!cars?.data || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 60, left: 60 };
    const width = 400 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const g = svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Process data by origin
    const dataByOrigin = d3.group(cars.data, d => d.origin);
    const origins = [1, 2, 3];
    const originNames = ['USA', 'Europe', 'Japan'];

    const boxData = origins.map((origin, i) => {
      const values = (dataByOrigin.get(origin) || []).map(d => d.mpg).sort(d3.ascending);
      const q1 = d3.quantile(values, 0.25) || 0;
      const median = d3.quantile(values, 0.5) || 0;
      const q3 = d3.quantile(values, 0.75) || 0;
      const iqr = q3 - q1;
      const min = Math.max(d3.min(values) || 0, q1 - 1.5 * iqr);
      const max = Math.min(d3.max(values) || 0, q3 + 1.5 * iqr);
      const outliers = values.filter(v => v < min || v > max);

      return {
        origin,
        name: originNames[i],
        q1,
        median,
        q3,
        min,
        max,
        outliers,
        values
      };
    });

    // Scales
    const xScale = d3.scaleBand()
      .domain(originNames)
      .range([0, width])
      .padding(0.3);

    const yScale = d3.scaleLinear()
      .domain(d3.extent(cars.data, d => d.mpg) as [number, number])
      .range([height, 0]);

    const colorScale = d3.scaleOrdinal<string>()
      .domain(['USA', 'Europe', 'Japan'])
      .range(['#3B82F6', '#10B981', '#F59E0B']);

    const boxWidth = xScale.bandwidth();

    // Draw box plots
    boxData.forEach(d => {
      const x = xScale(d.name) || 0;
      const boxCenter = x + boxWidth / 2;

      // Vertical line (min to max)
      g.append("line")
        .attr("x1", boxCenter)
        .attr("x2", boxCenter)
        .attr("y1", yScale(d.min))
        .attr("y2", yScale(d.max))
        .attr("stroke", "#6B7280")
        .attr("stroke-width", 1);

      // Box (Q1 to Q3)
      g.append("rect")
        .attr("x", x + boxWidth * 0.1)
        .attr("y", yScale(d.q3))
        .attr("width", boxWidth * 0.8)
        .attr("height", yScale(d.q1) - yScale(d.q3))
        .attr("fill", colorScale(d.name))
        .attr("stroke", "#374151")
        .attr("stroke-width", 1)
        .style("opacity", 0.7);

      // Median line
      g.append("line")
        .attr("x1", x + boxWidth * 0.1)
        .attr("x2", x + boxWidth * 0.9)
        .attr("y1", yScale(d.median))
        .attr("y2", yScale(d.median))
        .attr("stroke", "#1F2937")
        .attr("stroke-width", 2);

      // Min/Max caps
      [d.min, d.max].forEach(value => {
        g.append("line")
          .attr("x1", x + boxWidth * 0.3)
          .attr("x2", x + boxWidth * 0.7)
          .attr("y1", yScale(value))
          .attr("y2", yScale(value))
          .attr("stroke", "#6B7280")
          .attr("stroke-width", 1);
      });

      // Outliers
      d.outliers.forEach(outlier => {
        g.append("circle")
          .attr("cx", boxCenter)
          .attr("cy", yScale(outlier))
          .attr("r", 2)
          .attr("fill", colorScale(d.name))
          .attr("stroke", "#374151")
          .attr("stroke-width", 1);
      });
    });

    // Add axes
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("font-size", "12px");

    g.append("g")
      .call(d3.axisLeft(yScale))
      .selectAll("text")
      .style("font-size", "12px");

    // Add labels
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", height + 40)
      .style("font-size", "12px")
      .style("font-weight", "500")
      .text("Origin");

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -40)
      .style("font-size", "12px")
      .style("font-weight", "500")
      .text("MPG Distribution");

  }, [cars]);

  return (
    <div className="relative">
      <svg ref={svgRef}></svg>
      <div
        ref={tooltipRef}
        className="absolute pointer-events-none"
        style={{ opacity: 0 }}
      ></div>
    </div>
  );
};

// Top 10 Cars by Horsepower
const TopHorsepowerChart: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { data: cars } = useGetCarsQuery({ limit: 1000 });

  useEffect(() => {
    if (!cars?.data || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 120, left: 60 };
    const width = 600 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    const g = svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create tooltip
    const tooltip = d3.select("body").append("div")
      .style("opacity", 0)
      .style("position", "fixed")
      .style("background", "rgba(0, 0, 0, 0.9)")
      .style("color", "white")
      .style("padding", "10px")
      .style("border-radius", "6px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("z-index", "1000");

    // Filter and sort by horsepower - handle both string '?' and null values
    const validData = cars.data
      .filter(car => 
        car.horsepower && 
        car.horsepower !== null &&
        String(car.horsepower) !== '?' && 
        typeof car.horsepower !== 'undefined' &&
        !isNaN(Number(car.horsepower))
      )
      .sort((a, b) => Number(b.horsepower!) - Number(a.horsepower!))
      .slice(0, 10);

    // Scales
    const xScale = d3.scaleBand()
      .domain(validData.map((d, i) => i.toString()))
      .range([0, width])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(validData, d => Number(d.horsepower!)) || 0])
      .range([height, 0]);

    const colorScale = d3.scaleOrdinal<string>()
      .domain(['1', '2', '3'])
      .range(['#3B82F6', '#10B981', '#F59E0B']);

    // Add bars
    const bars = g.selectAll(".bar")
      .data(validData)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", (d, i) => xScale(i.toString()) || 0)
      .attr("width", xScale.bandwidth())
      .attr("y", height)
      .attr("height", 0)
      .attr("fill", d => colorScale(d.origin.toString()))
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        d3.select(this).attr("opacity", 0.8);

        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        
        tooltip.html(`
          <div><strong>${d.carName}</strong></div>
          <div>Horsepower: ${d.horsepower}</div>
          <div>Origin: ${getOriginName(d.origin)}</div>
          <div>Year: ${d.modelYear}</div>
        `);
        
        const { left, top } = positionTooltip(event);
        tooltip
          .style("left", left + "px")
          .style("top", top + "px");
      })
      .on("mousemove", function(event) {
        const { left, top } = positionTooltip(event);
        tooltip
          .style("left", left + "px")
          .style("top", top + "px");
      })
      .on("mouseout", function() {
        d3.select(this).attr("opacity", 1);
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });

    // Add value labels
    g.selectAll(".bar-label")
      .data(validData)
      .enter().append("text")
      .attr("class", "bar-label")
      .attr("x", (d, i) => (xScale(i.toString()) || 0) + xScale.bandwidth() / 2)
      .attr("y", d => yScale(Number(d.horsepower!)) - 5)
      .attr("text-anchor", "middle")
      .style("font-size", "10px")
      .style("font-weight", "bold")
      .text(d => d.horsepower!.toString());

    // Add axes
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickFormat((d, i) => {
        const car = validData[+d];
        return car ? car.carName.split(' ').slice(0, 2).join(' ') : '';
      }))
      .selectAll("text")
      .style("font-size", "10px")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    g.append("g")
      .call(d3.axisLeft(yScale))
      .selectAll("text")
      .style("font-size", "12px");

    // Add labels
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", height + 110)
      .style("font-size", "12px")
      .style("font-weight", "500")
      .text("Top 10 Cars");

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -40)
      .style("font-size", "12px")
      .style("font-weight", "500")
      .text("Horsepower");

    const getOriginName = (origin: number) => {
      switch (origin) {
        case 1: return 'USA';
        case 2: return 'Europe';
        case 3: return 'Japan';
        default: return 'Unknown';
      }
    };

    // Animate bars
    bars
      .transition()
      .duration(800)
      .delay((d, i) => i * 100)
      .attr("y", d => yScale(Number(d.horsepower!)))
      .attr("height", d => height - yScale(Number(d.horsepower!)));

  }, [cars]);

  return (
    <div className="relative">
      <svg ref={svgRef}></svg>
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

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center mb-4">
              <PieChart className="h-6 w-6 mr-2 text-purple-500" />
              <h3 className="text-xl font-semibold text-gray-900">Origin Distribution</h3>
            </div>
            <p className="text-gray-600 mb-4 text-sm">
              Donut chart showing the proportion of cars from USA, Europe, and Japan
            </p>
            <div className="flex justify-center">
              <OriginDistributionChart />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center mb-4">
              <BarChart3 className="h-6 w-6 mr-2 text-red-500" />
              <h3 className="text-xl font-semibold text-gray-900">Average MPG by Cylinders</h3>
            </div>
            <p className="text-gray-600 mb-4 text-sm">
              How cylinder count affects fuel efficiency across all vehicles
            </p>
            <div className="flex justify-center">
              <AvgMPGByCylinderChart />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center mb-4">
              <BarChart3 className="h-6 w-6 mr-2 text-gray-500" />
              <h3 className="text-xl font-semibold text-gray-900">MPG Distribution by Origin</h3>
            </div>
            <p className="text-gray-600 mb-4 text-sm">
              Box plot showing quartiles and outliers by regional origin
            </p>
            <div className="flex justify-center">
              <BoxPlotChart />
            </div>
          </motion.div>
        </div>

        {/* Full-width charts */}
        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center mb-4">
              <PieChart className="h-6 w-6 mr-2 text-cyan-500" />
              <h3 className="text-xl font-semibold text-gray-900">MPG vs Weight Correlation</h3>
            </div>
            <p className="text-gray-600 mb-6 text-sm">
              Scatter plot revealing the negative correlation between vehicle weight and fuel efficiency
            </p>
            <div className="flex justify-center">
              <ScatterPlotChart />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center mb-4">
              <TrendingUp className="h-6 w-6 mr-2 text-orange-500" />
              <h3 className="text-xl font-semibold text-gray-900">Horsepower Trends by Origin</h3>
            </div>
            <p className="text-gray-600 mb-6 text-sm">
              How average horsepower evolved over model years, segmented by regional origin
            </p>
            <div className="flex justify-center">
              <HorsepowerTrendsChart />
            </div>
          </motion.div>
        </div>

        {/* Stacked Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center mb-4">
            <BarChart3 className="h-6 w-6 mr-2 text-indigo-500" />
            <h3 className="text-xl font-semibold text-gray-900">Car Counts by Model Year and Cylinder Type</h3>
          </div>
          <p className="text-gray-600 mb-6 text-sm">
            Stacked area chart showing the distribution of cars by cylinder count across model years (1970-1982)
          </p>
          <div className="flex justify-center">
            <StackedAreaChart />
          </div>
        </motion.div>

        {/* Top Horsepower Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center mb-4">
            <BarChart3 className="h-6 w-6 mr-2 text-pink-500" />
            <h3 className="text-xl font-semibold text-gray-900">Top 10 Cars by Horsepower</h3>
          </div>
          <p className="text-gray-600 mb-6 text-sm">
            The most powerful vehicles in the dataset, showing performance leaders by origin
          </p>
          <div className="flex justify-center">
            <TopHorsepowerChart />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 bg-gray-50 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Interactive Features</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
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
            <div>
              <strong>Origin Distribution:</strong>
              <ul className="mt-2 list-disc list-inside text-xs">
                <li>Interactive donut chart with hover effects</li>
                <li>Regional proportions with flags</li>
                <li>Animated sector drawing</li>
                <li>Click effects and tooltips</li>
              </ul>
            </div>
            <div>
              <strong>MPG vs Weight:</strong>
              <ul className="mt-2 list-disc list-inside text-xs">
                <li>Scatter plot with correlation analysis</li>
                <li>Color coding by origin</li>
                <li>Individual car details on hover</li>
                <li>Animated point rendering</li>
              </ul>
            </div>
            <div>
              <strong>Cylinder Analysis:</strong>
              <ul className="mt-2 list-disc list-inside text-xs">
                <li>Average MPG by cylinder count</li>
                <li>Gradient color scaling</li>
                <li>Value labels on bars</li>
                <li>Interactive tooltips</li>
              </ul>
            </div>
            <div>
              <strong>Horsepower Trends:</strong>
              <ul className="mt-2 list-disc list-inside text-xs">
                <li>Multi-line chart by origin</li>
                <li>Animated line drawing</li>
                <li>Interactive data points</li>
                <li>Historical trend analysis</li>
              </ul>
            </div>
            <div>
              <strong>Box Plots & Rankings:</strong>
              <ul className="mt-2 list-disc list-inside text-xs">
                <li>Statistical distribution analysis</li>
                <li>Outlier identification</li>
                <li>Top performance rankings</li>
                <li>Quartile and median visualization</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>💡 Pro Tip:</strong> Explore the comprehensive data analysis with 9 interactive charts! 
              Hover over elements for detailed insights, discover correlations between weight and MPG, 
              analyze regional differences in the box plots, and track historical trends in horsepower evolution. 
              Each chart offers unique perspectives on automotive efficiency and performance.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Visualizations;
