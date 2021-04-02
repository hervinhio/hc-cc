const assert = require('assert');
const expect = require('expect');
const Sinon = require('sinon');
const { JiraApi } = require('./jira-api');
const { Solution } = require('./solution');
const { Components, Issues } = require('./test-data');

describe('Coding Challenge tests', () => {
  describe('Solution', () => {
    const componentsStub = Sinon.stub(JiraApi, 'components');
    componentsStub.returns(Components);

    const issuesStub = Sinon.stub(JiraApi, 'componentsTickets').callsFake(
      (components) => {
        const componentNames = components.map((c) => c.name);
        return Issues.issues.filter(
          (issue) =>
            !!issue.fields.components.find((c) =>
              componentNames.includes(c.name)
            )
        );
      }
    );

    it('should return a list of unassigned components when Solution.unassignedComponents() is called', async () => {
      const components = await Solution.unassignedComponents();
      assert.ok(components.every((c) => !c.lead));
    });

    it('should return a list of objects with `issuesCount` when Solution.componentTicketsCount is called', async () => {
      const components = await Solution.unassignedComponents();
      const issues = await Solution.componentTicketsCount(components);

      assert.deepStrictEqual(issues, [
        { name: 'Data analysis', ticketsCount: 9 },
        { name: 'Infrastructure', ticketsCount: 0 },
        { name: 'Marketplace', ticketsCount: 0 },
      ]);
    });

    it('should return a list of objects with `issuesCount` when Solution.getIssuesCountOfUnassignedComponents is called', async () => {
      const results = await Solution.getIssuesCountOfUnassignedComponents();

      assert.deepStrictEqual(results, [
        { name: 'Data analysis', ticketsCount: 9 },
        { name: 'Infrastructure', ticketsCount: 0 },
        { name: 'Marketplace', ticketsCount: 0 },
      ]);
    });

    it('should throw when trying to retrieve tickets with null argument', async () => {
      await expect(Solution.componentTicketsCount(null)).rejects.toEqual(
        new Error('Trying to match issues with no component')
      );
    });

    it('should throw when trying to retrieve tickets with undefined argument', async () => {
      await expect(Solution.componentTicketsCount()).rejects.toEqual(
        new Error('Trying to match issues with no component')
      );
    });

    it('should throw when trying to retrieve tickets with empty array', async () => {
      await expect(Solution.componentTicketsCount([])).rejects.toEqual(
        new Error('Trying to match issues with no component')
      );
    });

    after(() => {
      componentsStub.restore();
      issuesStub.restore();
    });
  });

  describe('JiraApi', () => {
    it('should throw when calling componentsTickets with null argument', async () => {
      await expect(JiraApi.componentsTickets(null)).rejects.toEqual(
        new Error('Trying to retrieve tickets with no matching component')
      );
    });

    it('should throw when calling componentsTickets with unsigned argument', async () => {
      await expect(JiraApi.componentsTickets()).rejects.toEqual(
        new Error('Trying to retrieve tickets with no matching component')
      );
    });

    it('should throw when calling componentsTickets with empty array', async () => {
      await expect(JiraApi.componentsTickets([])).rejects.toEqual(
        new Error('Trying to retrieve tickets with no matching component')
      );
    });
  });
});
