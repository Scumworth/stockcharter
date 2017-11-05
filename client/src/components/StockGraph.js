// components/StockGraph.js

import React from 'react';
import { Chart } from 'react-google-charts';
import { buildColumns, buildRows } from './../utils'

const StockGraph = ( { results, period }) => (
    <div>
        { results && results.length !== 0 ?
                <Chart
                    chartType = "LineChart"
                    columns = { buildColumns(results) }
                    rows = { buildRows(results, period) }
                    options = {{}}
                    graph_id = "Line Chart"
                    width = "100%"
                    height = "500px"
                    legend_toggle
                />
                    : null
        }
        <h1>StockGraph</h1>
    </div>
);

export default StockGraph;
