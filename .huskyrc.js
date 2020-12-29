/**
 * @param task {string[]}
 */
const tasks = (...task) => task.join(` && `);

module.exports = {
  hooks: {
    'pre-commit': tasks('npm run lint', 'npm run fmt', 'npm run build', 'git add .'),
  },
};
