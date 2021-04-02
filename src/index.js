const { Solution } = require('./solution');

const main = async () => {
  const result = await Solution.getIssuesCountOfUnassignedComponents();

  result.forEach((r) => {
    console.log(
      `Component '${r.name}' with no lead has ${r.issuesCount} issues`
    );
  });
};

main();
