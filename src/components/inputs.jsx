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

    const { start
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
    return (
      <StyledFeedback
        className="cloze"
        ref={this.props.size}
      >
        {this.props.cloze}
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
  <StyledCut>
    {props.children}
  </StyledCut>
)



export const Fix = (props) => (
  <StyledFix>
    {props.children}
  </StyledFix>
)



export const Flip = (props) =>  (
  <StyledFlip>
    {props.children}
  </StyledFlip>
)