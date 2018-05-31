import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import styled from 'react-emotion';
import moment from 'moment';

import { gql } from '../../helpers';
import Loading from '../common/Loading';
import TableParticipants from './TableParticipants';

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

const ScenarioId = styled('span')`
  font-size: 12px;
  text-shadow: 1px 1px 3px black;
  color: rgb(168, 166, 166);
`;

const ScenarioIcon = styled('img')`
  position: relative;
  padding-left: 4px;
  vertical-align: bottom;
  height: 18px;
  width: 18px;
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


class ScenarioDetail extends React.Component {
  constructor() {
    super();

    this.state = {
      loading: false,
      scenariosummary: {},
      error: null,
    };
  }

  query(scenarioId) {
    return `{
      scenariosummary(id: "${scenarioId}") {
        scenarioInstanceID
        startTime
        endTime
        resolution
        scenarioDef {
          displayName
          displayDescription
          icon
        }
        teamOutcomes {
          teamID
          outcome
          participants {
            displayName
            score
            damage {
              healingApplied {
                anyCharacter
                self
                playerCharacter
                nonPlayerCharacter
                dummy
                resourceNode
                item
                building
              }
              healingReceived {
                anyCharacter
                self
                playerCharacter
                nonPlayerCharacter
                dummy
                resourceNode
                item
                building
              }
              damageApplied {
                anyCharacter
                self
                playerCharacter
                nonPlayerCharacter
                dummy
                resourceNode
                item
                building
              }
              damageReceived {
                anyCharacter
                self
                playerCharacter
                nonPlayerCharacter
                dummy
                resourceNode
                item
                building
              }
              killCount {
                anyCharacter
                self
                playerCharacter
                nonPlayerCharacter
                dummy
                resourceNode
                item
                building
              }
              deathCount {
                anyCharacter
                self
                playerCharacter
                nonPlayerCharacter
                dummy
                resourceNode
                item
                building
              }
              killAssistCount {
                anyCharacter
                self
                playerCharacter
                nonPlayerCharacter
                dummy
                resourceNode
                item
                building
              }
              createCount {
                anyCharacter
                self
                playerCharacter
                nonPlayerCharacter
                dummy
                resourceNode
                item
                building
              }
            }
          }
        }
      }
    }`
  }

  fetchTimer = {};
  fetchScenario() {
    const scenarioId = this.props.match.params.scenarioId;

    gql(this.query(scenarioId))
    .then((data) => {
      const { scenariosummary } = data;

      console.log('scenariosummary - ' + this.props.match.params.scenarioId, scenariosummary);

      if (!scenariosummary) {
        this.setState({
          error: `Scenario (${this.props.match.params.scenarioId}) does not exist.`,
          loading: false
        });
      } else {
        this.setState({
          scenariosummary,
          loading: false
        });
      }
    })
    .catch((error) => {
      this.setState({
        error: error.reason,
        loading: false
      });
    });
  }

  componentWillMount() {

  }

  componentDidMount() {
    this.setState({ loading: true });
    this.fetchScenario();
    // this.fetchTimer = setInterval(() => {this.fetchScenario()}, 2000);
  }

  componentWillUnmount() {
    clearInterval(this.fetchTimer);
  }

  render() {
    const { loading, error, scenariosummary } = this.state;
    const { history } = this.props;
    const allParticipants = getAllParticipants(scenariosummary.teamOutcomes);
    const startMoment = moment(scenariosummary.startTime);
    const endMoment = moment(scenariosummary.endTime);

    if (loading) {
      return <div className="loading-container"><Loading /></div>
    }

    if (error) {
      return (
        <div className="NotFound">
          <div className="NotFound-title">Oops! An error was encountered.</div>

          <div className="NotFound-message">{error}</div>
          <Link to="/" className="NotFound-link">Go to homepage.</Link>
        </div>
      );
    }

    return (
      <div>
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
            Start: <DetailLabel>{startMoment.format('MMMM Do YYYY, h:mm:ss a') } ({startMoment.fromNow()})</DetailLabel><br />
            End: <DetailLabel>{ endMoment.isBefore(startMoment) ? 'N/A' : endMoment.format('MMMM Do YYYY, h:mm:ss a') + ' (' + endMoment.fromNow() + ') ' }</DetailLabel><br />
            Scenario Resolution: <DetailLabel>{ scenariosummary.resolution }</DetailLabel><br />
            &nbsp;<br />
            Scenario Type: <DetailLabel>{ scenariosummary.scenarioDef ? scenariosummary.scenarioDef.displayName : 'Unknown' } <ScenarioIcon src={ scenariosummary.scenarioDef ? scenariosummary.scenarioDef.icon : null } /></DetailLabel><br />
            Winning Team: { getVictor(scenariosummary.teamOutcomes) }<br />
            Total Participants: <DetailLabel>{ allParticipants.length }</DetailLabel><br />
          </ScenarioDetails>
        </ScenarioDetailContainer>

        <TableParticipants allParticipants={allParticipants} />
      </div>
    );
  }
}

export default withRouter(ScenarioDetail);