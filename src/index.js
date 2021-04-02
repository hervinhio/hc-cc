const { Solution } = require('./solution');

const main = async () => {
  const result = await Solution.getIssuesCountOfUnassignedComponents();
  console.info(result);
};

main();
