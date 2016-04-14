import React from 'react';
import { Route, IndexRoute } from 'react-router';

/* containers */
import { App } from 'containers/App';
import { Home } from 'containers/Home';
import { Incoming } from 'containers/Incoming';
import { Nerds } from 'containers/Nerds';
import { Data } from 'containers/Data';
import { NotFound } from 'containers/NotFound';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="incoming" component={Incoming} />
    <Route path="nerds" component={Nerds} />
    <Route path="data" component={Data} />
    <Route status={404} path="*" component={NotFound} />
  </Route>
);
