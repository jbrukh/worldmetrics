import React from 'react';
import * as d3 from 'd3';

// Replace with your actual Dune Analytics query ID
const DUNE_QUERY_ID = 'YOUR_QUERY_ID';

async function fetchMetrics() {
  const apiKey = import.meta.env.VITE_DUNE_API_KEY;
  if (!apiKey) {
    // Fallback to local sample data if no API key is provided
    const resp = await fetch('/sample-data.json');
    return resp.json();
  }

  const url = `https://api.dune.com/api/v1/query/${DUNE_QUERY_ID}/results?api_key=${apiKey}`;
  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error('Failed to fetch metrics');
  }
  const data = await resp.json();
  // Adjust this depending on Dune's response structure
  return data.result?.rows || [];
}

export default function WorldMetrics() {
  const [metrics, setMetrics] = React.useState([]);

  React.useEffect(() => {
    fetchMetrics().then(setMetrics).catch(err => {
      console.error(err);
    });
  }, []);

  React.useEffect(() => {
    if (!metrics.length) return;

    const parsed = metrics.map(d => ({
      date: new Date(d.date),
      world_ids: +d.world_ids,
      verified_ids: +d.verified_ids
    }));

    const svg = d3.select('#metrics-chart');
    svg.selectAll('*').remove();

    const width = 500;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };

    svg
      .attr('width', width)
      .attr('height', height);

    const x = d3.scaleTime()
      .domain(d3.extent(parsed, d => d.date))
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(parsed, d => d.world_ids)]).nice()
      .range([height - margin.bottom, margin.top]);

    const line = d3.line()
      .x(d => x(d.date))
      .y(d => y(d.world_ids));

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    svg.append('path')
      .datum(parsed)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', line);
  }, [metrics]);

  return (
    <div>
      <h2>World IDs Over Time</h2>
      <svg id="metrics-chart"></svg>
    </div>
  );
}
