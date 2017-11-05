// components/StockForm

import React from 'react';
import { Form, Button, FormControl } from 'react-bootstrap';

const StockForm = ({ handleChange, handleSubmit, selectedStock }) => (
    <div>
        <Form>
            <FormControl
                type = "text"
                placeholder = "Enter a new stock to chart"
                onChange = { handleChange }
                name = "stock"
            />
            <Button bsStyle = "success" onClick = {
                event => handleSubmit(event, selectedStock)
            }>
                Add Stock
            </Button>
        </Form>
    </div>
);

export default StockForm;
