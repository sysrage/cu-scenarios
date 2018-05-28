import React from 'react';
import { gql } from '../../helpers';
import Loading from '../common/Loading';
import ServerTable from './ServerTable';

class ServerList extends React.Component {
  constructor() {
    super();

    this.state = {
      loading: false,
      servers: [],
      error: null,
    };
  }

  queryServerList = `{
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

  fetchTimer = {};
  fetchServers() {
    gql(this.queryServerList)
    .then((data) => {
      const { servers } = data.connectedServices;

      // ** screw up hatchery on first load to test
      // if (this.state.servers.length < 1) {
      //   for (let i = 0; i < servers.length; i++) {
      //     if (servers[i].name === 'Hatchery') {
      //       servers[i].status = 'Offline';
      //       servers[i].playerMaximum = 0;
      //     }
      //   }
      // }

      this.setState({
        servers,
        loading: false,
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
    this.fetchServers();
    this.fetchTimer = setInterval(() => {this.fetchServers()}, 2000);
  }

  componentWillUnmount() {
    clearInterval(this.fetchTimer);
  }

  render() {
    const { loading, error, servers } = this.state;

    if (loading) {
      return <div className="loading-container"><Loading /></div>
    }

    if (error) {
      return <div className="error">{error}</div>
    }

    return (
      <div>
        <ServerTable
          servers={servers}
        />
      </div>
    );
  }
}

export default ServerList;