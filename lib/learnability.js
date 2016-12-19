const sum = require('./sum')

module.exports = learnability

// Return a comparator which places words comprised of common characters
// before uncommon ones. These words would be helpful when learning to type of
// a new keyboard layout.
function learnability (corpus) {
  const rank = rankChars(corpus)

  function complexity (word) {
    return word
      .split('')
      .map(char => rank.indexOf(char.toLowerCase()))
      .reduce(sum, 0)
  }

  return function (a, b) {
    return complexity(a) - complexity(b)
  }
}

function rankChars (corpus) {
  const occur = corpus.reduce((occur, word) => {
    word.split('').forEach(char => {
      char = char.toLowerCase()
      if (char in occur) {
        occur[char]++
      } else {
        occur[char] = 1
      }
    })
    return occur
  }, {})

  const rank = Object.keys(occur).sort((a, b) => {
    return occur[b] - occur[a]
  })

  return rank
}

// Helpfulness is based on the number common characters in the word.
// Lower is more helpful (because its easier)
function helpfulness (rank) {
  return
}
