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

    const issuesStub = Sinon.stub(JiraApi, 'componentsIssues').callsFake(
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

    it('should return a list of objects with `issuesCount` when Solution.componentIssuesCount is called', async () => {
      const components = await Solution.unassignedComponents();
      const issues = await Solution.componentIssuesCount(components);

      assert.deepStrictEqual(issues, [
        { name: 'Data analysis', issuesCount: 9 },
        { name: 'Infrastructure', issuesCount: 0 },
        { name: 'Marketplace', issuesCount: 0 },
      ]);
    });

    it('should return a list of objects with `issuesCount` when Solution.getIssuesCountOfUnassignedComponents is called', async () => {
      const results = await Solution.getIssuesCountOfUnassignedComponents();

      assert.deepStrictEqual(results, [
        { name: 'Data analysis', issuesCount: 9 },
        { name: 'Infrastructure', issuesCount: 0 },
        { name: 'Marketplace', issuesCount: 0 },
      ]);
    });

    it('should throw when trying to retrieve issues with null argument', async () => {
      await expect(Solution.componentIssuesCount(null)).rejects.toEqual(
        new Error('Trying to match issues with no component')
      );
    });

    it('should throw when trying to retrieve issues with undefined argument', async () => {
      await expect(Solution.componentIssuesCount()).rejects.toEqual(
        new Error('Trying to match issues with no component')
      );
    });

    it('should throw when trying to retrieve issues with empty array', async () => {
      await expect(Solution.componentIssuesCount([])).rejects.toEqual(
        new Error('Trying to match issues with no component')
      );
    });

    after(() => {
      componentsStub.restore();
      issuesStub.restore();
    });
  });

  describe('JiraApi', () => {
    it('should throw when calling componentsIssues with null argument', async () => {
      await expect(JiraApi.componentsIssues(null)).rejects.toEqual(
        new Error('Trying to retrieve issues with no matching component')
      );
    });

    it('should throw when calling componentsIssues with unsigned argument', async () => {
      await expect(JiraApi.componentsIssues()).rejects.toEqual(
        new Error('Trying to retrieve issues with no matching component')
      );
    });

    it('should throw when calling componentsIssues with empty array', async () => {
      await expect(JiraApi.componentsIssues([])).rejects.toEqual(
        new Error('Trying to retrieve issues with no matching component')
      );
    });
  });
});
