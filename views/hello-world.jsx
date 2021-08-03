import SectionMessage from '@atlaskit/section-message';
import React from 'react';
import Header_info from './header_info'
import Banner from '@atlaskit/banner';


export default function HelloWorld() {

  return <>
  <center>
  <div style={{border: "1px solid black", borderRadius:"0 0 30px 30px", boxShadow: "10px 5px 5px grey", width:"60%"}}>
  <Banner appearance="announcement" isOpen> <center><h1 style={{color:"white"}}>Issue Calendar</h1></center>  </Banner>

  <Header_info/>
     
  </div>
  </center>
    </>
}
