
## Potential improvements  

**Intelligence**  
Auto-detect keywords separator  
Merge singular/plural/similars of keywords (Levenshtein) 
Auto-filter punctuation  

**Storage**   
Stores more efficiently (replace lists with duplicates by objects)  
Avoid duplicating data in two collections  
Bound documents growth (implications on find requests)  
  
**Network**  
End connections arbitrarily if messages too long  
  
**Interface**  
Merge two services (post and get) in a single server on port 80  
Identify senders before accepting messages  
