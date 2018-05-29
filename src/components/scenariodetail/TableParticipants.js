import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import moment from 'moment';

import 'font-awesome/css/font-awesome.min.css';

const ScenarioTableContainer = styled('div')`
  overflow-x: auto; /* Needed for table to be responsive */
`;

const ScenarioTable = styled('table')`
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
`;

const ScenarioTableHead = styled('thead')`
  background-color: #0c2033;
`;

const ScenarioTableHeadItem = styled('td')`
  padding: 10px 20px;
  color: #9cb3c9;
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  width: ${props => props.width ? props.width : '33%'};
`;

const ScenarioTableBody = styled('tbody')`
  text-align: center;
  background-color: #0f273d;
`;

const ScenarioTableBodyItem = styled('td')`
  padding: 14px 20px;
  border-bottom: 2px solid #0c2033;
  color: #fff;
  font-size: 12px;
`;

const TeamLabel = styled('span')`
  color: ${props => props.faction === 'Arthurian' ? '#FF8080' : props.faction === 'Viking' ? '#6DB9D9' : '#92E989'};
`;

const TableParticipants = (props) => {
  const { allParticipants, history } = props;

  return (
    <ScenarioTableContainer>
      <ScenarioTable>
        <ScenarioTableHead>
          <tr>
            <ScenarioTableHeadItem>Participant</ScenarioTableHeadItem>
            <ScenarioTableHeadItem>Kills / Deaths</ScenarioTableHeadItem>
            <ScenarioTableHeadItem>Score</ScenarioTableHeadItem>
            <ScenarioTableHeadItem>Team</ScenarioTableHeadItem>
          </tr>
        </ScenarioTableHead>
        <ScenarioTableBody>
          {allParticipants.map((participant, pid) => (
            <tr
              key={participant.displayName+pid}
            >
              <ScenarioTableBodyItem>
                { participant.displayName }
              </ScenarioTableBodyItem>
              <ScenarioTableBodyItem>
                { participant.damage.killCount.anyCharacter } / { participant.damage.deathCount.anyCharacter }
              </ScenarioTableBodyItem>
              <ScenarioTableBodyItem>
                { participant.score }
              </ScenarioTableBodyItem>
              <ScenarioTableBodyItem>
                <TeamLabel faction={participant.team}>{ participant.team }</TeamLabel>
              </ScenarioTableBodyItem>
            </tr>
          ))}
        </ScenarioTableBody>
      </ScenarioTable>
    </ScenarioTableContainer>
  )
}

TableParticipants.propTypes = {
  allParticipants: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(TableParticipants);
