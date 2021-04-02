const superagent = require('superagent');
const checkArrayArg = require('./array-arg-util');
const logAndRethrow = require('./exception-util');

const Url = 'https://herocoders.atlassian.net';
const ComponentsEndpoint = '/rest/api/3/project/IC/components';
const SearchEndpoint = '/rest/api/3/search?jql=project%20%3D%20IC%20';
const ComponentQueryPart = 'AND%20component%20IN(IN_QUERY_PLACEHOLDER)';

const getUrlSearchPart = (components) => {
  const inJqlPart = getINJqlQueryPart(components);
  let urlSearchPart = ComponentQueryPart.replace(
    'IN_QUERY_PLACEHOLDER',
    inJqlPart
  );
  return urlSearchPart.replace(' ', '%20');
};

const getINJqlQueryPart = (components) => {
  if (components.length === 1) {
    return `"${components[0].name}"`;
  } else {
    return components.reduce((previous, current, index) => {
      let queryPart = previous;
      if (index === 1) {
        queryPart = `"${previous.name}"`;
      }

      return `${queryPart}%2C"${current.name}"`;
    });
  }
};

const components = async () => {
  try {
    const { body } = await superagent.get(`${Url}${ComponentsEndpoint}`);
    return body;
  } catch (e) {
    logAndRethrow(e, 'Unable to fetch components');
  }
};

const componentsTickets = async (components) => {
  checkArrayArg(
    components,
    'Trying to retrieve tickets with no matching component'
  );

  try {
    const urlSearchPart = getUrlSearchPart(components);
    const { body } = await superagent.get(
      `${Url}${SearchEndpoint}${urlSearchPart}`
    );
    
    return body.issues || [];
  } catch (e) {
    logAndRethrow(e, 'Error while retrieving tickest');
  }
};

module.exports = {
  JiraApi: {
    components,
    componentsTickets,
  },
};
