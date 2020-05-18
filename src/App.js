import React, { Component } from 'react';
import './App.css';
import { TargetPhrase
       , Answer
       , Add
       , Cut
       , Fix
       , Flip
       } from './components/inputs'
import LSS from './tools/lss'

window.LSS = LSS


class App extends Component {
  constructor(props) {
    super(props)

    this.newPhrase   = this.newPhrase.bind(this)
    this.checkSize   = this.checkSize.bind(this)
    this.onKeyDown   = this.onKeyDown.bind(this)
    this.updateInput = this.updateInput.bind(this)

    // regex will match the first group of words that are linked
    // together_with_underscores or which form a sequence of words _all
    // _with _a _leading _underscore. Trailing _underscores_ will be
    // included in the match. Subsequent underscores will be silently
    // ignored and removed or replaced by spaces.
    this.regex  = /(.*?)((?:\w+(?=_))?(?:_(?:[^\s,;:.?!]*))+)(.*)/
    this.zeroWidthSpace = "​" // "&#x200b;"

    const startUp      = true
    const phrase       = "Hello _world" //"Я сказал «_Здравствуйте!»"
    const initialState = this.treatPhrase(phrase, startUp)
    this.state         = initialState
  }


  newPhrase(event) {
    const phrase = event.target.value
    this.setState({ phrase })
    this.treatPhrase(phrase)
  }


  treatPhrase(phrase, startUp) {
    const match  = this.regex.exec(phrase)
    if (!match) {
      // There are no _underscored words yet
      return
    }

    match.shift() // lose the full match
    // console.log("match:", match)

    let start   = match.shift().trim()
    if (start) {
      start += " "
    }
    const end   = match.pop().replace(/[_\s]+/g, " ").trimRight()
    const cloze = match.shift()
                          .replace(/[_\s]+/g, " ") // << nbsp
                          .trim()
    const data = {
      phrase
    , expected: cloze
    , start
    , cloze
    , end
    , fromNewPhrase: true
    , input: ""
    , width: 0
    }
    // console.log( "\""
    //            + start
    //            + this.state.expected
    //            + end
    //            + "\""
    //            )

    if (startUp) {
      // Don't setState on startUp
      // console.log("phrase data:", data)
      return data
    }

    this.setState(data)
  }


  onKeyDown(event) {
    this.input = event.target.value
  }


  updateInput(event) {
    const input = event.target.value

    this.setState({ input })

    this.treatInput(input)
  }


  treatInput(input) {
    // console.log("treat input:", input)
    // console.log("t่his.state:", this.state)

    let error = false
    let correct = false
    let expectedOutput = [this.state.expected.toLowerCase()
                                             .replace(/ /g, " ")
                         ]
    let receivedOutput = [input.toLowerCase()]

    const toTreat = {
      expected: [expectedOutput]
    , received: [receivedOutput]
    }


    const lookForSwaps = (expectedArray, receivedArray, lss, error) => {
      const expectedString = expectedArray[0]
      const receivedString = receivedArray[0]
      const eLength = expectedString.length - 1 // -1 so we don't

      const rLength = receivedString.length - 1 // overrun with ii + 1
      let dontSplit = false

      if (eLength && rLength) {
        for ( let ii = 0; ii < eLength; ii += 1 ) {
          const ch1 = expectedString[ii]
          const offset1 = receivedString.indexOf(ch1)
          if (offset1 < 0) {
            // No match, so no flipped pair, so move on
          } else {
            const ch2 = expectedString[ii + 1]
            const offset2 = receivedString.indexOf(ch2)
            if (offset2 < 0) {
              // The second element of the pair is missing. No match.
            } else if (Math.abs(offset1 - offset2) === 1) {
              // We've found a swap. Split the strings into three
              splitStringAt(ch1+ch2, expectedArray, toTreat.expected)
              splitStringAt(ch2+ch1, receivedArray, toTreat.received)

              // There may be more swaps further along, but they will
              // be treated in a subsequent iteration of the while
              // loop below
              dontSplit = true
              error = true
              break
            }
          }
        }
      }

      if (!dontSplit) {
        splitStrings(expectedArray, receivedArray, lss)
      }

      return error
    }


    const splitStringAt = (chunk, array, toTreat) => {
      const string = array.pop()
      const offset = string.indexOf(chunk)
      const offend = offset + chunk.length

      const before = [string.substring(0, offset)]
      array.push(before)
      toTreat.push(before)

      array.push(chunk)

      const after  = [string.substring(offend)]
      array.push(after)
      toTreat.push(after)
    }


    const splitStrings = (expectedArray, receivedArray, lss) => {
      splitStringAt(lss, expectedArray, toTreat.expected)
      splitStringAt(lss, receivedArray, toTreat.received)
    }


    const flatten = (array, flattened=[]) => {
      let item
      // "" is falsy, but we need to treat empty string items, so we
      // need a tricky `while` expression which will return true for
      // any array or string, even it's empty, while at the same time
      // setting `item` to the value shifted from the array. When the
      // array is empty, item will take the value `undefined` and the
      // while expression will return false.


      while ((item = array.shift(), !!item || item === "")) {

        if (Array.isArray(item)) {
          const flip = item.flip || false
          item = flatten(item)
          item.forEach(entry => {
            if (flip) {
              entry.flip = true
            }

            flattened.push(entry)
          })

        } else {
          flattened.push(item)
        }
      }

      return flattened
    }


    const restoreCase = (array, original) => {
      let start = 0
      let end = 0
      array.forEach((chunk, index) => {
        end += chunk.length
        array[index] = original.substring(start, end)
        start = end
      })
    }


    const treatFix = (received, expected, key, cloze) => {
      if ( expected[0] === received[1]
        && expected[1] === received[0]
         ) {
        cloze.push(<Flip
          key={key}
        >{received}</Flip>)

        return
      }

      cloze.push(<Fix
        key={key}
      >{received}</Fix>)
    }


    while (toTreat.expected.length) {
      const expectedArray = toTreat.expected.pop()
      const receivedArray = toTreat.received.pop()
      const expected = expectedArray[0]
      const received = receivedArray[0]

      if (!expected || !received) {
        // Add or cut, or both may be empty

      } else {
        const lss = LSS(expected, received)

        // console.log(expectedArray, receivedArray, lss)

        switch (lss.length) {
          case 0:
            // There is nothing in common in these strings.
            error = true
          break

          case 1:
            // There may be more matching letters, but flipped
            error=lookForSwaps(expectedArray,receivedArray,lss,error)
          break

          default:
            splitStrings(expectedArray, receivedArray, lss)
        }
      }
    }

    expectedOutput = flatten(expectedOutput)
    receivedOutput = flatten(receivedOutput)

    // console.log("ex",expectedOutput)
    // console.log("in",receivedOutput)

    // restoreCase(expectedOutput, this.state.expected)
    restoreCase(receivedOutput, input)

    // console.log("expected flattened:", expectedOutput)
    // console.log("received flattened:", receivedOutput)

    const lastIndex = receivedOutput.length - 1
    let cloze = []

    receivedOutput.forEach((chunk, index) => {
      const key = index + chunk
      const expected = expectedOutput[index]

      if (chunk.toLowerCase() === expected) {
          if (chunk) { // ignore empty items
          cloze.push(<span
            key={key}
          >{chunk}</span>)
        }

      } else if (chunk.flip) {
        cloze.push(<Flip
          key={key}
        >{chunk}</Flip>)

      } else if (!chunk) {
        if (expected && index !== lastIndex) {
          cloze.push(<Add
          key={key}
          />)
        } // else both input and expected are "", for the last item
        // TODO: Set a timeout so that index !== lastIndex is ignored
        // if you stop typing before you reach the end.

      } else if (!expected) {
        cloze.push(<Cut
          key={key}
        >{chunk}</Cut>)

      } else {
        treatFix(chunk, expected, key, cloze)
      }
    })

    if (cloze.length === 1) {
      if (input.length === this.state.expected.length) {
        correct = true
      }
    } else if (cloze.length) {
      error = true
    }

    if (!cloze.length) {
      cloze = [this.zeroWidthSpace]
    }

    this.setState({ cloze, error, correct })
  }


  /**
   * checkSize is called a first time as the `ref` of the
   * WidthHolder component. For this first call, the `span`
   * argument will contain the actual DOM element, so we capture that
   * and store it in `this.span`, because we won't get a second
   * chance.
   *
   * Subsequent calls are sent from WidthHolder's componentDidUpdate
   * method, which has no direct access to the DOM element itself, so
   * we need to use the stored `this.span`
   *
   * We need to check that either the width or the current value of
   * `this.input`, because if we reset this.state.width or
   * this.state.input to their current values, React will trigger a
   * new render, endlessly.
   */
  checkSize(span){
    if (span && !this.span) {
      this.span = span
    }
    this.setSize()
  }


  setSize() {
    const width = this.span.getBoundingClientRect().width + 1

    // console.log("setWidth:", width)

    if (this.state.width !== width){
      if (this.state.fromNewPhrase) {
        this.setState({
          width
        , minWidth: width
        , cloze: this.zeroWidthSpace
        , fromNewPhrase: false
        })

      } else {
        this.setState({ width })
      }
    }
  }


  render() {
    return (
      <div id="spellcheck">
        <h1>Spellcheck Test</h1>
        <TargetPhrase
          newPhrase={this.newPhrase}
          phrase={this.state.phrase}
        />
        <Answer
          phrase={this.state}
          size={this.checkSize}
          change={this.updateInput}
          keyDown={this.onKeyDown}
        />
      </div>
    )
  }
}


export default App;
