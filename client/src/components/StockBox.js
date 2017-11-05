// components/StockBox.js

import React from 'react';
import { Panel, Button } from 'react-bootstrap';

const StockBox = ({ name, handleRemove }) => (
    <div style = {{ maxWidth: 300, display: 'inline-block', padding: 10 }}>
        <Panel header = { name } bsStyle = "info">
            <Button onClick = {
                event => handleRemove(event, name)
            }>
                Remove Stock
            </Button>
        </Panel>
    </div>
);

export default StockBox;
