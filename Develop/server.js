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
app.delete('/api/notes/:id', (req,res)=>{
  const result = findById(req.params.id,notes)
  res.json(result);
});

app.post('/api/notes',(req,res)=>{

  req.body.id=notes.length.toString();

    if(!validateNote(req.body)){
        res.status(400).send('the title is already taken');
    }else{
  const note = createNewNote(req.body,notes);
  res.json(note);
    }
});

app.get('/',(req,res)=>{
  res.sendFile(path.join(__dirname,'./public/index.html'));
});

app.get('/notes',(req,res)=>{
  res.sendFile(path.join(__dirname,'./public/notes.html'))
})
app.get('/assets/css/styles.css',(req,res)=>{
    res.sendFile(path.join(__dirname,'./public/assets/css/styles.css'))
});
app.get('/assets/js/index.js',(req,res)=>{
        res.sendFile(path.join(__dirname,'./public/assets/js/index.js'))
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
  });

  
  function validateNote(note){
      if(!note.title||typeof note.title !=='string'){
          return false;
      }else{
          return true;
      }
  }
  function createNewNote(body, notesArray){
    const note = body;
  
    notesArray.push(note);

    fs.writeFileSync(
      path.join(__dirname,'./db/db.json'),
      JSON.stringify({notes},null,2)
    );
  
    return note;
  };
  
  
  function findById (id,notesArray) {
    const result = notesArray.filter(note => note.id === id)[0];
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