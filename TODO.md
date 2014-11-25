
## Improvements  

**Intelligence**  
Auto-detect keywords separator  
Merge singular and plural of keywords  
Auto filter punctuation  

**Storage**  
Put mongo in RAM for better write performances  
Avoid duplicating data in collections  
Bound documents growth (implications on find requests)  
  
**Network**  
End connections arbitrarily if messages too long  
  
**Interface**  
Merge two services (post and get) in a single server  
Identify senders before accepting messages  
