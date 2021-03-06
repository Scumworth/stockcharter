// utils/index.js

export const buildColumns = (results) => {
    const columns = [];
    columns.push({
        type: 'string',
        label: 'Date'
    })
    results.forEach(stock => {
        columns.push({type: 'number', label: stock.name});
    })
    return columns
}

export const buildRows = (results, period) => {
    console.log('results', results);
    const rows = [];
    for(let i = 365 - period; i < 365; i++) {
        const array = [];
        if (results[0].data.oneYear[i] === null) {
            window.location.reload(true);
        } 
        else {
            array.push(results[0].data.oneYear[i].date);
        }
        results.forEach(stock => {
            if (stock.data.oneYear[i] === null) {
                window.location.reload(true);
            }
            else{
                array.push(++stock.data.oneYear[i].open)
            }
        })
        rows.push(array);
    }
    return rows;
}
