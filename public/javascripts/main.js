let animalArray = [];


document.addEventListener("DOMContentLoaded", function () {

//This animal object takes in given characteristics from user, verifies it, and creates a string 
let animalObj = function animalObj(name, color,group, fluffiness) {
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

    document.getElementById("addAnimal").addEventListener("click", addToArray);

    function addToArray(){
        var animal = new animalObj (document.getElementById("name").value,document.getElementById("color").value,document.getElementById("select-group").value, document.getElementById("select-fluffiness").value);
        if (animal.isValid()){
        animalArray.push(animal);
        document.getElementById("name").value = "";
        document.getElementById("color").value = ""; 
        document.getElementById("select-group").value = "";
        document.getElementById("select-fluffiness").value = ""; 

        $.ajax({
            url : "/AddAnimals",
            type: "POST",
            data: JSON.stringify(animalObj),
            contentType: "application/json; charset=utf-8",
            dataType : "json",
            success: function (result){
                console.log("back from server");
               document.location.href = "index.html#ListAll";
            }
        });

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
      //  deleteAnimal(document.getElementById("IDparmHere").innerHTML);
        printAnimalList();  // recreate li list after removing one

     let which = localStorage.getItem('name');

     $.ajax({
         type: "DELETE",
         url: "/DeleteAnimal/" + which,
         success: function(result) {
             console.log(result);
             document.location.href = "index.html#ListAll";
             },
             error: function (xhr, textStatus, errorThrown){
                 console.log('error in operation');
                 alert("server could not delete note with name " + which)
             }
         });
     });

        document.location.href = "index.html#ListAll";  // go back to movie list 
    });

    $(document).on("pagebeforeshow", "#page4", function (event) {   
        var divAnimalList = document.getElementById("divAnimalListSubset");
        while (divAnimalList.firstChild) {    
            divAnimalList.removeChild(divAnimalList.firstChild);
        };
    });
    //User can click active li and access the details of animal on both pages 
   
 //This function will print the data on the 'list animals' tab by traversing the array of objects and printing them as a string 
//This function will print the data on the 'list animals' tab by traversing the array of objects and printing them as a string
function printAnimalList() {
    var divAnimalList = document.getElementById("divAnimalList");
    while (divAnimalList.firstChild) {
    divAnimalList.removeChild(divAnimalList.firstChild);
    };
    
    
    var ul = document.createElement('ul');
    
    
    //function UpdateDisplay () { <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< you had this line which just doesn't go here
    // you don't want to define that, you want to do it.
    $.get("/getAllAnimals", function(data, status) { //AJAX get
    animalArray = data; // put the returned server json data into our local array
    console.log(data);
    
    
    animalArray.forEach(function (element,) {
    var li = document.createElement('li');
    li.classList.add('oneAnimal');
    li.setAttribute("data-parm", element.name, element.color);
    li.innerHTML = element.name;
    // I am guessing you had a function to add all the element names here. But I don't think that code is anywhere
    // by changing it to li.innerHTML = element.name; I could see that it was getting the data from the server, you just have to fix the formatting.
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
    });
    };


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

//------------------------delete button-------------//

function deleteAnimal(which) {
    console.log(which);
    let arrayPointer = GetArrayPointer(which);
    animalArray.splice(arrayPointer, 1);  // remove 1 element at index 
}

