import {Component, OnInit} from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-root',
  template: ''
})
export class AppComponent implements OnInit {

  public ngOnInit(): void {

    const width = 960, height = 136, cellSize = 17;

    const percent = d3.format('.1%'), format = d3.timeFormat('%Y-%m-%d');

    const color = d3.scaleQuantize<string>()
      .domain([-.05, .05])
      .range(d3.range(11).map(d => `q${d}-11`));

    const svg = d3.select('body').selectAll('svg')
      .data(d3.range(1990, 2010))
      .enter().append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('class', 'RdYlGn')
      .append('g')
      .attr('transform', `translate(${(width - cellSize * 53) / 2},${height - cellSize * 7 - 1})`);

    svg.append('text')
      .attr('transform', `translate(-6,${cellSize * 3.5})rotate(-90)`)
      .style('text-anchor', 'middle')
      .text((d) => d);

    const rect = svg.selectAll('.day')
      .data(d => d3.timeDays(new Date(d, 0, 1), new Date(d + 1, 0, 1)))
      .enter().append('rect')
      .attr('class', 'day')
      .attr('width', cellSize)
      .attr('height', cellSize)
      .attr('x', d => d3.timeWeek.count(d3.timeYear(d), d) * cellSize)
      .attr('y', d => d.getDay() * cellSize)
      .datum(format);

    rect.append('title')
      .text(d => d);

    svg.selectAll('.month')
      .data(d => d3.timeMonths(new Date(d, 0, 1), new Date(d + 1, 0, 1)))
      .enter().append('path')
      .attr('class', 'month')
      .attr('d', monthPath);

    d3.csv('assets/dji.csv', (error, csv) => {
      if (error) {
        throw error;
      }

      const data = d3.nest<d3.DSVRowString, number>()
        .key(d => d['Date'])
        .rollup(d => (+d[0]['Close'] - +d[0]['Open']) / +d[0]['Open'])
        .map(csv);

      rect.filter(d => data.has(d))
        .attr('class', d => `day ${color(data.get(d))}`)
        .select('title')
        .text(d => `${d}: ${percent(data.get(d))}`);
    });


    function monthPath(t0) {
      const t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
        d0 = t0.getDay(), w0 = d3.timeWeek.count(d3.timeYear(t0), t0),
        d1 = t1.getDay(), w1 = d3.timeWeek.count(d3.timeYear(t1), t1);
      return 'M' + (w0 + 1) * cellSize + ',' + d0 * cellSize
        + 'H' + w0 * cellSize + 'V' + 7 * cellSize
        + 'H' + w1 * cellSize + 'V' + (d1 + 1) * cellSize
        + 'H' + (w1 + 1) * cellSize + 'V' + 0
        + 'H' + (w0 + 1) * cellSize + 'Z';
    }

  }

}
