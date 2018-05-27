import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Header from './components/common/Header';
import ServerList from './components/serverlist/ServerList';
import NotFound from './components/notfound/NotFound';
import ScenarioList from './components/scenariolist/ScenarioList';
import Detail from './components/detail/Detail';
import './index.css';

const App = () => {
  return (
    <BrowserRouter>
      <div>
      <Header />
      <Switch>
          <Route path="/" component={ServerList} exact />
          <Route path="/:serverName" component={Detail} exact />
          <Route path="/shard/:shardId" component={ScenarioList} exact />
          <Route component={NotFound} />
      </Switch>
      </div>
     </BrowserRouter>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
