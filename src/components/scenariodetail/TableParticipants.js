import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'react-emotion';

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
  border-top: 2px solid #0c2033;
  color: #fff;
  font-size: 12px;
  cursor: pointer;
`;

const ScenarioParticipantDetail = styled('div')`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  padding: 10px 20px;
  color: #fff;
  font-size: 10px;
  text-align: left;
  background-color: #133656;
`;

const ScenarioParticipantDetailItem = styled('div')`
  padding: 10px; 20px;
`;

const TeamLabel = styled('span')`
  color: ${props => props.faction === 'Arthurian' ? '#FF8080' : props.faction === 'Viking' ? '#6DB9D9' : '#92E989'};
`;

class TableParticipants extends React.Component {
  constructor() {
    super();

    this.state = {
      participants: [],
      expandedRows: []
    };
  }

  componentWillMount() {
    this.setState({participants: this.props.allParticipants});
  }

  handleRowClick(rowId) {
    const currentExpandedRows = this.state.expandedRows;
    const isRowCurrentlyExpanded = currentExpandedRows.includes(rowId);

    const newExpandedRows = isRowCurrentlyExpanded ?
      currentExpandedRows.filter(id => id !== rowId) :
      currentExpandedRows.concat(rowId);

    this.setState({expandedRows: newExpandedRows});
  }

  renderParticipant(participant) {
    const clickCallback = () => this.handleRowClick(participant.id);
    const participantRows = [
      <tr onClick={ clickCallback } key={ "row-data-" + participant.displayName + participant.id }>
        <ScenarioTableBodyItem>
          { participant.displayName } ({
            participant.characterType === 'NonPlayerCharacter' ? 'NPC' :
            participant.characterType === 'PlayerCharacter' ? 'Player' :
            participant.characterType })
        </ScenarioTableBodyItem>
        <ScenarioTableBodyItem>
          { participant.damage.killCount.anyCharacter } / { participant.damage.deathCount.anyCharacter }
        </ScenarioTableBodyItem>
        <ScenarioTableBodyItem>
          { participant.score }
        </ScenarioTableBodyItem>
        <ScenarioTableBodyItem>
          <TeamLabel faction={ participant.team }>{ participant.team }</TeamLabel>
        </ScenarioTableBodyItem>
      </tr>
    ];

    if(this.state.expandedRows.includes(participant.id)) {
      participantRows.push(
        <tr key={ "row-expanded-" + participant.displayName + participant.id }>
          <td colSpan={4}>
            <ScenarioParticipantDetail>
              { participant.damage.createCount.anyCharacter > 0 &&
                <ScenarioParticipantDetailItem>
                  <b>Created Items ({ participant.damage.createCount.anyCharacter })</b><br />
                  { participant.damage.createCount.building > 0 && <span>&nbsp; Building: {participant.damage.createCount.building}<br /></span> }
                  { participant.damage.createCount.dummy > 0 && <span>&nbsp; Dummy: {participant.damage.createCount.dummy}<br /></span> }
                  { participant.damage.createCount.item > 0 && <span>&nbsp; Item: {participant.damage.createCount.item}<br /></span> }
                  { participant.damage.createCount.nonPlayerCharacter > 0 && <span>&nbsp; NPC: {participant.damage.createCount.nonPlayerCharacter}<br /></span> }
                  { participant.damage.createCount.playerCharacter > 0 && <span>&nbsp; Player: {participant.damage.createCount.playerCharacter}<br /></span> }
                  { participant.damage.createCount.resourceNode > 0 && <span>&nbsp; Node: {participant.damage.createCount.resourceNode}<br /></span> }
                  { participant.damage.createCount.self > 0 && <span>&nbsp; Self: {participant.damage.createCount.self}<br /></span> }
                </ScenarioParticipantDetailItem>
              }
              { participant.damage.damageApplied.anyCharacter > 0 &&
                <ScenarioParticipantDetailItem>
                  <b>Damage Applied ({ participant.damage.damageApplied.anyCharacter })</b><br />
                  { participant.damage.damageApplied.building > 0 && <span>&nbsp; Building: {participant.damage.damageApplied.building}<br /></span> }
                  { participant.damage.damageApplied.dummy > 0 && <span>&nbsp; Dummy: {participant.damage.damageApplied.dummy}<br /></span> }
                  { participant.damage.damageApplied.item > 0 && <span>&nbsp; Item: {participant.damage.damageApplied.item}<br /></span> }
                  { participant.damage.damageApplied.nonPlayerCharacter > 0 && <span>&nbsp; NPC: {participant.damage.damageApplied.nonPlayerCharacter}<br /></span> }
                  { participant.damage.damageApplied.playerCharacter > 0 && <span>&nbsp; Player: {participant.damage.damageApplied.playerCharacter}<br /></span> }
                  { participant.damage.damageApplied.resourceNode > 0 && <span>&nbsp; Node: {participant.damage.damageApplied.resourceNode}<br /></span> }
                  { participant.damage.damageApplied.self > 0 && <span>&nbsp; Self: {participant.damage.damageApplied.self}<br /></span> }
                </ScenarioParticipantDetailItem>
              }
              { participant.damage.damageReceived.anyCharacter > 0 &&
                <ScenarioParticipantDetailItem>
                  <b>Damage Received ({ participant.damage.damageReceived.anyCharacter })</b><br />
                  { participant.damage.damageReceived.building > 0 && <span>&nbsp; Building: {participant.damage.damageReceived.building}<br /></span> }
                  { participant.damage.damageReceived.dummy > 0 && <span>&nbsp; Dummy: {participant.damage.damageReceived.dummy}<br /></span> }
                  { participant.damage.damageReceived.item > 0 && <span>&nbsp; Item: {participant.damage.damageReceived.item}<br /></span> }
                  { participant.damage.damageReceived.nonPlayerCharacter > 0 && <span>&nbsp; NPC: {participant.damage.damageReceived.nonPlayerCharacter}<br /></span> }
                  { participant.damage.damageReceived.playerCharacter > 0 && <span>&nbsp; Player: {participant.damage.damageReceived.playerCharacter}<br /></span> }
                  { participant.damage.damageReceived.resourceNode > 0 && <span>&nbsp; Node: {participant.damage.damageReceived.resourceNode}<br /></span> }
                  { participant.damage.damageReceived.self > 0 && <span>&nbsp; Self: {participant.damage.damageReceived.self}<br /></span> }
                </ScenarioParticipantDetailItem>
              }
              { participant.damage.healingApplied.anyCharacter > 0 &&
                <ScenarioParticipantDetailItem>
                  <b>Healing Applied ({ participant.damage.healingApplied.anyCharacter })</b><br />
                  { participant.damage.healingApplied.building > 0 && <span>&nbsp; Building: {participant.damage.healingApplied.building}<br /></span> }
                  { participant.damage.healingApplied.dummy > 0 && <span>&nbsp; Dummy: {participant.damage.healingApplied.dummy}<br /></span> }
                  { participant.damage.healingApplied.item > 0 && <span>&nbsp; Item: {participant.damage.healingApplied.item}<br /></span> }
                  { participant.damage.healingApplied.nonPlayerCharacter > 0 && <span>&nbsp; NPC: {participant.damage.healingApplied.nonPlayerCharacter}<br /></span> }
                  { participant.damage.healingApplied.playerCharacter > 0 && <span>&nbsp; Player: {participant.damage.healingApplied.playerCharacter}<br /></span> }
                  { participant.damage.healingApplied.resourceNode > 0 && <span>&nbsp; Node: {participant.damage.healingApplied.resourceNode}<br /></span> }
                  { participant.damage.healingApplied.self > 0 && <span>&nbsp; Self: {participant.damage.healingApplied.self}<br /></span> }
                </ScenarioParticipantDetailItem>
              }
              { participant.damage.healingReceived.anyCharacter > 0 &&
                <ScenarioParticipantDetailItem>
                  <b>Healing Received ({ participant.damage.healingReceived.anyCharacter })</b><br />
                  { participant.damage.healingReceived.building > 0 && <span>&nbsp; Building: {participant.damage.healingReceived.building}<br /></span> }
                  { participant.damage.healingReceived.dummy > 0 && <span>&nbsp; Dummy: {participant.damage.healingReceived.dummy}<br /></span> }
                  { participant.damage.healingReceived.item > 0 && <span>&nbsp; Item: {participant.damage.healingReceived.item}<br /></span> }
                  { participant.damage.healingReceived.nonPlayerCharacter > 0 && <span>&nbsp; NPC: {participant.damage.healingReceived.nonPlayerCharacter}<br /></span> }
                  { participant.damage.healingReceived.playerCharacter > 0 && <span>&nbsp; Player: {participant.damage.healingReceived.playerCharacter}<br /></span> }
                  { participant.damage.healingReceived.resourceNode > 0 && <span>&nbsp; Node: {participant.damage.healingReceived.resourceNode}<br /></span> }
                  { participant.damage.healingReceived.self > 0 && <span>&nbsp; Self: {participant.damage.healingReceived.self}<br /></span> }
                </ScenarioParticipantDetailItem>
              }
              { participant.damage.killAssistCount.anyCharacter > 0 &&
                <ScenarioParticipantDetailItem>
                  <b>Kill Assist Count ({ participant.damage.killAssistCount.anyCharacter })</b><br />
                  { participant.damage.killAssistCount.building > 0 && <span>&nbsp; Building: {participant.damage.killAssistCount.building}<br /></span> }
                  { participant.damage.killAssistCount.dummy > 0 && <span>&nbsp; Dummy: {participant.damage.killAssistCount.dummy}<br /></span> }
                  { participant.damage.killAssistCount.item > 0 && <span>&nbsp; Item: {participant.damage.killAssistCount.item}<br /></span> }
                  { participant.damage.killAssistCount.nonPlayerCharacter > 0 && <span>&nbsp; NPC: {participant.damage.killAssistCount.nonPlayerCharacter}<br /></span> }
                  { participant.damage.killAssistCount.playerCharacter > 0 && <span>&nbsp; Player: {participant.damage.killAssistCount.playerCharacter}<br /></span> }
                  { participant.damage.killAssistCount.resourceNode > 0 && <span>&nbsp; Node: {participant.damage.killAssistCount.resourceNode}<br /></span> }
                  { participant.damage.killAssistCount.self > 0 && <span>&nbsp; Self: {participant.damage.killAssistCount.self}<br /></span> }
                </ScenarioParticipantDetailItem>
              }
              { participant.damage.killCount.anyCharacter > 0 &&
                <ScenarioParticipantDetailItem>
                  <b>Kill Count ({ participant.damage.killCount.anyCharacter })</b><br />
                  { participant.damage.killCount.building > 0 && <span>&nbsp; Building: {participant.damage.killCount.building}<br /></span> }
                  { participant.damage.killCount.dummy > 0 && <span>&nbsp; Dummy: {participant.damage.killCount.dummy}<br /></span> }
                  { participant.damage.killCount.item > 0 && <span>&nbsp; Item: {participant.damage.killCount.item}<br /></span> }
                  { participant.damage.killCount.nonPlayerCharacter > 0 && <span>&nbsp; NPC: {participant.damage.killCount.nonPlayerCharacter}<br /></span> }
                  { participant.damage.killCount.playerCharacter > 0 && <span>&nbsp; Player: {participant.damage.killCount.playerCharacter}<br /></span> }
                  { participant.damage.killCount.resourceNode > 0 && <span>&nbsp; Node: {participant.damage.killCount.resourceNode}<br /></span> }
                  { participant.damage.killCount.self > 0 && <span>&nbsp; Self: {participant.damage.killCount.self}<br /></span> }
                </ScenarioParticipantDetailItem>
              }
              { participant.damage.deathCount.anyCharacter > 0 &&
                <ScenarioParticipantDetailItem>
                  <b>Death Count ({ participant.damage.deathCount.anyCharacter })</b><br />
                  { participant.damage.deathCount.building > 0 && <span>&nbsp; Building: {participant.damage.deathCount.building}<br /></span> }
                  { participant.damage.deathCount.dummy > 0 && <span>&nbsp; Dummy: {participant.damage.deathCount.dummy}<br /></span> }
                  { participant.damage.deathCount.item > 0 && <span>&nbsp; Item: {participant.damage.deathCount.item}<br /></span> }
                  { participant.damage.deathCount.nonPlayerCharacter > 0 && <span>&nbsp; NPC: {participant.damage.deathCount.nonPlayerCharacter}<br /></span> }
                  { participant.damage.deathCount.playerCharacter > 0 && <span>&nbsp; Player: {participant.damage.deathCount.playerCharacter}<br /></span> }
                  { participant.damage.deathCount.resourceNode > 0 && <span>&nbsp; Node: {participant.damage.deathCount.resourceNode}<br /></span> }
                  { participant.damage.deathCount.self > 0 && <span>&nbsp; Self: {participant.damage.deathCount.self}<br /></span> }
                </ScenarioParticipantDetailItem>
              }
            </ScenarioParticipantDetail>
          </td>
        </tr>
      );
    }

    return participantRows;
  }

  render() {
    let allItemRows = [];

    this.state.participants.forEach(item => {
      const perItemRows = this.renderParticipant(item);
      allItemRows = allItemRows.concat(perItemRows);
    });

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
            { allItemRows }
          </ScenarioTableBody>
        </ScenarioTable>
      </ScenarioTableContainer>
    );
  }
}

TableParticipants.propTypes = {
  allParticipants: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(TableParticipants);
