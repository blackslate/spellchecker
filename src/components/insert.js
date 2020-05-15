/**
 * /src/components/insert.jsx
 */


import React, { Component } from 'react';
import styled from 'styled-components'


const StyledSpan = styled.span`
  display:inline-block;
  height:0.7em;
  box-shadow:0px 0 0 1px red;
  position:relative;

  & ::after {
    content:"^";
    position:absolute;
    top:92%;
    left:50%;
    transform:translate(-50%);
    color:red;
    font-size:0.25em;
  }
`


class Insert extends Component {
  constructor(props) {
    super(props)

    this.method = this.method.bind(this)
  }


  method() {

  }


  render() {
    return (
      <StyledSpan />
    )
  }
}


export default Insert