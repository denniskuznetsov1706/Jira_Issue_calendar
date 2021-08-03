import React from 'React'
import fetch from 'node-fetch'
import Badge from '@atlaskit/badge'
import Calendar from '@atlaskit/calendar';
//import Button from '@atlaskit/button';
import { useState, useEffect } from 'react';
import { createDateParser, serializeStyles } from './header_info';
import { render } from 'react-dom';
//import Tooltip from '@atlaskit/tooltip';
import Select from '@atlaskit/select';
import Tooltip from '@atlaskit/tooltip';

import Toggle from '@atlaskit/toggle';


import Result_issue, { arrow, Element } from './result_issue';



export default function issues ({project, start_}) {

const [totalIssue, setTotalIssue] = useState(0)
const [selected, setSelected] = useState() 
const [prevSelected, setPrevSelected] = useState([])
const [selDat, setSelDat] = useState('')
const [json, setJson] = useState(false)
const [vis,setVis] = useState()
const [calendar, setCalendar] = useState(<></>)
const [totalFilter, setTotalFilter] = useState([])
const [persons, setPersons] = useState([])
const  [selectFilter,setSelectFilter] = useState()
const [statusIssue, setStatusIssue] = useState([])

const [assigneeFilter, setAssigneeFilter] = useState([])
const [defaultMounth, setDefaultMonth] = useState()
const [allAssigneeFilter, setAllAssigneeFilter] = useState(false)

    let issue;
    
    
   // let calendar;



    useEffect(()=>{
        fetch(`https://denyskuznietsov.atlassian.net/rest/api/3/search?jql=project=${project}`, { //get all projects from JIRA cloud
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
            issue = JSON.parse(text)
            setJson(issue)
            
            setTotalIssue(issue.total)    
            
             //created time of issue-----
             let created=[]
            let per = new Set();
            issue.issues.forEach(element => {
              //  created.push(`${element.fields.created.split('T')[0]}`)
               per.add(element.fields.assignee.displayName)
            });


            let ar = [...per];
            setPersons(ar)


       //---------------------------------------------------------
                        
          }) 
        .catch(err => console.error(err));
      },[project])


   //-------------------------------------Selecting date----------------------------

      

      const select = (event) =>{  //-------------------when selected date------------------
        
        let defMonth = parseInt(event.iso.split('-')[1])
        setDefaultMonth(defMonth)
//------------------------------------------ choose few dates or no ----------------
        let asf_=new Set(totalFilter)
        if (asf_.has('fewdates')) 
        {  
            let sel = [...prevSelected];
            sel.push(event.iso)
            let arr = selected.filter(item => item !==event.iso)
            setSelected(arr);
            setPrevSelected(sel)
        }
        else 
        {
            let sel = selected;
            sel.push(prevSelected) 
            console.log('sel----'+sel) 
           
            sel = sel.filter(item => item !==event.iso)
            setSelected(sel);
            setPrevSelected(`${event.iso}`)
      }

//--------------------------------------------------------------------




            var result =[]
            let totalIssues=0;
            let asf = new Set(assigneeFilter)
          
            json.issues.forEach(element => {
              let bodyResult = <Result_issue 
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
            />
           



          if (allAssigneeFilter || asf.has(element.fields.assignee.displayName))
          {
            //console.log('we are here')
            totalIssues++;
            switch(selectFilter)
            {
              case 'created':
                if (element.fields.created.split('T')[0]==event.iso)
                {
                  if (statusIssue.length==0)
                  {
                      result.push(bodyResult)
                      result.push(<br/>)
                  }
                  else{
                    statusIssue.forEach(item=>{
                      if (element.fields.status.name==item)
                      {
                        result.push(bodyResult)
                        result.push(<br/>)
                      }
                    })
                  }
                 //  console.log('updated was chosen')
                }
              break
              case 'updated':
                if (statusIssue.length==0)
                {
                    result.push(bodyResult)
                    result.push(<br/>)
                }
                else{
                  statusIssue.forEach(item=>{
                    if (element.fields.status.name==item)
                    {
                      result.push(bodyResult)
                      result.push(<br/>)
                    }
                  })
                }
              break
              case 'NCBNWO':
                if (element.fields.created.split('T')[0]==event.iso && element.fields.status.name=='Backlog')
                {
                   result.push(bodyResult)
                   result.push(<br/>)
                  // console.log('updated was chosen')
                }
                //  console.log('updated--->'+created)
               break
            }
          }


             });


            if (asf_.has('fewdates') ) 
            {  
                if (!prevSelected.includes(event.iso)) setSelDat([...selDat, result])
               // console.log('few dates info')
            }
            else setSelDat(result)      
              
          //  setFoundIssue(totalIssues)


            
      }

useEffect(()=>{

  console.log("status issue ---"+statusIssue+"---"+statusIssue.length)
},[statusIssue])
    
   

      useEffect(()=>{

          console.log("UseEffect")
        //  setCalendar(<></>)
      //    setVis('')

     // setPrevSelected('2021-08-04')

          setTimeout(function() {
            setCalendar(<></> )
            //render();
          }, 100);
          setTimeout(function() {
            setCalendar(<Calendar  defaultMonth= {defaultMounth} defaultSelected={selected} defaultPreviouslySelected={prevSelected} onSelect={select} /> )
           // render();
          }, 100);
console.log("selected - --"+selected)
console.log("Prevselected - "+prevSelected)

      },[selDat, selected, prevSelected])
  

      
return <> 

<center>
    
    <p>Project name: <Badge appearance="primary">{project}</Badge></p>
    <p>Total number of issues: <Badge appearance="primary">{totalIssue}</Badge></p>
    <p>Assignees for this project:<br/>
    <div style={{display:'flex'}}>
    {
              persons.map((entry,index) =><div style={{display:'flex'}}>
                        <Badge appearance="added" >{entry}
                        <Tooltip
                        content={new Set(assigneeFilter).has(entry) ? 'Disable filtering by this Assignee' : 'Enable filtering by this Assignee'}
                     // content='Filtering by this Assignee'
                        >
                        {allAssigneeFilter
                        ?<Toggle
                            id="toggle-tooltip"
                            onChange={()=>{
                                let asf=new Set(assigneeFilter)
                                if (asf.has(entry)) asf.delete(entry)
                                else asf.add(entry)
                                setAssigneeFilter(asf)
                                console.log(asf)
                                
                            }}
                            isChecked={allAssigneeFilter}
                            isDisabled
                        />
                        :<Toggle
                        id="toggle-tooltip"
                        onChange={()=>{
                            let asf=new Set(assigneeFilter)
                            if (asf.has(entry)) asf.delete(entry)
                            else asf.add(entry)
                            setAssigneeFilter(asf)
                            console.log(asf)
                        }}
                        
                    />
                        }
                        </Tooltip>
                        </Badge>
              </div>
              
              )
    }
    </div>
    </p>
    <div style={{display:'flex'}}>
    <Badge appearance="primary" >Choose a few dates
                        <Tooltip
                        content={new Set(totalFilter).has('fewdates') ? 'Disable filtering by a few dates' : 'Enable filtering by a few dates'}
                     // content='Filtering by this Assignee'
                        >
                        <Toggle
                            id="toggle-tooltip"
                            onChange={()=>{
                                let asf=new Set(totalFilter)
                                if (asf.has('fewdates')) asf.delete('fewdates')
                                else asf.add('fewdates')
                                setTotalFilter(asf)
                                //console.log(asf)
                            }}
                        />
                        </Tooltip>
                        </Badge>  
    <Badge appearance="primary" >All assignee
                        <Tooltip
                        content={allAssigneeFilter ? 'Disable filtering by all assignee' : 'Enable filtering by all assignee'}
                     // content='Filtering by this Assignee'
                        >
                        <Toggle
                            id="toggle-tooltip"
                            onChange={() => setAllAssigneeFilter((prev) => !prev)}
                        />
                        </Tooltip>
    </Badge>  
    <Badge appearance="primary" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Status of issue &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        
                        <Select
                                style={{backgroundColor: 'blue !important' }}
                                inputId="multi-select-example"
                                className="multi-select"
                                classNamePrefix="react-select"
                                options={[
                                  { label: 'Backlog', value: 'Backlog' },
                                  { label: 'Selected for Development', value: 'Selected for Development' },
                                  { label: 'In Progress', value: 'In Progress' },
                                  { label: 'Done', value: 'Done' }
                                 
                                ]}
                                isMulti
                                isSearchable={false}
                                placeholder="By default - ALL"

                                onChange={value=>{
                                      let mas=[]
                                      value.forEach(item=>mas.push(item.value))

                                      setStatusIssue(mas)
                                     // console.log(value)
                                     // console.log(statusIssue)
                                     // setStatusIssue(mas)


                                    //  setTimeout(()=>{console.log(statusIssue)},1000)
                                }}
                              />


                        
                        
    </Badge> 
   
   
   </div>

    <br/>
    <Select
      inputId="single-select-example"
      className="single-select"
      classNamePrefix="react-select"
      onChange={value =>{  
        setVis(`${value.value}`); console.log(vis);
      
       let created = [];
       let asf = new Set(assigneeFilter)
       
       switch(value.value)
       {
         case 'created':
           json.issues.forEach(element => 
             {
                 if (allAssigneeFilter || asf.has(element.fields.assignee.displayName))
                 {
                     if (statusIssue.length==0)
                        created.push(`${element.fields.created.split('T')[0]}`) 
                     else
                        statusIssue.forEach(item=>{
                            if (element.fields.status.name==item)
                                created.push(`${element.fields.created.split('T')[0]}`)})
                 }
             });
           //console.log('created--->'+created)
         break
         case 'updated':
          // setPersonFilter(<></>)
          json.issues.forEach(element => 
            {
              if (allAssigneeFilter || asf.has(element.fields.assignee.displayName))
              {
                  if (statusIssue.length==0)
                     created.push(`${element.fields.updated.split('T')[0]}`) 
                  else
                     statusIssue.forEach(item=>{
                         if (element.fields.status.name==item)
                             created.push(`${element.fields.updated.split('T')[0]}`)})
              }
            });
          //  console.log('updated--->'+created)
         break

         case 'NCBNWO':
          // setPersonFilter(<></>)
          json.issues.forEach(element => 
            {
                if ( (allAssigneeFilter || asf.has(element.fields.assignee.displayName)) && element.fields.status.name=='Backlog')
                    created.push(`${element.fields.updated.split('T')[0]}`) 
            });
          //  console.log('updated--->'+created)
         break
        
         default:
           //json.issues.forEach(element => {created.push(`${element.fields.created.split('T')[0]}`) });
           created=[]
         break
       }
      // setSelected([...created])  
        setSelDat([])
        setPrevSelected([])
         setSelected(created) 
         setSelectFilter(value.value);
       //  console.log('Select filter-->'+selectFilter)
         
        
      
      
      }}
      //onChange={value => setVis('created') }
      options={[
        { label: 'by CREATED dates', value: 'created' },
        { label: 'by UPDATED dates', value: 'updated' },
        { label: 'not closed but not worked on', value: 'NCBNWO' },
      ]}
      placeholder="Choose a filter"  
    />
    {/* <Badge appearance="primary">Was found {foundIssue} issues</Badge> */}
   {/* // {personFilter} */}
  
    <br/><br/>
    {calendar}

    <div align="left">{selDat}</div>
    
   

</center>







</>
  
   
}