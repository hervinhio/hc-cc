const checkArrayArg = require('./array-arg-util');
const logAndRethrow = require('./exception-util');
const { JiraApi } = require('./jira-api');

const getTicketsBelongingToComponent = (component, tickets) => {
  return tickets.filter((ticket) =>
    ticketBelongsToComponent(ticket, component)
  );
};

const ticketBelongsToComponent = (ticket, component) => {
  return !!ticket.fields.components.find((c) => c.name === component.name);
};

const unassignedComponents = async () => {
  try {
    const matches = await JiraApi.components();
    return matches.filter((component) => !component.lead);
  } catch (e) {
    logAndRethrow(e, 'Unable to fetch unassigned components');
  }
};

const componentTicketsCount = async (components) => {
  checkArrayArg(components, 'Trying to match issues with no component');

  try {
    const tickets = await JiraApi.componentsTickets(components);

    return components.map((component) => {
      const componentIssues = getTicketsBelongingToComponent(
        component,
        tickets
      );

      return {
        name: component.name,
        ticketsCount: componentIssues?.length || 0,
      };
    });
  } catch (e) {
    logAndRethrow(e, 'Error while trying to get tickets mathing to components');
  }
};

const getIssuesCountOfUnassignedComponents = async () => {
  try {
    const components = await unassignedComponents();
    return await componentTicketsCount(components);
  } catch (e) {
    logAndRethrow(e, 'Error while trying to retrieve issues information');
  }
};

module.exports = {
  Solution: {
    unassignedComponents,
    componentTicketsCount,
    getIssuesCountOfUnassignedComponents,
  },
};
