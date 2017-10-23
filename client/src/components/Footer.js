// components/Footer.js

import React from 'react';

const Footer = () => (
    <div style = {{ fontSize: 10 }}>
        <p>This app is build for FreeCodeCamp</p>
        <p>User Stories</p>
        <ul>
            <li>I can view a graph displaying the recent trend lines for each added stock.</li>
            <li>I can add new stocks by their symbol name.</li>
            <li>I can remove stocks.</li>
            <li>I can see changes in real-time when any other user adds or removes a stock.</li>
        </ul>
    </div>
);

export default Footer;
