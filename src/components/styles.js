
import styled from 'styled-components'

const fontSize = "7vmin"
const fontFamily = "'DejaVu serif', Cambria, serif"
const colors = {
  normal:  "#ddf"
, error:   "#fee"
, correct: "#dfd"
, normalHighlight:  "#ccf"
, errorHighlight:   "#fcc"
, correctHighlight: "#9c9"
, add:     "#f00"
, cut:     "#f00"
, fix:     "#f09"
, flip:    "#f60"
}

export const StyledDiv = styled.div`
  position: relative;
  background-color: #fee;
  text-align: left;
`


export const StyledTextArea = styled.textarea`
  font-size: ${fontSize};
  width: 100vw;
  box-sizing: border-box;
`


export const StyledPhrase = styled.div`
  font-size: ${fontSize};
  font-family: ${fontFamily};
  text-align: left;
`


export const StyledInputDiv = styled.div`
  display: inline-block;
  position: relative;
  vertical-align: top;
  min-width: ${props => props.minWidth}px;
  width: ${props => props.width}px;
`


// The text input element will expand to fill its parent div, which
// will in turn expand to fit the width of the expected span (at a
// minimum), or the Feedback span (whichever is greater).
export const StyledInput = styled.input.attrs(props => ({
  type: "text"
}))`
  font-size: ${fontSize};
  font-family: ${fontFamily};
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  margin: 0;
  padding: 0;
  border: none;
  background-color: ${props => props.error
                             ? colors.error
                             : props.correct
                               ? colors.correct
                               : colors.normal
                     };
  &::selection {
    background-color: ${props => props.error
                               ? colors.errorHighlight
                               : props.correct
                                 ? colors.correctHighlight
                                 : colors.normalHighlight
                       };
  }
`


// The feedback span will show the same text as the input element,
// but divided into different spans according to the error type
// of a particular group of letters.
export const StyledFeedback = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  display: inline-block;
  white-space: pre;

  /* Let input element behind show its cursor and receive mouse and
   * touch events
   */
  background: transparent;
  pointer-events: none;
`


// A zero-width span with no text, to show where one or more letters
// are missing. It appears as: |
//                             ^
export const StyledAdd = styled.span`
  display:inline-block;
  height:0.7em;
  box-shadow:0px 0 0 2px ${colors.add};
  position:relative;

  &:after {
    content: "^";
    position: absolute;
    top: 92%;
    left: 50%;
    transform: translate(-50%);
    color: ${colors.add};
    font-size: 0.25em;
  }
`

// Cut, Fix and Flip show respectively groups of letters which are
// not needed, not the right characters, or a pair of characters in
// the wrong order.
export const StyledCut = styled.span`
  display:inline-block;
  color: ${colors.cut};
`


export const StyledFix = styled.span`
  display:inline-block;
  color: ${colors.fix};
`


export const StyledFlip = styled.span`
  display:inline-block;
  color: ${colors.flip};
`