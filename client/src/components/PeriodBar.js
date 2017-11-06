// components/PeriodBar.js

import React from 'react';
import { Button, ButtonGroup, ButtonToolbar } from 'react-bootstrap';

const PeriodBar = ( { handleChangePeriod } ) => (
    <div>
        <ButtonToolbar>
            <ButtonGroup>
                <Button
                    onClick = { e => handleChangePeriod(e, 365) }
                >
                    1 Year
                </Button>
                <Button
                    onClick = { e => handleChangePeriod(e, 182) }
                >
                    6 Months
                </Button>
                <Button
                    onClick = { e => handleChangePeriod(e, 31) }
                >
                    1 Month
                </Button>
                <Button
                    onClick = { e => handleChangePeriod(e, 7) }
                >
                    1 Week
                </Button>
            </ButtonGroup>
        </ButtonToolbar>
    </div>
)

export default PeriodBar;
