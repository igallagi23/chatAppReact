import React from 'react';
import { Link } from 'react-router-dom';
import PageNotFound from '../images/error-404.png';
const NotFound = () => (
    <div>
        <img src={PageNotFound} style={{width: '100%', height: '100%', display: 'block', margin: 'auto', position: 'relative' }} />
        <center><Link to="/">Return to Home Page</Link></center>
    </div>
);
export default NotFound;