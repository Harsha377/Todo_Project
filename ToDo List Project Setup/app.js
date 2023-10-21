// ********** SELECT ITEMS **********
const form =document.querySelector(".todo-form");
const alert=document.querySelector(".alert");
const todo=document.querySelector("#todo");
const submitBtn=document.querySelector(".submit-btn");
const container=document.querySelector(".todo-container");
const list=document.querySelector(".todo-list");
const clearBtn=document.querySelector(".clear-btn");

// ********** Edit ITEMS **********
let editElement;
let editFlag=false;
let editID;
// ********** EVENT LISTENERS **********
form.addEventListener("submit",addItem);
clearBtn.addEventListener("click",clearItems);
window.addEventListener("DOMContentLoaded",setupItems);

// ********** FUNCTIONS **********
function addItem(e){
    e.preventDefault();
    const value=todo.value;
    const id=new Date().getTime().toString();
    if(value !== ""&& !editFlag){
        const element=document.createElement("article");
        let attr=document.createAttribute("data-id");
        attr.value=id;
        element.setAttributeNode(attr);
        element.classList.add("todo-item");

        element.innerHTML=`
        <p class="title">${value}</p>
        <div class="btn-container">  
        <button type="button" class="edit-btn">
            <i class="fas fa-edit"></i>
        </button>
        <button type="button" class="delete-btn">
        <i class="fas fa-trash"></i>
        </button>
        </div>
        `;

        const editBtn=element.querySelector(".edit-btn");
        editBtn.addEventListener("click",editItem);

        const deleteBtn=element.querySelector(".delete-btn");
        deleteBtn.addEventListener("click",deleteItem);

        console.log(element);
        list.appendChild(element);
        container.classList.add("show-container");
        addToLocalStorage(id,value);
        displayAlert("Item added to the list","success");
    }else if (value !== "" && editFlag) {
        editElement.innerText =value;
        editFromLocalStorage(editID,value);
        displayAlert("value Changed","success");
    } else{
        displayAlert("please enter a value","danger");
    }

    setBackToDefault();
}

function clearItems(){
    const items=document.querySelectorAll(".todo-item");
    if(items.length > 0){
        items.forEach((element)=>{
            list.removeChild(element);
        });

        container.classList.remove("show-container");
        displayAlert("Empty list","danger");
        localStorage.removeItem("list");
    }
}

function displayAlert(message,classname){
    alert.textContent=message;
    alert.classList.add(`alert-${classname}`);

    setTimeout(() =>{
        alert.textContent="";
        alert.classList.remove(`alert-${classname}`);
    },1000);
}

function editItem(e){
    const element=e.currentTarget.parentElement.parentElement;
    editElement=e.currentTarget.parentElement.previousElementSibling;

    todo.value=editElement.innerText;
    editFlag=true;
    editID=element.dataset.id;
    submitBtn.textContent="Edit";
}

function deleteItem(e){
      const element =e.currentTarget.parentElement.parentElement;
      list.removeChild(element);

      if(list.children.length ===0){
        container.classList.remove("show-container");
      }
      displayAlert("Item deleted","danger");
      removeFromLocalStorage(element.dataset.id);
}

function setBackToDefault(){
    editFlag=false;
    editElement="";
    editID="";
    submitBtn.textContent="Submit";
    todo.value="";
}

// ********** LOCAL STORAGE **********

function addToLocalStorage(id,value){
    const todo={id,value};       //! Equals to todo ={ id:id,value:value}
    let items=getFromLocalStorage();
    items.push(todo);

    localStorage.setItem("list",JSON.stringify(items));
}

function getFromLocalStorage(){
    return localStorage.getItem("list")
    ?JSON.parse(localStorage.getItem("list"))
    :[];
}

function removeFromLocalStorage(id) {
    let items=getFromLocalStorage();
    items=items.filter((item)=>{
        if(item.id !== id){
            return item;
        }
    });

    localStorage.setItem("list",JSON.stringify(items));
}

function editFromLocalStorage(id,value) {
    let items=getFromLocalStorage();
    items=items.map((item) => {
        if(item.id ===id){
            item.value=value;
        }
        return item;
    });

    localStorage.setItem("list",JSON.stringify(items));
}
// ********** SETUP ITEMS **********
function setupItems(){
    const items=getFromLocalStorage();
    items.forEach((item)=>{
        addListItems(item.id,item.value);
    });
}

function addListItems(id,value) {
    const element=document.createElement("article");
    let attr=document.createAttribute("data-id");
    attr.value=id;
    element.setAttributeNode(attr);
    element.classList.add("todo-item");

    element.innerHTML=`
        <p class="title">${value}</p>
        <div class="btn-container">  
        <button type="button" class="edit-btn">
            <i class="fas fa-edit"></i>
        </button>
        <button type="button" class="delete-btn">
        <i class="fas fa-trash"></i>
        </button>
        </div>
        `;

        const editBtn=element.querySelector(".edit-btn");
        editBtn.addEventListener("click",editItem);

        const deleteBtn=element.querySelector(".delete-btn");
        deleteBtn.addEventListener("click",deleteItem);

        console.log(element);
        list.appendChild(element);
        container.classList.add("show-container");
}
