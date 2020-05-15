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

    this.newPhrase = this.newPhrase.bind(this)
    this.updateInput = this.updateInput.bind(this)
    this.getSize = this.getSize.bind(this)
    this.width = "100"

    // regex will match the first group of words that are linked
    // together_with_underscores or which form a sequence of words _all
    // _with _a _leading _underscore. Trailing _underscores_ will be
    // included in the match. Subsequent underscores will be silently
    // ignored and removed or replaced by spaces.
    this.regex  = /(.*?)((\w+(?=_))?(_([^\s,;:.?!]*))+)(.*)/

    const startUp      = true
    const phrase       = "Я сказал «_Здравствуйте!»"
    const initialState = this.treatPhrase(phrase, startUp)
    this.state         = initialState
  }


  newPhrase(event) {
    const phrase = event.target.value
    this.setState({ phrase })
    this.treatPhrase(phrase)
  }


  updateInput(event) {
    const input = event.target.value
    this.setState({ input })
    this.treatInput(input)
  }


  treatPhrase(phrase, startUp) {
    const match  = this.regex.exec(phrase)
    if (!match) {
      // There are no _underscored words yet
      return
    }

    match.shift() // lose the full match
    // console.log("match:", match)

    const start   = match.shift()// spaces will be between spans
    const end     = match.pop().replace(/[_\s]+/g, " ").trim()
    this.expected = match.shift()
                         .replace(/[_\s]+/g, " ") // << nbsp
                         .trim()
    const cloze = <span>{this.expected}</span>
    const data = {
      phrase
    , start
    , cloze
    , end
    , getSize: true
    }
    // console.log( "\""
    //            + start
    //            + this.expected
    //            + end
    //            + "\""
    //            )

    if (startUp) {
      // Don't setState on startUp
      return data
    } else {
      this.setState(data)
    }

    this.setSize()
  }


  treatInput(input) {
    let expectedOutput = [this.expected.toLowerCase()
                                       .replace(/ /g, " ")
                         ]
    let receivedOutput = [input.toLowerCase()]

    const toTreat = {
      expected: [expectedOutput]
    , received: [receivedOutput]
    }


    const lookForSwaps = (expectedArray, receivedArray, lss) => {
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
              break
            }
          }
        }
      }

      if (!dontSplit) {
        splitStrings(expectedArray, receivedArray, lss)
      }
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
        // Add or cut. Do nothing

      } else {
        const lss = LSS(expected, received)

        // console.log(expectedArray, receivedArray, lss)

        switch (lss.length) {
          case 0:
            // There is nothing in common in these strings.
          break
          case 1:
            // There may be more matching letters, but flipped
            lookForSwaps(expectedArray, receivedArray, lss)
          break


          default:
            splitStrings(expectedArray, receivedArray, lss)
        }
      }
    }

    expectedOutput = flatten(expectedOutput)
    receivedOutput = flatten(receivedOutput)

    // restoreCase(expectedOutput, this.expected)
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

    cloze.correct = input.length === this.expected.length
                 && cloze.length === 1

    this.setState({ cloze })
  }


  getSize(span){
    console.log("Getting size")
    if (!this.state.getSize) {
      console.log("this never happens")
      return
    }

    this.span = span
    this.setSize(span)
  }


  setSize(span=this.span) {
    // span.style.display = "inline"
    const width   = span.getBoundingClientRect().width + 1
    // span.style.display = "inline-block"
    // span.style.width = width + "px"
    const getSize = false
    const cloze   = " "
    this.setState({ width, getSize, cloze })
    console.log("width:", width)
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
          size={this.getSize}
          change={this.updateInput}
        />
      </div>
    )
  }
}


export default App;
