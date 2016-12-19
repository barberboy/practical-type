module.exports = randomize

// Arrange the items in an array randomly
function randomize (array) {
  return array.sort((a, b) => Math.random() - 0.5)
}
