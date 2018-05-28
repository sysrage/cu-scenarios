import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import moment from 'moment';

import 'font-awesome/css/font-awesome.min.css';

const ScenarioDetailContainer = styled('div')`
  overflow-x: auto; /* Needed for table to be responsive */
`;

const ScenarioTitle = styled('div')`
  padding: 10px;
  color: #fff;
  background-color: #0f273d;
  border-bottom: 2px solid #0c2033;
`;

const ScenarioDetails = styled('div')`
  padding: 10px 20px;
  color: #fff;
  background-color: #0f273d;
  border-bottom: 2px solid #0c2033;
  font-size: 12px;
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

const ScenarioId = styled('span')`
  font-size: 12px;
  text-shadow: 1px 1px 3px black;
  color: rgb(168, 166, 166);
`;

const ScenarioIcon = styled('img')`
  position: relative;
  padding-right: 10px;
  vertical-align: middle;
  height: 14px;
  width: 14px;
`;

const DetailLabel = styled('span')`
  color: rgb(168, 166, 166);
`;

const BackButton = styled('span')`
  padding-left: 4px;
  padding-right: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  color: #fff;
  background-color: #0f273d;
  font-size: 18px;
`;

const TeamLabel = styled('span')`
  color: ${props => props.faction === 'Arthurian' ? '#FF8080' : props.faction === 'Viking' ? '#6DB9D9' : '#92E989'};
`;

const getVictor = (outcomes) => {
  if (outcomes) {
    for (let i = 0; i < outcomes.length; i++) {
      if (outcomes[i].outcome === "Win") return (
        <TeamLabel faction={outcomes[i].teamID}>{outcomes[i].teamID}</TeamLabel>
      );
    }
  }
}

const getAllParticipants = (outcomes) => {
  const allParticipants = [];

  if (outcomes) {
    outcomes.forEach((team) => {
      team.participants.forEach((participant) => {
        allParticipants.push({
          displayName: participant.displayName,
          score: participant.score,
          damage: participant.damage,
          team: team.teamID,
          outcome: team.outcome
        });
      });
    });
  }

  const compare = (a,b) => {
    if (a.score < b.score) return 1;
    if (a.score > b.score) return -1;
    return 0;
  }
  allParticipants.sort(compare);

  return allParticipants;
}

const TableFinished = (props) => {
  const { scenariosummary, history } = props;
  const allParticipants = getAllParticipants(scenariosummary.teamOutcomes);
  const startMoment = moment(scenariosummary.startTime);
  const endMoment = moment(scenariosummary.endTime);

  return (
    <ScenarioDetailContainer>
      <ScenarioTitle>
        <BackButton
          onClick={() => {
            if (history.length > 2) {
              history.goBack();
            } else {
              history.push('/');
            }
          }}
        ><i className="fa fa-caret-left"></i></BackButton>
        Scenario Summary <ScenarioId>({ scenariosummary.scenarioInstanceID })</ScenarioId>
      </ScenarioTitle>
      <ScenarioDetails>
        Type: <DetailLabel>{ scenariosummary.scenarioDef ? scenariosummary.scenarioDef.displayName : 'Unknown' } <ScenarioIcon src={ scenariosummary.scenarioDef ? scenariosummary.scenarioDef.icon : null } /></DetailLabel><br />
        Start: <DetailLabel>{ startMoment.format('MMMM Do YYYY, h:mm:ss a') } ({startMoment.fromNow()})</DetailLabel><br />
        End: <DetailLabel>{ endMoment.format('MMMM Do YYYY, h:mm:ss a') } ({endMoment.fromNow()})</DetailLabel><br />
        Resolution: <DetailLabel>{ scenariosummary.resolution }</DetailLabel><br />
        Victor: { getVictor(scenariosummary.teamOutcomes) }<br />
        Total Participants: <DetailLabel>{ allParticipants.length }</DetailLabel><br />
      </ScenarioDetails>
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
    </ScenarioDetailContainer>
  )
}

TableFinished.propTypes = {
  scenariosummary: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(TableFinished);
