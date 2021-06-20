var express = require('express');
var router = express.Router();
// our constructor
function Note (ptitle, pDetail, pPriority) {
  this.title = ptitle;
  this.detail = pDetail;
  this.priority = pPriority;

}

/* Add one new note */
router.post('/AddNote', function(req, res)
{const newNote = req.body;ServerNotes.push(newNote);res.status(200);});

res.render('index', { title: 'Express' });

let ServerNotes = [];


ServerNotes.push(new Note("Eat Lunch", "Make a pizza", 2));
ServerNotes.push(new Note("Homework", "Get prog209 hw done early", 1));
ServerNotes.push(new Note("play vid game", "kill thousands of zombies", 3));
console.log(ServerNotes)

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile("index.html");
});

module.exports = router;

/*GET all Notes data */
router.get('/getAllNotes', function(req, res) {
  res.status(200).json(ServerNotes);
}); 

/* add one new note */
router.post('AddNote', function(req,res) {
  const NewNote = req.body;
  ServerNotes.push(newNote);
  res.status(200);
});

let newNote = new Note ((document.getElementById)("title").value, document.getElementById("detail").value, document.getElementById("priority").value );
$.ajax({
  url : "/AddNote",
  type: "POST",
  data: JSON.stringify(newNote),
  contentType: "application/json; charset=utf-8",
  dataType: "json",
  success: function (result) {
    console.log(result);
  }
});

let which = document.getElementById("deleteItem").value;
$.ajax({
  type: "DELETE",
  url: "/DeleteNote/" +which, 
  success: function(result) {
    console.log(result);
  },
  error: function(xhr, textStatus, errorThrown) {
    console.log('Error in Operation');
    alert("Server could not delete Note with title " + which)
  }
})

router.delete('DeleteNote/:title', (req,res)  => {
  const title = req.params.title;
  let found = false;
  console.log(title);

  for(var i = 0; i < ServerNotes.length; i++) // find the match
{
  if(ServerNotes[i].title === title) {
    ServerNotes.splice(i, 1); // remove objext from array
    found = true;
    break;
  }
}

if(!found) {
  console.log("not found");
  return res.status(500).json({
    status: "error"
  ]);
}else {
    res.send("Note" + title + 'deleted!');
  }
  });

  //---------------
  app.put('/updatenote/:id', (req, res) => {const subject = req.params.id;const note = req.body;const 
  newPriority = note.Priority;const 
  newDescription = note.Descriptionconst 
  newSubject = note.Subject
  ;//const details = { '_id': new ObjectID(who_id) }; 
   // not going to try and update by _id// wierd bson datatype add complications
   // if uddating more than one field://db.collection('UserCollection').updateOne({ username: who_id }, { $set: { "email": newEmail, "title": newTitle } }, (err, result) => {// updating priority and/or description, not subjectdb.collection('Notes').updateOne({ Subject: subject }, { $set: { "Priority": newPriority, "Subject": newSubject, "Description": newDescription} }, (err, result) => {if (err) {res.send({ 'error': 'An error has occurred' });} else {res.send(note);}});});