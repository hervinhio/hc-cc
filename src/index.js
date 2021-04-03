const { Solution } = require('./solution');

const main = async () => {
  const results = await Solution.unassignedComponentsIssuesCounts();

  results.forEach((r) => {
    console.info(`Component '${r.name}' with no lead has ${r.total} issues`);
  });
};

main();
