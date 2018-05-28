import React from 'react';
import { gql, gqlws } from '../../helpers';
import Loading from '../common/Loading';
import TableFinished from './TableFinished';

class ScenarioDetail extends React.Component {
  constructor() {
    super();

    this.state = {
      loading: false,
      scenariosummary: {},
      error: null,
    };
  }

  queryScenario(scenarioId) {
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
  fetchScenarios() {
    const scenarioId = this.props.match.params.scenarioId;
    const curDate = new Date();
    const currentDate = (curDate.getUTCMonth() + 1) + "/" + curDate.getUTCDate() + "/" + curDate.getUTCFullYear();
    const startDate = curDate.getUTCMonth() + "/" + curDate.getUTCDate() + "/" + curDate.getUTCFullYear();

    gql(this.queryScenario(scenarioId))
    .then((data) => {
      const { scenariosummary } = data;

      console.log('data - ' + this.props.match.params.scenarioId, scenariosummary);

      this.setState({
        scenariosummary,
        loading: false
      });
    })
    .catch((error) => {
      this.setState({
        error: error.error,
        loading: false
      });
    });
  }

  componentWillMount() {

  }

  componentDidMount() {
    this.setState({ loading: true });
    this.fetchScenarios();
    // this.fetchTimer = setInterval(() => {this.fetchScenarios()}, 2000);
  }

  componentWillUnmount() {
    clearInterval(this.fetchTimer);
  }

  render() {
    const { loading, error, scenariosummary } = this.state;

    if (loading) {
      return <div className="loading-container"><Loading /></div>
    }

    if (error) {
      return <div className="error">{error}</div>
    }

    return (
      <div>
        <TableFinished scenariosummary={scenariosummary} />
      </div>
    );
  }
}

export default ScenarioDetail;