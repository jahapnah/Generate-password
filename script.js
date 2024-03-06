const inputSlider = document.querySelector("[data-length-slider]");
const lengthDisplay = document.querySelector("[data-length]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const upperCaseCheck = document.querySelector("#uppercase");
const lowerCaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox")
const symbols = '-.@#';

let password = "";
let passwordLength = 10;
let checkCount = 1;
setIndicator("#ccc");
handleSlider();
// -------------------------------------------->

// SLIDER HANDLER
function handleSlider()
{   
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}

// INDICATOR HANDLER
function setIndicator(color)
{
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

// GETTING RANDOM VALUES ------------->
function randomValues(min, max){
   return Math.floor(Math.random() * (max-min)) + min;
}

// GETTING RANDOM INTEGERS
function generateInteger() 
{
    return randomValues(0, 9);
}

// GETTING RANDOM LOWERCASE
function generateLowercase()
{
    return String.fromCharCode(randomValues(97, 123));
}

// GETTING RANDOM UPPERCASE
function generateUppercase()
{
    return String.fromCharCode(randomValues(65, 90));
}

//GETTING RANDOM SYMBOLS
function generateSymbols()
{
    const value = randomValues(0,symbols.length);
    const key = symbols.charAt(value);
    return key;
}


// STRENGTH CALCULATOR
function calcStrength(){

    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (upperCaseCheck.checked) hasUpper = true;
    if (lowerCaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
    
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    } 
    else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6){
        setIndicator("#ff0");
    }
    else {
        setIndicator("#f00");
    }
}


// COPYING TEXT
async function copyContent()
{
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "failed";
    }

    // To make copy wala text visibke
    copyMsg.classList.add("active");

    // To make it hidden after 2 sec
    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000)
}

// SLIDER VALUE CONTROL
inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

// COUNTING CHECKED CHECKBOXES
function handleCheckBoxChange()
{
    checkCount = 0;
    allCheckBox.forEach((checkBox)=>{
        if(checkBox.checked){
            checkCount++;
        }
    })  
    
    if(passwordLength < checkCount)
    {
        passwordLength = checkCount;
        handleSlider();
    }
}


//SHUFFLING THE PASSWORD
function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

allCheckBox.forEach((checkBox)=>
{
    checkBox.addEventListener('change',()=>{handleCheckBoxChange})
})

copyBtn.addEventListener('click', ()=>{
    if(passwordDisplay.value)
    {
        copyContent();
    }
})

generateBtn.addEventListener('click', ()=>{
    if(checkCount==0)return;

    console.log("Started the process of creating pasword");

    password = "";
    let funcArr = [];

    if(upperCaseCheck.checked){
        funcArr.push(generateUppercase);
    }

    if(lowerCaseCheck.checked){
        funcArr.push(generateLowercase);
    }

    if(numbersCheck.checked){
        funcArr.push(generateInteger);
    }   
    
    if(symbolsCheck.checked){
        funcArr.push(generateSymbols);
    }

    // compulsary addition
    for(let i = 0; i<funcArr.length; i++)
    {
        password += funcArr[i]();
    }   
    console.log("Compulsary addition done");


    // remaining addition
    for(let i=0; i<passwordLength-funcArr.length; i++)
    {
        let randIndex = randomValues(0 , funcArr.length);

        password += funcArr[randIndex]();
    }

    password = shufflePassword(Array.from(password));
    passwordDisplay.value = password;
    calcStrength();
})