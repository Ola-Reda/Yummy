let meals=[]
let apiUrl = ''
let randomMeals = document.getElementById("randomMeals")
let loading = document.querySelector(".loading")
let mealDetails = document.getElementById("mealDetails")
let nameInput = document.querySelector(".name")
let letterInput = document.querySelector(".letter")
let searchMealsByName = document.getElementById('searchMealsByName')
let searchMealDetails = document.getElementById("searchMealDetails")
let mealsContent = document.getElementById("meals")
let detailsContent = document.getElementById("details")
let contactInputs = document.querySelectorAll('.contact .input');
let passwordInput = document.querySelector('.password');
let repasswordInput = document.querySelector('.repassword');
let subBtn = document.querySelector(".contact .btn");
let links = document.querySelectorAll('.nav-link')
let main =  document.querySelector('main')
let search = document.getElementById('search')
let CaregoriesAreasIngrediants = document.getElementById('CaregoriesAreasIngrediants')
let content = document.getElementById('content')
let contact = document.querySelector('.contact')
let linksWidth = $('.links').innerWidth()


$('nav ul li').css('left',-linksWidth)
$(".bars").on("click", function() {
links
    $(this).toggleClass('fa-bars fa-xmark');
    $('.links').animate({ width: "toggle" }, 500);

    if (!$(this).hasClass("fa-bars")) {
        //open sidebar
        $('nav ul li').each(function(index,el) {
            $(el).delay(index * 100).animate({
                left: 0,
                top: "0px",
                opacity: 1
            }, 500);
        });
    } else {
        //close sidebar
        $('nav ul li').animate({
            left:-linksWidth,
            top: "200px",
            opacity: 0
        }, 500);
    }
});
loading
//end sidebar//


async function getMeals(name,displayRow,displayDetails){
    const res=await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`)
    const data=await res.json()
    meals=data.meals
    displayRandomMeals(meals,displayRow,displayDetails)
}

function displayRandomMeals(data,displayRow,displayDetails){
    let cart=''
    for(let i=0;i<data.length;i++){
        cart+=`    <div class="col-md-3" >
            <div class="meal position-relative rounded-2 overflow-hidden" id="${data[i].idMeal}">
                <img src="${data[i].strMealThumb}" alt="${data[i].strMeal}" class="w-100 rounded">
                    <div class="layer d-flex align-items-center rounded-2 p-2">
                            <h2 class="text-black text-capitalize">${data[i].strMeal}</h2>
                    </div>
                </div>
            </div>
        `
    }

displayRow.innerHTML=cart
    const meals=document.querySelectorAll(".meal")
    meals.forEach((meal)=>{
        meal.addEventListener("click",function(){
            displayRow.classList.add('d-none')
            displayDetails.classList.remove("d-none")
            document.getElementById("searchInputsRow")?.classList.add("d-none")
            getMealDetails(this.id,displayRow,displayDetails);
            
        })
    })
}

getMeals('',randomMeals,mealDetails)


async function getMealDetails(id,displayRow,displayDetails){
const res=await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
const data=await res.json()
let [meal]=data.meals;
displayMealDetails(meal,displayRow,displayDetails)

}
function getIngradients(meal){
const mealobj=new Map(Object.entries(meal))
let ingradentVals=[]
let ingredientMeeasure=[]
for([key ,val] of mealobj){
    if(key.includes('strIngredient')){
    ingradentVals.push(val)
    }
    if (key.includes('strMeasure')){
        ingredientMeeasure.push(val)
    }
}

const ingrediantMap=ingradentVals.map((ingradent,index)=>{
    return ingradent? `<span class="alert alert-info p-1 m-2">${ingredientMeeasure[index]} ${ingradent}</span>`:null 
})

const filtedIngrediants= ingrediantMap.filter(ingradient=> ingradient).join(' ');
    return filtedIngrediants
}

function getTags(tags){
    
    const taggedMeal= tags?  tags.split(",").map((tag)=>{
        return ` <span class="alert alert-danger m-2 p-1">${tag}</span>`
    }).join(' '):''
    return taggedMeal;
}

function displayMealDetails(meal,displayRow,displayDetails){
    let cart=''
    cart=`     <div class="col-md-4">
                    <div class="rounded-2">
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="w-100 rounded-2">
                        <h2 class="text-white text-capitalize">${meal.strMeal}</h2>
                    </div>

                </div>
                <div class="col-md-8">
                    <div class="deatils position-relative">
                    <div class="d-flex justify-content-between">
                        <h2  class="text-white">Instructions</h2>
                        <i class="fa-solid fa-xmark close fa-2x text-white"></i>
                    </div>
                        <p class="text-white desc">${meal.strInstructions}</p>
                        <div class="d-flex flex-column">
                        <h3 class="text-white">Area: ${meal.strArea}</h3>
                        <h3 class="text-white">Category: ${meal.strCategory}</h3>
                        <h3 class="text-white">Recipes : </h3>
                        <div class="respies">
                        ${getIngradients(meal)}
                        </div>
                        <h3 class="text-white">Tags :</h3>
                        <div class="tags">
                    ${getTags(meal.strTags)}
                        </div>
                        <div class="btns">
                            <a href="${meal.strSource}" class="btn btn-success" target="_blank">Source</a>
                            <a href="${meal.strYoutube}" class="btn btn-danger"  target="_blank">Youtube</a>
                        </div>
                    /div>
                    
                    </div>
                </div>`
displayDetails.innerHTML=cart
const closeButton = displayDetails.querySelector(".close");
closeButton.addEventListener("click",function(){
    console.log(displayRow,displayDetails);
    document.getElementById("searchInputsRow")?.classList.remove("d-none")
    displayRow.classList.remove('d-none')

    displayDetails.classList.add("d-none")  

})
}

nameInput?.addEventListener("input",function(){
    const inputVal = nameInput.value.trim();
    if ( inputVal.length > 0) {
        getMeals(inputVal, searchMealsByName, searchMealDetails);
    } 
})

letterInput?.addEventListener("keydown", function(e) {
    if (letterInput.value.length >= 1&& e.key.length === 1) {
        e.preventDefault(); 
    }
});

letterInput?.addEventListener("input",function(){
    const letter=letterInput.value.trim()
    if (letter.length === 1) {
        getMealsByLetter(letter, searchMealsByName, searchMealDetails);
    }  
})

async function getMealsByLetter(letter, displayRow, displayDetails) {
    loading.classList.remove('d-none');
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
    const data = await res.json();
    loading.classList.add('d-none');
    const meals = data.meals;
    displayRandomMeals(meals, displayRow, displayDetails);
}


function hideAllSections(){
    main.classList.add('d-none');
    search.classList.add('d-none');
    mealsContent.classList.add('d-none');
    detailsContent.classList.add('d-none');
    contact.classList.add('d-none')
}

links.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();

        const aHref = this.getAttribute('href'); 

        hideAllSections()
        content.classList.remove('d-none');
        CaregoriesAreasIngrediants.classList.remove('d-none');

        if (aHref === '#search') {
            search.classList.remove('d-none');
            content.classList.add('d-none');
            contact.classList.add('d-none');
        } else if (aHref === '#categories') {
            apiUrl = 'https://www.themealdb.com/api/json/v1/1/categories.php';
        } else if (aHref === '#area') {
            apiUrl = 'https://www.themealdb.com/api/json/v1/1/list.php?a=list';
        } else if (aHref === '#ingrediants') {
            apiUrl = 'https://www.themealdb.com/api/json/v1/1/list.php?i=list';
        } else if (aHref === '#contact') {
            contact.classList.remove('d-none');
            content.classList.add('d-none');
            CaregoriesAreasIngrediants.classList.add('d-none');
        }
        if (apiUrl) fetchAndDisplay(apiUrl);
    });
});

async function fetchAndDisplay(url) {
    const res=await fetch(url)
    const data= await res.json()

    if(url.includes('categories')){
meals=data.categories
    }else if(url.includes("a=list")){
        meals=data.meals
    }else if(url.includes('i=list')){
        meals=data.meals
    }
    displayCategoriesAreaIng(meals,url)
}
function displayCategoriesAreaIng(data,url){

    if(url.includes('categories')){
    let cart=''
    for (let i=0;i<data.length;i++){
        cart+=`   
        <div class="col-md-3 category" id=${data[i].idCategory} >
                <div class="meal position-relative rounded-2 overflow-hidden">
                    <img src="${data[i].strCategoryThumb}" alt="${data[i].strCategory}" class="w-100 rounded-2">
                    <div class="layer rounded-2 text-center p-2">
                        <h2 class="h3">${data[i].strCategory}</h2>
                        <p>${data[i].strCategoryDescription.split(' ').slice(0,20).join(" ")}</p>
                </div>
        </div>
    </div>`
    }
    document.getElementById("CaregoriesAreasIngrediants").innerHTML=cart
clickElement(url) 
    }


    else if(url.includes('a=list')){
        let cart=''
        for (let i=0;i<data.length;i++){
            cart+=`   <div class="col-md-3 category" >
                    <div class="meal position-relative rounded-2 overflow-hidden">
                        <i class="fa-solid fa-house-laptop fa-4x h2-area"></i>
                        <h2 class="h3 h2-area">${data[i].strArea}</h2>
                    </div>
        </div>`
        }
        document.getElementById("CaregoriesAreasIngrediants").innerHTML=cart
    
    clickElement(url)

    }
    else if(url.includes('i=list')){
        let cart=''
        for (let i=0;i<20;i++){
            cart+=`   <div class="col-md-3 category" id=${data[i].idIngredient} >
                    <div class="meal position-relative rounded-2 overflow-hidden">
                    <i class="fa-solid fa-drumstick-bite fa-4x h2-area"></i>           
                                <h2 class="h3 h2-area">${data[i].strIngredient}</h2>
                                <p class="h2-area" >${data[i].strDescription?.split(' ').slice(0,20).join(" ")}</p>                  
                    </div>
                </div>`
                }
    document.getElementById("CaregoriesAreasIngrediants").innerHTML=cart
    clickElement(url)

}
}


// after displaying meals addevent to each meal to get the details
function clickElement(url){
    document.getElementById("CaregoriesAreasIngrediants").addEventListener("click", function (e) {
        const element = e.target.closest(".meal");
        if (!element) return;

        let filterParam = '';
        let filterValue = element.querySelector("h2").innerHTML;
        
        if (url.includes('categories')) {
            filterParam = `c=${filterValue}`;
        } else if (url.includes('a=list')) {
            filterParam = `a=${filterValue}`;
        } else if (url.includes('i=list')) {
            filterParam = `i=${filterValue}`;
        }
        getMealsCategoriesAreaIng(`https://www.themealdb.com/api/json/v1/1/filter.php?${filterParam}`);
    });
}

async function getMealsCategoriesAreaIng(url){
    loading.classList.remove('d-none')
document.getElementById("CaregoriesAreasIngrediants").classList.add("d-none")
const res= await fetch(url)
const data=await res.json()
loading.classList.add('d-none')
const meals=data.meals

mealsContent.classList.remove('d-none')
displayRandomMeals(meals,mealsContent,detailsContent)
}


// regex
const regex = {
    name:/^\s*[A-Za-z]+(?:\s+[A-Za-z]+){0,2}\s*$/,
    email: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
    phone: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
    age: /^(?:1[89]|[2-9][0-9])$/,
    password: /^(?=.*[a-z])(?=.*[0-9]).{8,}$/
};

contactInputs.forEach(input => {
    input.addEventListener("input", function() {
        if (regex[this.id].test(this.value)) {
            this.nextElementSibling.classList.replace("d-block", "d-none");
        } else {
            this.nextElementSibling.classList.replace("d-none", "d-block");
        }
        validateForm();
    });
});


repasswordInput.addEventListener("input", function() {
    if (this.value === passwordInput.value) {
        this.nextElementSibling.classList.replace("d-block", "d-none");
    } else {
        this.nextElementSibling.classList.replace("d-none", "d-block");
    }
    validateForm();
});

function validateForm() {
    const allInputsValid = Array.from(contactInputs).every(input => 
        regex[input.id].test(input.value)
    );
    const passwordsMatch = passwordInput.value === repasswordInput.value;

    if (allInputsValid && passwordsMatch) {
        subBtn.classList.remove("disabled");
    } else {
        subBtn.classList.add("disabled");
    }
}