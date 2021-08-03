import React from 'React'
import fetch from 'node-fetch'
import Calendar from '@atlaskit/calendar';
import Page, { Grid, GridColumn } from '@atlaskit/page';

import Button from '@atlaskit/button/standard-button';

//import Drawer from '@atlaskit/drawer';

import Issues from './issues'
import Result_issue from './result_issue';



import { useState, useEffect } from 'react';

export default function header_info ({start_}) {
  
  const [name, setName] = useState([]);

  const [result, setResult] = useState ()



  const select = (event) =>{  //unfortunatelly only get, becouse with POST - 403 error

    let d = event.iso.split('-')
    d[2]=parseInt(d[2])+1
    d = d.join('-');
    console.log(d)  
  const link_= `https://denyskuznietsov.atlassian.net/rest/api/latest/search?jql=created%20%3E%3D%20${event.iso}%20AND%20created%20%3C%3D%20${d}%20order%20by%20created%20DESC`
    
    //------------------------fetching data ----------------------
    fetch(link_, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(
            'denys.kuznietsov@appsdelivered.com:kKpXF6A3oQdUATUENRoF46C1'//API JIRA Token
          ).toString('base64')}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
    },
     }) 
      .then(response => {
        console.log(
          `Response: ${response.status} ${response.statusText}`
        );
        return response.text();
      })
      .then(text => {
        
        let res = JSON.parse(text)
        let mas=[]

        res.issues.forEach(element => {
          if (element.fields.created.split('T')[0]==event.iso)
          {
             
             mas.push(<Result_issue 
              key_={element.key} 
              status={element.fields.status.name}
              issuetype={element.fields.issuetype.name}
              priority = {element.fields.priority.name}                  
              summary = {element.fields.summary}
              creator = {element.fields.creator.displayName}
              issuetypeicon = {element.fields.issuetype.iconUrl}
              creatoravatar = {element.fields.creator.avatarUrls}
              assignee = {element.fields.assignee.displayName}
              assigneeavatar = {element.fields.assignee.avatarUrls}
             />)
            mas.push(<br/>)
          }
        })
        
          setResult(mas)

     })
  .catch(err => console.error(err))
  //------------------------------------------------------------

    console.log(event.iso)
  }


//   //---------------------------Try post ---------------------------------
// const bodyData = `{
//             "expression": "{result: issues.reduce((result, issue) => result.set(issue.status.name, (result[issue.status.name] || 0) + 1), new Map())}",
//             "context": {
              
//               "project": {
//                 "key": "GAR"
//               }, 
              
//               "issues": {
//                 "jql": {
//                   "maxResults": 100,
//                   "query": "project =GARAJ AND assignee in (60f519d32b56cc00695559be)",
//                   "startAt": 0,
//                   "validation": "strict"
//                 }
//               }
//             }
//           }`;

//           fetch('https://denyskuznietsov.atlassian.net/rest/api/3/expression/eval', {
//             credentials: 'include',
//             method: 'POST',
//             headers: {
//               'Authorization': `Basic ${Buffer.from(
//                   'denys.kuznietsov@appsdelivered.com:kKpXF6A3oQdUATUENRoF46C1'//API JIRA Token
//                 ).toString('base64')}`,
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json',
//                 'Access-Control-Allow-Origin':'https://5351a5aa348a.ngrok.io',
//                 'Access-Control-Allow-Credentials':'omit',
//                 'Access-Control-Allow-Methods': "GET, POST, PUT, DELETE, OPTIONS"
//           },
//           body: bodyData
//           })
//             .then(response => {
//               console.log(
//                 `Response post: ${response.status} ${response.statusText}`
//               );
//               return response.text();
//             })
//             .then(text => {
//               totalassignee=JSON.parse(text);
      
          

//             }) 



//   //---------------------------------------------------------------------


  const [content, setContent] = useState(<Calendar onSelect={select}/>);

  const [selProject, setSelProject] = useState(' ')

  

  useEffect(()=>{  ////get all projects from JIRA cloud
  fetch('https://denyskuznietsov.atlassian.net/rest/api/3/project', { 
  method: 'GET',
  headers: {
    'Authorization': `Basic ${Buffer.from(
      'denys.kuznietsov@appsdelivered.com:kKpXF6A3oQdUATUENRoF46C1'//API JIRA Token
    ).toString('base64')}`,
    'Accept': 'application/json'    
}
})
.then(response => {
  console.log(  
    `Response: ${response.status} ${response.statusText}`
  );
  return response.text();
})
  .then(text => { 
      console.log(JSON.parse(text));
      
      let ar=[]
      JSON.parse(text).forEach(element => {
        ar.push(element.name)
      });
      setName([...name, ...ar])
      setIsLoaded(true)
      
    }) 
  
     
  .catch(err => console.error(err));
},[])


//let menu;



    
    return <>
<Grid testId="grid">
          <GridColumn medium={8}>
          {content}
          </GridColumn>
          <GridColumn medium={4}>
            <br/>
              <center><p >You have next projects:<br/>
              {
              name.map((entry,index) =><>
                 {entry===selProject
                 ?<Button appearance="primary" style={{marginTop:"5px", width:"50%", marginLeft:"30px"}} key={index}  id="open-drawer" onClick={() => {setSelProject(entry); setContent(<Issues project={entry} />)}}>
                    {entry}
                  </Button>
                  : <Button appearance="primary" style={{marginTop:"5px", width:"50%"}} key={index}  id="open-drawer" onClick={() => {setSelProject(entry); setContent(<Issues project={entry} />)}}>
                  {entry}
                 </Button>
                      }
                <br/></>
                )}     
              </p>
              </center>
          </GridColumn>
          <GridColumn>
            <div align="left">
          {selProject===' '? <p>{result}</p>:<p></p>}
          </div>
          </GridColumn>
        </Grid>
   
    

<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
    </>
} 