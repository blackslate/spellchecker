/**
 * /src/components/inputs.jsx
 */


import React, { Component } from 'react';
import { StyledDiv
       , StyledTextArea
       , StyledPhrase
       , StyledFeedback
       , StyledInput
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


export const Answer = (props) => (
   <StyledDiv>
    <FeedBack
      start={props.phrase.start}
      cloze={props.phrase.cloze}
      end={props.phrase.end}
      width={props.phrase.width}
      size={props.size}
    />
    <Input
      width={props.phrase.width}
      start={props.phrase.start}
      end={props.phrase.end}
      change={props.change}
    />
  </StyledDiv>
)



export class FeedBack extends Component {

  render() {
    const error = Array.isArray(this.props.cloze)
                ? this.props.cloze.length !== 1
                : false
    const correct = Array.isArray(this.props.cloze)
                 && this.props.cloze.correct
    let { start, cloze, end, size, width } = this.props
    // cloze = width ? " " : cloze
    return (
      <StyledPhrase
        id="back"
        opacity="1"
        width={width}
      >

        <span>{start}</span>
        <StyledFeedback
          className="cloze"
          ref={size}
          error={error}
          correct={correct}
        >
          {cloze}
        </StyledFeedback>
        <span>{end}</span>
      </StyledPhrase>
    )
  }
}


export class Input extends Component {
  render() {
    if (!this.props.width) {
      return ""
    }

    return (
      <StyledPhrase

        id="front"
        opacity="0.25"
      >
        <span>{this.props.start}</span>
        <StyledInput
          className="cloze"

          width={this.props.width}
          onChange={this.props.change}
        />
        <span>{this.props.end}</span>
      </StyledPhrase>
    )
  }
}



export const Add = () => {
  return (
    <StyledAdd />
  )
}



export const Cut = (props) => {
  return (
    <StyledCut>
      {props.children}
    </StyledCut>
  )
}



export const Fix = (props) => {
  return (
    <StyledFix>
      {props.children}
    </StyledFix>
  )
}



export const Flip = (props) => {
  return (
    <StyledFlip>
      {props.children}
    </StyledFlip>
  )
}