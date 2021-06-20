let animalArray = [];

document.addEventListener("DOMContentLoaded", function (event) {
    document.getElementById("addAnimal").addEventListener("click", addToArray);
    function addToArray(){
        var animal = new animalObj (document.getElementById("name").value,document.getElementById("color").value,document.getElementById("select-group").value, document.getElementById("select-fluffiness").value);
        if (animal.isValid()){
        animalArray.push(animal);
        document.getElementById("name").value = "";
        document.getElementById("color").value = ""; 
        document.getElementById("select-group").value = "";
        document.getElementById("select-fluffiness").value = ""; 
        }
        else {
            alert("please enter valid fields" ); 
        }
        $(document).on("pagebeforeshow", "#details", function (event) {   
            let localID = document.getElementById("IDparmHere").innerHTML;
            let arrayPointer = GetArrayPointer(localID);
            document.getElementById("oneName").innerHTML = "The Animal: " + animalArray[arrayPointer].name;
            document.getElementById("oneColor").innerHTML = "Animal Color: " + animalArray[arrayPointer].color;
            document.getElementById("oneGroup").innerHTML = "Animal Group: " + animalArray[arrayPointer].group;
            document.getElementById("oneFluffiness").innerHTML = "Fluffiness Rating: " + animalArray[arrayPointer].fluffiness;
        });   
    }
    $(document).bind("change", "#select-group", function (event, ui) {
        selectedGroup = $('#select-group').val();
    });
    //button to sort alphabetically on 'list animals'
    document.getElementById("buttonSortName").addEventListener("click", function() {
        animalArray.sort(dynamicSort("name"));
        printAnimalList();
        document.location.href = "index.html#ListAll";
    });
    //buttons to sort the list on 'list by group'
    document.getElementById("buttonSubsetReptiles").addEventListener("click", function () {
        printAnimalList();
        printAnimalListSubset("Reptile");  // recreate li list after removing one
    });
    document.getElementById("buttonSubsetMammals").addEventListener("click", function () {
        printAnimalListSubset("Mammal");  // recreate li list after removing one 
    });
    document.getElementById("buttonSubsetBirds").addEventListener("click", function () {
        printAnimalListSubset("Bird");  // recreate li list after removing one
    });
    document.getElementById("buttonSubsetFish").addEventListener("click", function () {
       
        printAnimalListSubset("Fish");  // recreate li list after removing one  // go back to movie list 
    });
    document.getElementById("buttonSubsetAmphibians").addEventListener("click", function () {
       printAnimalListSubset("Amphibian");  // recreate li list after removing one 
    });
     document.getElementById("buttonSubsetInsects").addEventListener("click", function () {
        printAnimalListSubset("Insect");  // recreate li list after removing one // go back to movie list 
    });

    $(document).on("pagebeforeshow", "#ListAll", function(event) {
        printAnimalList();
    });
    document.getElementById("buttonStats").addEventListener("click", function () {
        document.getElementById("calculateStats").innerHTML = calculateStats();
     });

     document.getElementById("delete").addEventListener("click", function () {
        deleteAnimal(document.getElementById("IDparmHere").innerHTML);
        printAnimalList();  // recreate li list after removing one
        document.location.href = "index.html#ListAll";  // go back to movie list 
    });

    $(document).on("pagebeforeshow", "#page4", function (event) {   
        var divAnimalList = document.getElementById("divAnimalListSubset");
        while (divAnimalList.firstChild) {    
            divAnimalList.removeChild(divAnimalList.firstChild);
        };
    });
    //User can click active li and access the details of animal on both pages 
   
//This animal object takes in given characteristics from user, verifies it, and creates a string 
function animalObj(name, color,group, fluffiness) {
    this.name = name;
    this.color = color;
    this.group = group; 
    this.fluffiness = fluffiness;
    this.isValid = function () {
      if ((this.name != "") && (this.color != "") && (this.group != null) && (this.fluffiness >=1)){
        return true
      }
      else{ 
        return false;
      }
    };
    
    this.getAll = function() {
      return name + " " + color + " " + group + " fluffiness: " + fluffiness;
    };
}
 //This function will print the data on the 'list animals' tab by traversing the array of objects and printing them as a string 
 function printAnimalList() {
    var divAnimalList = document.getElementById("divAnimalList");
    while (divAnimalList.firstChild) {    
        divAnimalList.removeChild(divAnimalList.firstChild);
    };

    function UpdateDisplay () {
        $.get("/getAllNotes", function(data, status) { //AJAX get
      animalArray = data; // put the returned server json data into our local array
        });
      }

    var ul = document.createElement('ul');

    animalArray.forEach(function (element,) {   
        var li = document.createElement('li');
        li.classList.add('oneAnimal'); 
        li.setAttribute("data-parm", element.name);
        li.innerHTML = element.getAll();
        ul.appendChild(li);
    });
    divAnimalList.appendChild(ul)
 
    var liArray = document.getElementsByClassName("oneAnimal");
    Array.from(liArray).forEach(function (element) {
        element.addEventListener('click', function () {
        var parm = this.getAttribute("data-parm"); 
        document.getElementById("IDparmHere").innerHTML = parm;
        document.location.href = "index.html#details";
        });
    });
};    
});

 
/**
 *  https://ourcodeworld.com/articles/read/764/how-to-sort-alphabetically-an-array-of-objects-by-key-in-javascript
* Function to sort alphabetically an array of objects by some specific key.
* 
* @param {String} property Key of the object to sort.
*/
function dynamicSort(property) {
    var sortOrder = 1;

    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }

    return function (a, b) {
        if (sortOrder == -1) {
            return b[property].localeCompare(a[property]);
        } else {
            return a[property].localeCompare(b[property]);
        }
    }
}
//This will find the location in the array of a given name 
function GetArrayPointer(localID) {
    for (let i = 0; i < animalArray.length; i++) {
        if (localID === animalArray[i].name) {
            return i;
        }
    }
}
function calculateStats(){
    let totalFluff = 0;
    for(let i = 0; i <animalArray.length; i++){
        totalFluff += animalArray[i].fluffiness/animalArray.length;
    }
    return "The average fluffiness of your animals: " + (totalFluff) + " out of " + animalArray.length + " animals";
}
//This function will print animals of a given characteristic under the 'list by group' tab
function printAnimalListSubset(whichType) {
  
  let divAnimalList = document.getElementById("divAnimalListSubset");
  while (divAnimalList.firstChild) {
    divAnimalList.removeChild(divAnimalList.firstChild);
  };
    
    let ul = document.createElement('ul');
    animalArray.forEach(function (element) {
        if (element.group === whichType) {
            let li = document.createElement('li');
            li.classList.add('oneAnimal');
            li.setAttribute("data-parm", element.name);
            li.innerHTML = element.name + "  " + element.group;
            ul.appendChild(li);
        }
    });
    divAnimalList.appendChild(ul)
    var liArray = document.getElementsByClassName("oneAnimal");
    Array.from(liArray).forEach(function (element) {
        element.addEventListener('click', function () {
            var parm = this.getAttribute("data-parm"); 
            document.getElementById("IDparmHere").innerHTML = parm;
            document.location.href = "index.html#details";
        });
    });


};

res.render('index', { title: 'Express' });

var router = express.Router();

router.get('/', function (req,res, next) {
    res.sendFile('index.html');
});


  /* get ALL movies data */
  router.get('/getAllAnimals', function(req,res) {
    res.status(200).json(serverNotes);
  });

  module.exports = router;

//------------------------delete button-------------//

function deleteAnimal(which) {
    console.log(which);
    let arrayPointer = GetArrayPointer(which);
    animalArray.splice(arrayPointer, 1);  // remove 1 element at index 
}

