// components/StockGraph.js

import React from 'react';
import { Chart } from 'react-google-charts';
import { buildColumns, buildRows } from './../utils'

const StockGraph = ( { results, period, stocksLoaded }) => (
    <div>
        { (stocksLoaded && results.length > 0) ?
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
    </div>
);

export default StockGraph;
