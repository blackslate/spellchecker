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
       , StyledToggle
       , StyledSubmit
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
    <Toggle 
      setMode={props.setMode}
      checked={props.checked}
    />
    <Submit   
      submit={props.submit}
      checked={props.checked}
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
          , requireSubmit
          } = this.props.phrase
    const { size
          , change
          , inputRef
          } = this.props
    const maxLength = expected.length + maxExtraChars

    console.log("inputRef:", inputRef)

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
            requireSubmit={requireSubmit}
            maxLength={maxLength}
            value={input}
            onChange={change}
            spellCheck={false}
            ref={inputRef}
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


export const Toggle = props => (
  <StyledToggle>
    Require Submit
    <input type="checkbox"
      onChange={props.setMode}
      checked={props.checked}
    />
  </StyledToggle>
)


export const Submit = props => (
  <StyledSubmit
    onMouseDown={props.submit}
    visible={props.checked}
  >
    Submit
  </StyledSubmit>
)