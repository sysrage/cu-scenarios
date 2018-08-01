import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'react-emotion';
import moment from 'moment';

import { gql } from '../../helpers';
import Loading from '../common/Loading';
import TableFinished from './TableFinished';
import TableOther from './TableOther';

const FilterContainer = styled('div')`
  @media screen and (-webkit-min-device-pixel-ratio:0) {
    select,
    textarea,
    input {
      font-size: 16px;
    }
  }
  background-color: #0f273d;
`;

const FilterSubContainer = styled('div')`
  margin: 0 auto;
  width: 174px;
  padding: 14px 0px;
  color: #fff;
  font-size: 16px;
`;

const FilterSelectBox = styled('span')`
  display: inline;
  padding: 4px;
  :after {
    content: '\f078';
    font: normal normal normal 12px/1 FontAwesome;
    transform: rotate(45deg);
    color: #fff;
    height: 34px;
    margin-left: -18px;
    pointer-events: none;
  }
`;

const FilterSelect = styled('select')`
  appearance: none;
  background-color: #0f273d;
  color: #fff;
  padding: 2px;
  padding-left: 4px;
  padding-right: 18px;
  border-radius: 5px;
`;

class ScenarioList extends React.Component {
  constructor() {
    super();

    const savedScenarioFilterType = localStorage.getItem('savedScenarioFilterType');
    const savedScenarioFilterValue = localStorage.getItem('savedScenarioFilterValue');

    this.state = {
      loading: false,
      shardID: null,
      apiHost: null,
      finishedScenarios: [],
      otherScenarios: [],
      filterType: savedScenarioFilterType ? savedScenarioFilterType : 'weeks',
      filterValue: savedScenarioFilterValue ? savedScenarioFilterValue : 2,
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

  query(shardID, startDate, endDate) {
      return `{
      shardprogression (shard: ${shardID}) {
        scenarioSummaries(startDate: "${startDate}", endDate: "${endDate}", limit: 30) {
          data {
            scenarioInstanceID
            startTime
            endTime
            resolution
            shardID
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
                characterType
              }
            }
          }
        }
      }
    }`
  }

  fetchTimer = {};
  fetchScenarios() {
    const { shardID, filterType, filterValue } = this.state;
    if ( !shardID ) return;
    const startDate = moment().subtract(filterValue, filterType).format();
    const endDate = moment().format();

    gql(this.query(shardID, startDate, endDate))
    .then((data) => {
      const scenarioSummaries = data.shardprogression.scenarioSummaries.data;

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

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.filterType !== prevState.filterType ||
      this.state.filterValue !== prevState.filterValue
    ) {
      this.setState({ loading: true });
      localStorage.setItem('savedScenarioFilterType', this.state.filterType);
      localStorage.setItem('savedScenarioFilterValue', this.state.filterValue);
      this.fetchScenarios();
    }
  }

  componentDidMount() {
    this.setState({ loading: true });

    gql(this.queryServerlist)
    .then((data) => {
      const { servers } = data.connectedServices;
      for (let i = 0; i < servers.length; i++) {
        if (servers[i].name === this.props.match.params.serverName) {
          this.setState({
            error: null,
            shardID: servers[i].shardID,
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

  handleFilterEvent = (event) => {
    switch(event.target.name) {
      case 'filterType':
        this.setState({filterType: event.target.value});
        break;

      case 'filterValue':
        this.setState({filterValue: event.target.value});
        break;

      default:
        break;
    }
  }

  render() {
    const { loading, error, finishedScenarios, otherScenarios, filterType, filterValue } = this.state;
    const filterTypes = ['hours', 'days', 'weeks', 'months'];
    const filterValues = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];

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
        <FilterContainer>
          <FilterSubContainer>
            Age:&nbsp;
            <FilterSelectBox>
            <FilterSelect name="filterValue" value={filterValue} onChange={this.handleFilterEvent}>
              {filterValues.map(function(value) {
                return (
                  <option key={'filterValue-' + value} value={value}>{value}</option>
                );
              })}
            </FilterSelect>
            </FilterSelectBox>
            <FilterSelectBox>
            <FilterSelect name="filterType" value={filterType} onChange={this.handleFilterEvent}>
              {filterTypes.map(function(type) {
                return (
                  <option key={'filterType-' + type} value={type}>{type}</option>
                );
              })}
            </FilterSelect>
            </FilterSelectBox>
          </FilterSubContainer>
        </FilterContainer>
        <TableFinished scenarios={finishedScenarios} />
        <TableOther scenarios={otherScenarios} />
      </div>
    );
  }
}

export default ScenarioList;