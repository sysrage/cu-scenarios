import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'react-emotion';

import 'font-awesome/css/font-awesome.min.css';
import './ServerTable.css';
import PlayerCounts from './PlayerCounts';

const OnlineStatus = styled('span')`
  padding-right: 4px;
  color: ${props => props.status === 'Online' && props.playerMax > 0 ? '#92E989' : '#FF8080'};
`;

const ServerTable = (props) => {
  const { servers, history } = props;
  return (
    <div className="ServerTable-container">
      <table className="ServerTable">
        <thead className="ServerTable-head">
          <tr>
            <th>Server</th>
            <th style={{width: "30%"}}>Access Level</th>
            <th>Players</th>
          </tr>
        </thead>
        <tbody className="ServerTable-body">
          {servers.map((server) => (
            <tr
              key={server.name.toLowerCase()}
              onClick={() => history.push(`/shard/${server.shardID}`)}
              // onClick={() => {
              //   history.push(`/shard/${server.shardID}`);
              //   ((s,m)=>{
              //     const n=Date.now();
              //     const v=s.getVoices();
              //     const l=v.length;
              //     const u=new SpeechSynthesisUtterance(m);
              //     u.voice=v[n%l];
              //     s.speak(u);
              //   })(window.speechSynthesis,'Loading scenario list for ' + server.name + '!');
              // }}
              // onClick={() => history.push(`/${server.name}`)}
            >
              <td>
                <OnlineStatus status={server.status} playerMax={server.playerMaximum}><i className="fa fa-power-off"></i></OnlineStatus> {server.name}
              </td>
              <td>
                {server.accessLevel}
              </td>
              <td>
                <PlayerCounts server={server.name} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

ServerTable.propTypes = {
  servers: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(ServerTable);