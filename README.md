solution-keywords
=================

Tool for processing a flow of messages containing keywords and providing a basic monitoring backoffice  
  
A first API (post_api.js) is in charge of receiving the messages, and a second API (get_api.js) provides a basic monitoring backoffice.  
  
  
## Receiving API 
This HTTP POST service has a unique method : **message**. The keywords must be sent in a field **keywords** in the query data.  
  
    curl --data "keywords=cinema travels gastronomy" http://0.0.0.0:8080/message  
  
  
## Monitoring API
This HTTP GET service has three methods : **topkwds, topips, ipsforkwd**  
  
1. *topkwds*  
Returns top 10 keywords extracted from messages  
  
    curl http://0.0.0.0:8081/topkwds  
  
2. *topips*  
Returns list of top 10 IPs which have sent messages with related top 10 keywords  
  
    curl http://0.0.0.0:8081/topips  
  
3. *ipsforkwd*  
Returns list of IPs ordered by descending usage for a given keyword. The keyword must be queried via a field **kwd**  
  
    curl http://0.0.0.0:8081/ipsforkwd?kwd=cinema
