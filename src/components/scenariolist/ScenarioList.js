import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { gql } from '../../helpers';
import Loading from '../common/Loading';
import TableFinished from './TableFinished';
import TableOther from './TableOther';

class ScenarioList extends React.Component {
  constructor() {
    super();

    this.state = {
      loading: false,
      apiHost: null,
      finishedScenarios: [],
      otherScenarios: [],
      error: null,
    };
  }

  queryServerlist = `{
    connectedServices {
      servers {
        name
        status
        accessLevel
        playerMaximum
        apiHost
        host
        shardID
        channelID
        channelPatchPermissions
      }
    }
  }`;

  query(startDate, endDate) {
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
    const serverAPI = this.state.apiHost;
    if (!serverAPI) return;
    const startDate = moment().subtract(1, 'weeks').format();
    const endDate = moment().format();

    gql(this.query(startDate, endDate), undefined, serverAPI)
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
        error: error.reason,
        loading: false
      });
    });
  }

  componentWillMount() {

  }

  componentDidMount() {
    this.setState({ loading: true });

    gql(this.queryServerlist)
    .then((data) => {
      const { servers } = data.connectedServices;
      for (let i = 0; i < servers.length; i++) {
        if (servers[i].name === this.props.match.params.serverName) {
          // if (servers[i].status === 'Offline') {
          //   this.setState({
          //     error: `API Server (${servers[i].apiHost}) is offline.`,
          //     loading: false
          //   });
          //   return;
          // }

          this.setState({
            error: null,
            apiHost: servers[i].apiHost
          });

          this.fetchScenarios();
          this.fetchTimer = setInterval(() => {this.fetchScenarios()}, 20000);
          return;
        }
      }
      this.setState({
        error: `Server (${this.props.match.params.serverName}) does not exist.`,
        loading: false
      });
    })
    .catch((error) => {
      this.setState({
        error: error.reason,
        loading: false
      });
    });
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
        <TableFinished scenarios={finishedScenarios} />
        <TableOther scenarios={otherScenarios} />
      </div>
    );
  }
}

export default ScenarioList;