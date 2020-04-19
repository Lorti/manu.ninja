const generateCachedStylesheet = require('./build-styles');

module.exports = {
  styles() {
    const styles = generateCachedStylesheet();
    return `<style>${styles}</style>`;
  },
  currentDate() {
    return new Date().toISOString();
  },
  currentYear() {
    return `${new Date().getFullYear()}`;
  },
};
