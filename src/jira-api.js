const superagent = require('superagent');
const logAndRethrow = require('./exception-util');

const Url = 'https://herocoders.atlassian.net';
const ComponentsEndpoint = '/rest/api/3/project/IC/components';
const SearchEndpoint =
  '/rest/api/3/search?pagelen=1&jql=project%20%3D%20IC%20AND%20component%20%3D%20';

const components = async () => {
  try {
    const { body } = await superagent.get(`${Url}${ComponentsEndpoint}`);
    return body;
  } catch (e) {
    logAndRethrow(e, 'Unable to fetch components');
  }
};

const componentIssues = async (component) => {
  checkComponentArgument(component);

  try {
    const { body } = await superagent.get(
      `${Url}${SearchEndpoint}"${component.name}"`
    );
    return { name: component.name, total: body.total };
  } catch (e) {
    logAndRethrow(e, 'Error while retrieving tickest');
  }
};

const checkComponentArgument = (component) => {
  if (!component) {
    throw new Error(
      `Can't call componentIssues without a component or a componentCallback`
    );
  }
};

module.exports = {
  JiraApi: {
    components,
    componentIssues,
  },
};
