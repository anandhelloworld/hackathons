// code for setting up body template 
var container = document.querySelector(`body`);
container.innerHTML = `
<div class="whole">  
<nav class="navbar navbar-light  ">
  <div class="container-fluid">
      <h1 class="d-flex navbar-brand col-lg-6 justify-content-end"> ICE AND FIRE BOOK LIST</h1>
      <form class="d-flex">
      <input class=" search me-2" onkeyup="myFunction()" id="mySearch" type="search" placeholder="Search" aria-label="Search">
      
       </form>
  </div>
</nav>
<div class="main container col-md-6 col-lg-6 d-flex flex-column"  id='data-displayer'>
</div>

`;

// function to get data of books:
async function getBooks() {
  try {
    const data = await fetch(
      `https://www.anapioficeandfire.com/api/books?page=1&pageSize=20`,
      {
        method: "GET",
        headers: {
          contentType: "application/json",
        },
      }
    );
    let books = await data.json();
    console.log(books);
    return books;
    let character = books[0].characters.slice(0, 7);
    console.log(character);
  } catch (error) {
    console.log(error);
  }
}
//function to get character Name from links of books character url details
async function getCharacterName(url) {
  try {
    const data = await fetch(url);
    const Name = await data.json();
    return Name.name;
  } catch (error) {
    console.log(error);
  }
}


//function to display the list of books data fetched from ice and fire book api

async function displayData() {
    try {
        let books = await getBooks();
  let number = books.length;

  // loop to tansverse through all books coming from book api and adding them to html dyanamically


  for (let i = 0; i < number; i++) {         
    let name = books[i].name;                //store the name of book from the book api 
    let author = books[i].authors;           //store the author details of the book from the book api
    let page = books[i].numberOfPages;      //store the number of pages of  the book api
    let isbn = books[i].isbn;              //store isbn information from book api
    let publisher = books[i].publisher;    //store publisher information from book api
    let character = books[i].characters;  // storing all the characters url of book characters
    let characterName = [];       //array to store the character name fetched from the character api using book's api characters url
    let countNAME = 0;
    let LinkCount = 0;           //to update the index of character array from line 63
    let NameCount = 0;          //to update the index of characterName array from line 64
  //code for getting  character name from filtered  character url which have name tag associated with it
  //as in this api not all characters url of books contain name value.And need to show the 
  //name of the  5 characters
    if (character.length > 0) {   //to check wheter character value is not empty
      while (countNAME < 7) {     //countNAME will give 7 named characters from character url of books api
        let temp;                 
        temp = await getCharacterName(character[LinkCount]);
        //check if the character details fetched from the ice and fire character api using the character url 
        //have name or not
        if (temp != "") {
          characterName[NameCount] = temp;
          LinkCount++;
          NameCount++;
          countNAME++;
        } else {        //if the character details fetched from the ice and fire character api using the
          LinkCount++;  // dont have name value then ignore the character and search next character with name value
        }
      }
    //case when the Book details fetched from the ice and fire book api have empty character url array
    } else {
      characterName =["not found","not found","not found","not found","not found","not found"]; // to store and display blank when character url is empty in book details
    }
    //code to add Accordion(bootstrap v5.2) element to show the data in collapsable element column formatted
    let newData = document.getElementById("data-displayer");
    newData.innerHTML += `
    <div class="accordion" id="accordionBook${i}" style="display:;">
    <div class="accordion-item">
         <h2 class="accordion-header" id="Book${i}">
             <button id="BookButton${i}" class="accordion-button collapsed"  type="button" data-bs-toggle="collapse" data-bs-target="#BookData${i}" aria-expanded="false" aria-controls="BookData${i}">
                ${name}
            </button>
        </h2>
        <div id="BookData${i}" class="accordion-collapse collapse " aria-labelledby="Book${i}" data-bs-parent="#accordionBook${i}">
            <div class="accordion-body">
             <ul>
               <li>Author Name:${author}</li>
               <li>ISBN:${isbn}</li>
               <li>No. Of Pages:${page}</li>
               <li>Publisher Name:${publisher} </li>
               <li>
                    <div class="accordion" id="accordionCharacter${i}">
                       <div class="accordion-item">
                           <h2 class="accordion-header" id="Character${i}">
                             <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#CharacterData${i}" aria-expanded="false" aria-controls="CharacterData${i}">
                             Character:
                              <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                              ${character.length}
                              <span class="visually-hidden">unread messages</span>
                            </span>
                             </button>
                          </h2>
                          <div id="CharacterData${i}" class="accordion-collapse collapse " aria-labelledby="Character${i}" data-bs-parent="#accordionCharacter${i}">
                          <div class="accordion-body">
                          <ul>
                            <li>${characterName[0]}</li>
                            <li>${characterName[1]}</li>
                            <li>${characterName[2]}</li>
                            <li>${characterName[3]}</li>
                            <li>${characterName[4]}</li>
                          <ul>
                          </div>
                       </div>
                   </div>
               </li>
             </ul> 
            </div>
        </div>
 </div>    
        
        `;
  }
    } catch (error) {
        console.log(error);
    }
}
displayData();



//function to search by book name or author name when typed in search box

async function myFunction() {
  let books = await getBooks();                            // fetching  books data from ice and fire api
  let names = [];                                          // storing all the names of all book fetched from ice and fire api
 
   //code to store all book name fetches from ice and fire book api in name array
  books.forEach((ele) => {      
    names.push(ele.name);
  });

  //code to get the input from search box and storing in filter variable
  let input = document.getElementById("mySearch");   
  let filter = input.value.toUpperCase(); 


  
  
  //code to search for availablilty of book name i.e if variable filter is substring of any element of name array
  names.forEach((el, i) => {
        if (el.toUpperCase().indexOf(filter) > -1&&filter!="") {
            let id = "BookButton" + i;
            let toShow = document.getElementById(id);    // getting the tag that matches from search box
            // and highlighting the background
            toShow.style.backgroundColor = "yellow";    
          } else {
            let id = "BookButton" + i;
            let toHide = document.getElementById(id);
            toHide.style.backgroundColor = "";
           
          } 
   
  });
}
