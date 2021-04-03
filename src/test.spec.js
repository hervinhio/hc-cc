const assert = require('assert');
const expect = require('expect');
const Sinon = require('sinon');
const { JiraApi } = require('./jira-api');
const { Solution } = require('./solution');
const { Components, Issues } = require('./test-data');

describe('Coding Challenge tests', () => {
  describe('Solution', () => {
    let componentCallbackSpy = Sinon.spy();
    const componentsStub = Sinon.stub(JiraApi, 'components');
    componentsStub.returns(Components);

    const issuesStub = Sinon.stub(JiraApi, 'componentIssues').callsFake(
      (component) => {
        const issues = Issues.issues.filter(
          (issue) =>
            !!issue.fields.components.find((c) => c.name === component.name)
        );

        return new Promise((resolve) =>
          resolve({ name: component.name, total: issues.length })
        );
      }
    );

    afterEach(() => {
      componentCallbackSpy.resetHistory();
    });

    it('should return a list of unassigned components when Solution.unassignedComponents() is called', async () => {
      const components = await Solution.unassignedComponents();
      assert.ok(components.every((c) => !c.lead));
    });

    it('should call component callback 3 times when retrieving component issues', async () => {
      const components = await Solution.unassignedComponents();
      const results = await Solution.componentIssuesCount(components);

      assert.deepStrictEqual(results, [
        { name: 'Data analysis', total: 9 },
        { name: 'Infrastructure', total: 0 },
        { name: 'Marketplace', total: 0 },
      ]);
    });

    it('should return a list of objects with `issuesCount` when Solution.unassignedComponentsIssuesCounts is called', async () => {
      const results = await Solution.unassignedComponentsIssuesCounts();

      assert.deepStrictEqual(results, [
        { name: 'Data analysis', total: 9 },
        { name: 'Infrastructure', total: 0 },
        { name: 'Marketplace', total: 0 },
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
    it('should throw when calling componentIssues with null component', async () => {
      await expect(JiraApi.componentIssues(null)).rejects.toEqual(
        new Error(
          `Can't call componentIssues without a component or a componentCallback`
        )
      );
    });
  });
});
