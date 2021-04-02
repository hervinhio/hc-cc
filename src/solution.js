const checkArrayArg = require('./array-arg-util');
const logAndRethrow = require('./exception-util');
const { JiraApi } = require('./jira-api');

const getIssuesBelongingToComponent = (component, issues) => {
  return issues.filter((issue) => issueBelongsToComponent(issue, component));
};

const issueBelongsToComponent = (issue, component) => {
  return !!issue.fields.components.find((c) => c.name === component.name);
};

const unassignedComponents = async () => {
  try {
    const matches = await JiraApi.components();
    return matches.filter((component) => !component.lead);
  } catch (e) {
    logAndRethrow(e, 'Unable to fetch unassigned components');
  }
};

const componentIssuesCount = async (components) => {
  checkArrayArg(components, 'Trying to match issues with no component');

  try {
    const issues = await JiraApi.componentsIssues(components);

    return components.map((component) => {
      const componentIssues = getIssuesBelongingToComponent(component, issues);

      return {
        name: component.name,
        issuesCount: componentIssues?.length || 0,
      };
    });
  } catch (e) {
    logAndRethrow(e, 'Error while trying to get issues mathing to components');
  }
};

const getIssuesCountOfUnassignedComponents = async () => {
  try {
    const components = await unassignedComponents();
    return await componentIssuesCount(components);
  } catch (e) {
    logAndRethrow(e, 'Error while trying to retrieve issues information');
  }
};

module.exports = {
  Solution: {
    unassignedComponents,
    componentIssuesCount,
    getIssuesCountOfUnassignedComponents,
  },
};
