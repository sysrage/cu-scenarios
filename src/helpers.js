// import React from 'react';
/**
 * GraphQL helper
 *
 * @param {string} query
 * @param {string} variables
 */
export const gql = (query, variables) => {
  const url = 'http://hatcheryapi.camelotunchained.com/graphql';
  const headers = {
      'api-version': '1.0',
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    //   'loginToken': 'demo',
    //   'shardId': '1',
  };
  const body = JSON.stringify({ query, variables });
  return new Promise((resolve, reject) => {
      fetch(url, { method: 'post', headers, body })
      .then((response) => {
          response.json().then((data) => {
              if (response.status === 200 && data.data) {
                  resolve(data.data);
                  return;
              }
              console.log('gql(): reject status: ' + response.status + ' message: ' + data.Message, 'errors: ', data.errors);
              reject({ status: response.status, message: data.Message });
          });
      })
      .catch((reason) => {
          console.error(reason.message);
          reject({ reason: 'API server unavailable' });
      });
  });
}


/**
 * GraphQL helper (with shard -- I know...)
 *
 * @param {number} shard
 * @param {string} query
 * @param {string} variables
 */
export const gqlws = (shard, query, variables) => {
    const url = 'http://hatcheryapi.camelotunchained.com/graphql';
    const headers = {
        'api-version': '1.0',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        // 'loginToken': 'demo',
        'shardId': shard,
    };
    const body = JSON.stringify({ query, variables });
    return new Promise((resolve, reject) => {
        fetch(url, { method: 'post', headers, body })
        .then((response) => {
            response.json().then((data) => {
                if (response.status === 200 && data.data) {
                    resolve(data.data);
                    return;
                }
                console.log('gql(): reject status: ' + response.status + ' message: ' + data.Message, 'errors: ', data.errors);
                reject({ status: response.status, message: data.Message });
            });
        })
        .catch((reason) => {
            console.error(reason.message);
            reject({ reason: 'API server unavailable' });
        });
    });
  }


  /**
 * Fetch error helper
 *
 * @param {object} response
 */
export const handleResponse = (response) => {
  return response.json().then(json => {
    return response.ok ? json : Promise.reject(json);
  });
}
