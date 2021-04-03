const checkArrayArg = require('./array-arg-util');
const logAndRethrow = require('./exception-util');
const { JiraApi } = require('./jira-api');

const unassignedComponents = async () => {
  try {
    const matches = await JiraApi.components();
    return matches.filter((component) => !component.lead);
  } catch (e) {
    logAndRethrow(e, 'Unable to fetch unassigned components');
  }
};

const componentIssuesCount = async (components, componentCallback) => {
  checkArrayArg(components, 'Trying to match issues with no component');

  return Promise.all(
    components.map((component) =>
      JiraApi.componentIssues(component, componentCallback)
    )
  );
};

const unassignedComponentsIssuesCounts = async (callback) => {
  try {
    const components = await unassignedComponents();
    return componentIssuesCount(components);
  } catch (e) {
    logAndRethrow(e, 'Error while trying to retrieve issues information');
  }
};

module.exports = {
  Solution: {
    unassignedComponents,
    componentIssuesCount,
    unassignedComponentsIssuesCounts,
  },
};
