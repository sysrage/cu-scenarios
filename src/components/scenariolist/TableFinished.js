import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import moment from 'moment';

const ScenarioFinishedContainer = styled('div')`
  overflow-x: auto; /* Needed for table to be responsive */
`;

const ScenarioTitle = styled('div')`
  padding: 10px;
  color: #fff;
  background-color: #0f273d;
  border-bottom: 2px solid #0c2033;
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
  cursor: pointer;
  font-size: 12px;
`;

const ScenarioId = styled('span')`
  font-size: 10px;
  text-shadow: 1px 1px 3px black;
  color: rgb(168, 166, 166);
`;

const ScenarioIcon = styled('img')`
  position: relative;
  padding-right: 10px;
  vertical-align: middle;
  height: 25px;
  width: 25px;
`;

const VictorLabel = styled('span')`
  color: ${props => props.faction === 'arthurian' ? '#FF8080' : props.faction === 'viking' ? '#6DB9D9' : '#92E989'};
`;

const getVictor = (outcomes) => {
  if (outcomes) {
    for (let i = 0; i < outcomes.length; i++) {
      if (outcomes[i].outcome === "Win") return (
        <VictorLabel faction={outcomes[i].teamID.toLowerCase()}>{outcomes[i].teamID}</VictorLabel>
      );
    }
  }
}

const TableFinished = (props) => {
  const { scenarios, history } = props;
  return (
    <ScenarioFinishedContainer>
      <ScenarioTitle>Recently Completed Scenarios:</ScenarioTitle>
      <ScenarioTable>
        <ScenarioTableHead>
          <tr>
            <ScenarioTableHeadItem width='50%'>Scenario</ScenarioTableHeadItem>
            <ScenarioTableHeadItem>Finished</ScenarioTableHeadItem>
            <ScenarioTableHeadItem>Victor</ScenarioTableHeadItem>
          </tr>
        </ScenarioTableHead>
        <ScenarioTableBody>
          {scenarios.map((scenario) => (
            <tr
              key={scenario.scenarioInstanceID}
              onClick={() => history.push(`/scenario/${scenario.shardID}/${scenario.scenarioInstanceID}`)}
            >
              <ScenarioTableBodyItem>
                <ScenarioId>{scenario.scenarioInstanceID}</ScenarioId><br />
                <ScenarioIcon src={scenario.scenarioDef.icon} />
                {scenario.scenarioDef.displayName}
              </ScenarioTableBodyItem>
              <ScenarioTableBodyItem>
                { moment(scenario.endTime).fromNow() }
              </ScenarioTableBodyItem>
              <ScenarioTableBodyItem>
                {getVictor(scenario.teamOutcomes)}
              </ScenarioTableBodyItem>
            </tr>
          ))}
        </ScenarioTableBody>
      </ScenarioTable>
    </ScenarioFinishedContainer>
  )
}

TableFinished.propTypes = {
  scenarios: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(TableFinished);
