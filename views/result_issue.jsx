import React from 'React'
import InlineMessage from '@atlaskit/inline-message'
import Lozenge from '@atlaskit/lozenge';



export default function result_issue ({key_, status, issuetype, priority, summary, creator, issuetypeicon, creatoravatar, assignee, assigneeavatar}) {

let link_ = `https://denyskuznietsov.atlassian.net/browse/${key_}`
let link_avatar = creatoravatar["16x16"]

return <>

<InlineMessage type="info" secondaryText={key_}>
      <p>
        <strong>Important information about {key_} issue: </strong>
      </p>
      <hr/>
      <p>
        Issue type: {issuetype} <img src={issuetypeicon} width="16" height="16"/> 
      </p>
      <p>
        Priority: {priority}
      </p>
      <p>
        Status: {status}
      </p>
      <p>
        Summary: {summary}
      </p>
      <p>
        Creator: {creator} <img src={link_avatar} width="16" height="16"/>
      </p>
      <p>
        Assignee: {assignee} <img src={assigneeavatar['16x16']} width="16" height="16"/>
      </p>
      <hr/>
      <p>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a href={link_}>Click here</a> to get more information about this issue...
      </p>   
    </InlineMessage>
    {status==='Done' 
        ?<Lozenge appearance="success">{status}</Lozenge>
        :<Lozenge appearance="inprogress">{status}</Lozenge>
    }


</>



}




