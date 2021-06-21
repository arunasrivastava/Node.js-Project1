var express = require('express');
var router = express.Router();

let animalArrayS = [];

//define a constructor to create animal objects
let animalObj = function(name, color,group, fluffiness) {
  this.name = name;
  this.color = color;
  this.group = group; 
  this.fluffiness = fluffiness;
};

animalArrayS.push(new animalObj("Capybara", "brown", "mammal", "2"));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile("index.html");
});

/* GET all animals data */
router.get('/getAllAnimals',function(req,res) {
  res.status(200).json(animalArrayS);
});

/* Add one new note */
router.post('/AddAnimals', function(req, res){
 // const newAnimal = req.body;
  animalArrayS.push(req.body);
  res.status(200).json("success");
});

router.delete('DeleteAnimal/:title', (req,res)  => {
  const title = req.params.title;
  let found = false;
  console.log(title);

  for(var i = 0; i < animalArrayS.length; i++) // find the match
{
  if(animalArrayS[i].title === title) {
    animalArrayS.splice(i, 1); // remove objext from array
    found = true;
    break;
  }
}
if(!found) {
  console.log("not found");
  return res.status(500).json({
    status: "error"
  });
} else {
    res.status(200).json(title + 'deleted!');
  }
  });

  module.exports = router;