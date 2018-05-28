import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import { gql } from '../../helpers';

const PlayerCount = styled('span')`
  padding-right: ${props => props.faction === 'viking' ? '0px' : '14px'};
  color: ${props => props.faction === 'arthurian' ? '#FF8080' : props.faction === 'viking' ? '#6DB9D9' : '#92E989'};
  font-weight: 700;
`;

class PlayerCounts extends React.Component {
  constructor() {
    super();

    this.state = {
      playerCountA: 0,
      playerCountT: 0,
      playerCountV: 0,
    };
  }

  query(server) {
    return `
      {
        metrics {
          currentPlayerCount(server: "${server}") {
            arthurian
            tuatha
            viking
          }
        }
      }
    `
  }

  fetchTimer = {};
  fetchPlayers() {
    const { server } = this.props;

    gql(this.query(server))
    .then((data) => {
      const { arthurian, tuatha, viking  } = data.metrics.currentPlayerCount;

      if (arthurian !== this.state.playerCountA) {
        this.setState({playerCountA: arthurian});
      }
      if (tuatha !== this.state.playerCountT) {
        this.setState({playerCountT: tuatha});
      }
      if (viking !== this.state.playerCountV) {
        this.setState({playerCountV: viking});
      }
    })
    .catch((error) => {
      console.log('GQL Error', error);
    });

  }

  componentWillMount() {

  }

  componentDidMount() {
    this.fetchPlayers();
    this.fetchTimer = setInterval(() => {this.fetchPlayers()}, 3000);
  }

  componentWillUnmount() {
    clearInterval(this.fetchTimer);
  }

  render() {
    return (
      <div>
        <PlayerCount faction='arthurian'>{this.state.playerCountA} A</PlayerCount>
        <PlayerCount faction='tuatha'>{this.state.playerCountT} T</PlayerCount>
        <PlayerCount faction='viking'>{this.state.playerCountV} V</PlayerCount>
      </div>
    )
  }
}

PlayerCounts.propTypes = {
  server: PropTypes.string.isRequired,
};

export default PlayerCounts;