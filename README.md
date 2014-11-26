solution-keywords
=================

Tool for processing a flow of messages containing keywords and providing a basic monitoring backoffice  
  
A first API (post_api.js) is in charge of receiving the messages, and a second API (get_api.js) provides a basic monitoring backoffice.  
  
  
## Receiving API 
This HTTP POST service is hosted on port 8080 and has a unique method : **message**. The keywords must be sent in a field **keywords** in the query data.  
  
    curl --data "keywords=cinema travels gastronomy" http://0.0.0.0:8080/message  
  
  
## Monitoring API
This HTTP GET service has three methods : **topkwds, topips, ipsforkwd**  
  
1. *topkwds*  
Returns top 10 keywords extracted from messages  
   
2. *topips*  
Returns list of top 10 IPs which have sent messages with related top 10 keywords  
  
3. *ipsforkwd*  
Returns list of IPs ordered by descending usage for a given keyword. The keyword must be queried via a field **kwd**  
  
