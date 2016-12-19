/* global localStorage */
(function () {
  var offset = Number(window.localStorage.start) || 0

  var _text = document.querySelector('.standard').textContent.replace('\n', ' ')
  var standard = _text.substr(_text.indexOf(' ', offset)).trim()

  // Elements
  var input = document.querySelector('input')
  var correct = document.querySelector('.correct')
  var incorrect = document.querySelector('.incorrect')
  var rest = document.querySelector('.rest')
  var wpm = document.querySelector('.wpm')
  var frame = document.querySelector('.frame')

  // Buttons
  var refreshBtn = document.querySelector('.refresh')
  var restartBtn = document.querySelector('.restart')
  var skipAheadBtn = document.querySelector('.skip-ahead')
  var toggleBtn = document.querySelector('.toggle-input')
  var keyboardBtn = document.querySelector('.toggle-keyboard')

  // Configs
  var snippetLength = 300
  var avg = 4.9 // wordLength(standard) // Use a fixed avg word length

  // Initialize
  setInputVisibility(localStorage.showInput)
  setKeyboardVisibility(localStorage.showKeyboard)
  rest.textContent = standard.substr(0, snippetLength)
  input.classList.add('ok')
  input.value = ''

  // Start timer at first keydown
  let timer
  function initTimer (evt) {
    if (!timer) timer = Date.now()
    input.onkeydown = null
  }
  input.onkeydown = initTimer

  // Keep track of mistyped chars
  let errors = 0

  // Listen for keyup event
  input.onkeyup = function (evt) {
    var typed = input.value
    var len = input.value.length
    var validated = standard.substr(0, len)
    var ok = correct.textContent.length

    if (typed === validated) {
      // User did good!
      input.classList.add('ok')

      correct.textContent = validated
      incorrect.textContent = ''
      rest.textContent = standard.substr(len, snippetLength)

      localStorage.start = offset + ok
    } else {
      // Fail.
      input.classList.remove('ok')

      // If user isn't backspacing
      if (evt.which !== 8) {
        errors++
      }

      incorrect.textContent = standard.substr(ok, len - ok)
      rest.textContent = standard.substr(len, snippetLength)
    }

    // Set WPM indicator
    var elapsed = Date.now() - timer
    var wordsPerMinute = Math.round(((len / avg) / (elapsed / 60000)) || 0)
    wpm.textContent = `${wordsPerMinute} wpm  ${errors} errors`

    // Make sure new content is focused
    frame.scrollTop = correct.getBoundingClientRect().height - 27
  }

  // Keep that input focused!
  input.onblur = function () {
    window.setTimeout(function () {
      input.focus()
      input.selectionStart = input.value.length
    }, 0)
  }

  // Use this to calculate the actual avg word length
  // function wordLength (text) {
  //   return text
  //     .split(' ')
  //     .map(word => word.length)
  //     .reduce((avg, len, i) => ((avg * i) + len) / (i + 1), 0)
  // }

  function refresh () {
    document.location = document.location
  }

  function setInputVisibility (show) {
    if (toggleBtn) {
      if (show === 'true') {
        toggleBtn.textContent = 'Hide What I’m Typing'
        document.body.classList.remove('hide-input')
      } else {
        toggleBtn.textContent = 'Show What I’m Typing'
        document.body.classList.add('hide-input')
      }
    }
  }
  function setKeyboardVisibility (show) {
    if (keyboardBtn) {
      if (show === 'true') {
        keyboardBtn.textContent = 'Hide Keyboard'
        document.body.classList.remove('hide-keyboard')
      } else {
        keyboardBtn.textContent = 'Show Keyboard'
        document.body.classList.add('hide-keyboard')
      }
    }
  }

  /**
   * Set the button listeners
   */
  refreshBtn.onclick = refresh
  toggleBtn.onclick = function toggleInput () {
    localStorage.showInput = (localStorage.showInput === 'true') ? 'false' : 'true'
    setInputVisibility(localStorage.showInput)
  }
  if (restartBtn) {
    restartBtn.onclick = function restart () {
      localStorage.start = 0
      refresh()
    }
  }
  if (skipAheadBtn) {
    skipAheadBtn.onclick = function skip () {
      localStorage.start = Number(localStorage.start) + 2000
      refresh()
    }
  }
  if (keyboardBtn) {
    keyboardBtn.onclick = function toggleKeyboard () {
      localStorage.showKeyboard = (localStorage.showKeyboard === 'true') ? 'false' : 'true'
      setKeyboardVisibility(localStorage.showKeyboard)
    }
  }
})()
