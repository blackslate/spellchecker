/**
 * /src/components/inputs.jsx
 */



import React, { Component } from 'react';
import { StyledDiv
       , StyledTextArea
       , StyledPhrase
       , StyledInputDiv
       , StyledInput
       , StyledFeedback
       , StyledAdd
       , StyledCut
       , StyledFix
       , StyledFlip
       } from './styles'


/// <<< HARD-CODED
const maxExtraChars = 2
/// HARD-CODED >>>


export const TargetPhrase = (props) => (
  <StyledDiv>
    <h2>Target Phrase:</h2>
    <StyledTextArea
      placeholder="Enter a target phrase to test"
      onChange={props.newPhrase}
      value={props.phrase}
    />
  </StyledDiv>
)



export class Answer extends Component {
  render() {
   if (!this.props.phrase.cloze) {
      return ""
    }

    const { expected
          , start
          , cloze
          , end
          , input
          , minWidth
          , width
          , error
          , correct
          } = this.props.phrase
    const { size
          , change
          , keyDown
          } = this.props
    const maxLength = expected.length + maxExtraChars

    return (
      <StyledPhrase
        id="answer"
      >
        <span>{start}</span>

        <StyledInputDiv
          id="input"
          minWidth={minWidth}
          width={width}
        >
          <StyledInput
            className="input"
            error={error}
            correct={correct}
            maxLength={maxLength}
            value={input}
            onChange={change}
            onKeyDown={keyDown}
          />

          <Feedback
            size={size}
            cloze={cloze}
          />

        </StyledInputDiv>

        <span>{end}</span>
      </StyledPhrase>
    )
  }
}


class Feedback extends Component{
  render() {
    const { size, has_space, cloze } = this.props
    // console.log(size, has_space, cloze)
    return (
      <StyledFeedback
        className="cloze"
        ref={size}
      >
        {cloze}
      </StyledFeedback>
    )
  }


  componentDidUpdate() {
    this.props.size()
  }

}



export const Add = () => (
  <StyledAdd />
)



export const Cut = (props) => (
  <StyledCut
    has_space={props.has_space}
  >
    {props.children}
  </StyledCut>
)



export const Fix = (props) => (
  <StyledFix
    has_space={props.has_space}
  >
    {props.children}
  </StyledFix>
)



export const Flip = (props) =>  (
  <StyledFlip
    has_space={props.has_space}
  >
    {props.children}
  </StyledFlip>
)