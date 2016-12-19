/**
 * generate - Generate word lists in the "dict" folder
 */
const push = Function.prototype.apply.bind(Array.prototype.push)

const fs = require('fs')
const randomize = require('./lib/randomize')
const repeat = require('./lib/repeat')
const corpusBuilder = require('./lib/corpus')
const learnability = require('./lib/learnability')

const commonWords = fs.readFileSync('./dict/common.txt', 'utf-8').split('\n')

const file = process.argv[2]
switch (file) {

  // Create an ordered list of learnable words
  case 'dict/learnable.txt': {
    const corpus = corpusBuilder(commonWords)
    const helpful = commonWords.slice().sort(learnability(corpus))
    console.log(`Writing to ${file}`)
    fs.writeFileSync(file, helpful.join('\n'), 'utf-8')

    break
  }

  // Just randomize the corpus and output
  case 'dict/corpus.txt': {
    const corpus = randomize(corpusBuilder(commonWords))
    console.log(`Writing to ${file}`)
    fs.writeFileSync(file, corpus.join(' '), 'utf-8')
    break
  }

  // Create a copy of words, sorted by helpfulness
  case 'dict/learn.txt': {
    const corpus = corpusBuilder(commonWords)
    const helpful = commonWords.slice().sort(learnability(corpus))
    const output = []

    commonWords.forEach((word, i) => {
      push(output, randomize([].concat(
        repeat(word, 9),
        repeat(helpful[i], 4),
        commonWords.slice(i, i + 6),
        helpful.slice(i, i + 11)
      )))
    })

    console.log(`Writing to ${file}`)
    fs.writeFileSync(file, output.join(' '), 'utf-8')
    break
  }

  case 'site': {
    console.log('Sorry, run `npm run build-site` instead!')
    break
  }

  default: {
    console.log(`
Usage: node dict <file>

    dict/learnable.txt    an ordered list of helpful words to learn
    dict/corpus.txt       an expanded version of common.txt with repeated words
    dict/learn.txt        an expanded version of learnable.txt with repeated words

To build the "docs" folder, run \`npm run build-site\`.
    `)
  }
}
