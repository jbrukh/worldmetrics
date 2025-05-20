import React from 'react';
import * as d3 from 'd3';
import './App.css';

export default function App() {
  React.useEffect(() => {
    const svg = d3.select('#viz')
      .append('svg')
      .attr('width', 200)
      .attr('height', 200);

    svg.append('circle')
      .attr('cx', 100)
      .attr('cy', 100)
      .attr('r', 80)
      .attr('fill', 'steelblue');
  }, []);

  return (
    <div className="App">
      <h1>WorldMetrics React + D3</h1>
      <div id="viz"></div>
    </div>
  );
}
