
import styled from 'styled-components'

const fontSize = "7vmin"
const fontFamily = "'DejaVu serif', Cambria, serif"

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


export const StyledPhrase = styled.p`
  position: absolute;
  top: 0;
  left: 0;
  font-size: ${fontSize};
  font-family: ${fontFamily};

  & span {
    opacity: ${props => props.opacity};
  }

  & span.cloze {
    ${props => props.width
             ?  `width: ${props.width}px;
                `
             : ""}
  }
`


export const StyledInput = styled.input.attrs(props => ({
  type: "text"
}))`
  font-size: ${fontSize};
  font-family: ${fontFamily};
  width: ${props => props.width}px;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  opacity: 0.2;
`


export const StyledFeedback = styled.span`
  display: inline-block;
  background-color: ${props => props.error
                             ? "#fee"
                             : props.correct
                               ? "#dfd"
                               : "#ddf"
                     };
`


export const StyledAdd = styled.span`
  display:inline-block;
  height:0.7em;
  box-shadow:0px 0 0 1px #f00;
  position:relative;

  &:after {
    content:"^";
    position:absolute;
    top:92%;
    left:50%;
    transform:translate(-50%);
    color:#f00;
    font-size:0.25em;
  }
`


export const StyledCut = styled.span`
  color: #f00;
`


export const StyledFix = styled.span`
  color: #f09;
`


export const StyledFlip = styled.span`
  color: #f60;
`