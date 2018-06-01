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
          { participant.displayName }
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
              <ScenarioParticipantDetailItem>
                <b>Created Items ({ participant.damage.createCount.anyCharacter })</b><br />
                &nbsp; Building: { participant.damage.createCount.building }<br />
                &nbsp; Dummy: { participant.damage.createCount.dummy }<br />
                &nbsp; Item: { participant.damage.createCount.item }<br />
                &nbsp; NPC: { participant.damage.createCount.nonPlayerCharacter }<br />
                &nbsp; Player: { participant.damage.createCount.playerCharacter }<br />
                &nbsp; Node: { participant.damage.createCount.resourceNode }<br />
                &nbsp; Self: { participant.damage.createCount.self }<br />
              </ScenarioParticipantDetailItem>
              <ScenarioParticipantDetailItem>
                <b>Damage Applied ({ participant.damage.damageApplied.anyCharacter })</b><br />
                &nbsp; Building: { participant.damage.damageApplied.building }<br />
                &nbsp; Dummy: { participant.damage.damageApplied.dummy }<br />
                &nbsp; Item: { participant.damage.damageApplied.item }<br />
                &nbsp; NPC: { participant.damage.damageApplied.nonPlayerCharacter }<br />
                &nbsp; Player: { participant.damage.damageApplied.playerCharacter }<br />
                &nbsp; Node: { participant.damage.damageApplied.resourceNode }<br />
                &nbsp; Self: { participant.damage.damageApplied.self }<br />
              </ScenarioParticipantDetailItem>
              <ScenarioParticipantDetailItem>
                <b>Damage Received ({ participant.damage.damageReceived.anyCharacter })</b><br />
                &nbsp; Building: { participant.damage.damageReceived.building }<br />
                &nbsp; Dummy: { participant.damage.damageReceived.dummy }<br />
                &nbsp; Item: { participant.damage.damageReceived.item }<br />
                &nbsp; NPC: { participant.damage.damageReceived.nonPlayerCharacter }<br />
                &nbsp; Player: { participant.damage.damageReceived.playerCharacter }<br />
                &nbsp; Node: { participant.damage.damageReceived.resourceNode }<br />
                &nbsp; Self: { participant.damage.damageReceived.self }<br />
              </ScenarioParticipantDetailItem>
              <ScenarioParticipantDetailItem>
                <b>Death Count ({ participant.damage.deathCount.anyCharacter })</b><br />
                &nbsp; Building: { participant.damage.deathCount.building }<br />
                &nbsp; Dummy: { participant.damage.deathCount.dummy }<br />
                &nbsp; Item: { participant.damage.deathCount.item }<br />
                &nbsp; NPC: { participant.damage.deathCount.nonPlayerCharacter }<br />
                &nbsp; Player: { participant.damage.deathCount.playerCharacter }<br />
                &nbsp; Node: { participant.damage.deathCount.resourceNode }<br />
                &nbsp; Self: { participant.damage.deathCount.self }<br />
              </ScenarioParticipantDetailItem>
              <ScenarioParticipantDetailItem>
                <b>Healing Applied ({ participant.damage.healingApplied.anyCharacter })</b><br />
                &nbsp; Building: { participant.damage.healingApplied.building }<br />
                &nbsp; Dummy: { participant.damage.healingApplied.dummy }<br />
                &nbsp; Item: { participant.damage.healingApplied.item }<br />
                &nbsp; NPC: { participant.damage.healingApplied.nonPlayerCharacter }<br />
                &nbsp; Player: { participant.damage.healingApplied.playerCharacter }<br />
                &nbsp; Node: { participant.damage.healingApplied.resourceNode }<br />
                &nbsp; Self: { participant.damage.healingApplied.self }<br />
              </ScenarioParticipantDetailItem>
              <ScenarioParticipantDetailItem>
                <b>Healing Received ({ participant.damage.healingReceived.anyCharacter })</b><br />
                &nbsp; Building: { participant.damage.healingReceived.building }<br />
                &nbsp; Dummy: { participant.damage.healingReceived.dummy }<br />
                &nbsp; Item: { participant.damage.healingReceived.item }<br />
                &nbsp; NPC: { participant.damage.healingReceived.nonPlayerCharacter }<br />
                &nbsp; Player: { participant.damage.healingReceived.playerCharacter }<br />
                &nbsp; Node: { participant.damage.healingReceived.resourceNode }<br />
                &nbsp; Self: { participant.damage.healingReceived.self }<br />
              </ScenarioParticipantDetailItem>
              <ScenarioParticipantDetailItem>
                <b>Kill Assist Count ({ participant.damage.killAssistCount.anyCharacter })</b><br />
                &nbsp; Building: { participant.damage.killAssistCount.building }<br />
                &nbsp; Dummy: { participant.damage.killAssistCount.dummy }<br />
                &nbsp; Item: { participant.damage.killAssistCount.item }<br />
                &nbsp; NPC: { participant.damage.killAssistCount.nonPlayerCharacter }<br />
                &nbsp; Player: { participant.damage.killAssistCount.playerCharacter }<br />
                &nbsp; Node: { participant.damage.killAssistCount.resourceNode }<br />
                &nbsp; Self: { participant.damage.killAssistCount.self }<br />
              </ScenarioParticipantDetailItem>
              <ScenarioParticipantDetailItem>
                <b>Kill Count ({ participant.damage.killCount.anyCharacter })</b><br />
                &nbsp; Building: { participant.damage.killCount.building }<br />
                &nbsp; Dummy: { participant.damage.killCount.dummy }<br />
                &nbsp; Item: { participant.damage.killCount.item }<br />
                &nbsp; NPC: { participant.damage.killCount.nonPlayerCharacter }<br />
                &nbsp; Player: { participant.damage.killCount.playerCharacter }<br />
                &nbsp; Node: { participant.damage.killCount.resourceNode }<br />
                &nbsp; Self: { participant.damage.killCount.self }<br />
              </ScenarioParticipantDetailItem>
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
