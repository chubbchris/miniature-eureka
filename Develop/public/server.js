const express = require('express');
const PORT = process.env.PORT || 3002;
const {notes} = require('./db/db.json');
const app = express();
const fs = require('fs');
const path = require('path');

app.use(express.urlencoded({extended:true}));

app.use(express.json());

app.use(express.static('pubilc'));


app.get('/api/notes', (req,res)=>{
  let results = notes
  if (req.query){
    results= filterByQuery(req.query,results);
  }
  res.json(results);
});
app.get('/api/notes/:title', (req,res)=>{
  const result = findByTitle(req.params.title,notes)
  res.json(result);
});

app.post('/api/notes',(req,res)=>{
  console.log(req.body);
  const note = createNewNote(req.body,notes);
  res.json(notes);
});

app.get('/',(req,res)=>{
  res.sendFile(path.join(__dirname,'./public/index.html'));
});

app.get('/notes',(req,res)=>{
  res.sendFile(path.join(__dirname,'./public/notes.html'))
})

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
  });
  function createNewNote(body, notesArray){
    const note = body;
  
    notesArray.push(note);
    fs.writeFileSync(
      path.join(__dirname,'./db/db.json'),
      JSON.stringify({notes},null,2)
    );
  
    return note;
  };
  
  
  function findByTitle (title,notesArray) {
    const result = notesArray.filter(note => note.title === title)[0];
    return result;
  }
  
  function filterByQuery(query,notesArray){
    let filteredResults = notesArray;
    if(query.title){
      filteredResults = filteredResults.filter(note => note.title===query.title)
    }
    if(query.text){
      filteredResults = filteredResults.filter(note => note.text===query.text)
    }
    return filteredResults;
  
  }