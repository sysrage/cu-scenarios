import React from 'react';
import moment from 'moment';
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

  fetchTimer = {};
  fetchScenarios() {
    const shardId = this.props.match.params.shardId;
    const startDate = moment().subtract(1, 'months').format('M/D/YYYY');
    const endDate = moment().add(1, 'days').format('M/D/YYYY');

    gqlws(shardId, this.queryScenarios(startDate, endDate))
    .then((data) => {
      const { scenarioSummaries } = data.shardprogression;

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