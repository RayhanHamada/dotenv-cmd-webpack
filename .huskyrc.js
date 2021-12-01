/**
 * @param task {string[]}
 */
const tasks = (...task) => task.join(` && `);

module.exports = {
  hooks: {
    'pre-commit': tasks('npm run test'),
  },
};
