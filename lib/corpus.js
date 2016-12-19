const repeat = require('./repeat')
const concatAll = Function.prototype.apply.bind(Array.prototype.concat)

module.exports = corpus

// Build a corpus that contains the most popular 1000 words, with the most
// popular words occuring more frequently
function corpus (words) {
  return concatAll([], words.map((word, i) => repeat(word, ((1000 - i) / 5) + 25)))
}
