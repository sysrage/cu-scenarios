import React from 'react';
import { gql, gqlws } from '../../helpers';
import Loading from '../common/Loading';
import TableFinished from './TableFinished';
import TableOther from './TableOther';

class ScenarioList extends React.Component {
  constructor() {
    super();

    this.state = {
      loading: false,
      finishedScenarios: [],
      otherScenarios: [],
      error: null,
    };
  }

  queryScenarios(startDate, endDate) {
    return `{
      shardprogression {
        scenarioSummaries(startDate: "${startDate}", endDate: "${endDate}") {
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
            }
          }
        }
      }
    }`
  }

  // queryScenarios(startDate, endDate) {
  //   return `{
  //     shardprogression {
  //       scenarioSummaries(startDate: "${startDate}", endDate: "${endDate}") {
  //         scenarioInstanceID
  //         startTime
  //         endTime
  //         resolution
  //         scenarioDef {
  //           displayName
  //           displayDescription
  //           icon
  //         }
  //         teamOutcomes {
  //           teamID
  //           outcome
  //           participants {
  //             displayName
  //             score
  //             damage {
  //               healingApplied {
  //                 anyCharacter
  //                 self
  //                 playerCharacter
  //                 nonPlayerCharacter
  //                 dummy
  //                 resourceNode
  //                 item
  //                 building
  //               }
  //               healingReceived {
  //                 anyCharacter
  //                 self
  //                 playerCharacter
  //                 nonPlayerCharacter
  //                 dummy
  //                 resourceNode
  //                 item
  //                 building
  //               }
  //               damageApplied {
  //                 anyCharacter
  //                 self
  //                 playerCharacter
  //                 nonPlayerCharacter
  //                 dummy
  //                 resourceNode
  //                 item
  //                 building
  //               }
  //               damageReceived {
  //                 anyCharacter
  //                 self
  //                 playerCharacter
  //                 nonPlayerCharacter
  //                 dummy
  //                 resourceNode
  //                 item
  //                 building
  //               }
  //               killCount {
  //                 anyCharacter
  //                 self
  //                 playerCharacter
  //                 nonPlayerCharacter
  //                 dummy
  //                 resourceNode
  //                 item
  //                 building
  //               }
  //               deathCount {
  //                 anyCharacter
  //                 self
  //                 playerCharacter
  //                 nonPlayerCharacter
  //                 dummy
  //                 resourceNode
  //                 item
  //                 building
  //               }
  //               killAssistCount {
  //                 anyCharacter
  //                 self
  //                 playerCharacter
  //                 nonPlayerCharacter
  //                 dummy
  //                 resourceNode
  //                 item
  //                 building
  //               }
  //               createCount {
  //                 anyCharacter
  //                 self
  //                 playerCharacter
  //                 nonPlayerCharacter
  //                 dummy
  //                 resourceNode
  //                 item
  //                 building
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }`
  // }

  componentWillMount() {

  }

  componentDidMount() {
    this.setState({ loading: true });
    this.fetchScenarios();
    // setInterval(() => {this.fetchScenarios()}, 2000);
  }

  fetchScenarios() {
    const shardId = this.props.match.params.shardId;
    const curDate = new Date();
    const currentDate = (curDate.getUTCMonth() + 1) + "/" + curDate.getUTCDate() + "/" + curDate.getUTCFullYear();
    const startDate = curDate.getUTCMonth() + "/" + curDate.getUTCDate() + "/" + curDate.getUTCFullYear();

    gqlws(shardId, this.queryScenarios(startDate, currentDate))
    .then((data) => {
      const { scenarioSummaries } = data.shardprogression;

      console.log('data - ' + this.props.match.params.shardId, data.shardprogression.scenarioSummaries);

      const finishedScenarios = [];
      const otherScenarios = [];
      scenarioSummaries.reverse().forEach((scenario) => {
        if (scenario.resolution === "Finished") {
          finishedScenarios.push(scenario);
        } else {
          otherScenarios.push(scenario);
        }
      });

      this.setState({
        finishedScenarios,
        otherScenarios,
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

  render() {
    const { loading, error, finishedScenarios, otherScenarios } = this.state;

    if (loading) {
      return <div className="loading-container"><Loading /></div>
    }

    if (error) {
      return <div className="error">{error}</div>
    }

    return (
      <div>
        <TableFinished scenarios={finishedScenarios} />
        <TableOther scenarios={otherScenarios} />
      </div>
    );
  }
}

export default ScenarioList;