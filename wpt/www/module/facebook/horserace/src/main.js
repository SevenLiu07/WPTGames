



import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory} from 'react-router'
import horseraceIndex  from './components/horseraceIndex.js';
import horseraceDetail from './components/horseraceDetail.js';


ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" component={horseraceIndex}/>
        <Route path="/detail" component={horseraceDetail}/>
    </Router>,
    document.getElementById('app')
);


