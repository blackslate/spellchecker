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
    <Input
      width={props.phrase.width}
      start={props.phrase.start}
      cloze={props.phrase.cloze}
      end={props.phrase.end}
      value={props.phrase.input}
      change={props.change}
      keyDown={props.keyDown}
    />
    <FeedBack
      start={props.phrase.start}
      cloze={props.phrase.cloze}
      end={props.phrase.end}
      width={props.phrase.width}
      text={props.phrase.cloze}
    />
    <WidthHolder
      textToCheck={props.phrase.textToCheck}
      size={props.size}
    />
  </StyledDiv>
)



export class Input extends Component {
  render() {
    const error = Array.isArray(this.props.cloze)
                ? this.props.cloze.length !== 1
                : false
    const correct = Array.isArray(this.props.cloze)
                 && this.props.cloze.correct

    if (!this.props.width) {
      return ""
    }

    return (
      <StyledPhrase
        id="back"
      >
        <span>{this.props.start}</span>
        <StyledInput
          className="input"
          error={error}
          correct={correct}
          value={this.props.value}
          width={this.props.width}
          onChange={this.props.change}
          onKeyDown={this.props.keyDown}
        />
        <span>{this.props.end}</span>
      </StyledPhrase>
    )
  }
}



export class FeedBack extends Component {
  render() {
    const { start, text, end, width } = this.props

    return (
      <StyledPhrase
        id="front"
        opacity="1"
        width={width}
      >
        <span>{start}</span>
        <StyledFeedback
          className="cloze"
        >
          {text}
        </StyledFeedback>
        <span>{end}</span>
      </StyledPhrase>
    )
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



class WidthHolder extends Component {
  render() {
    const { size, textToCheck } = this.props
    // console.log(("expected:", expected))

    return (
      <StyledFeedback
        className="width-holder"
        ref={size}
        hidden={true}
      >
        {textToCheck}
      </StyledFeedback>
    )
  }


  componentDidUpdate() {
    this.props.size()
  }
}