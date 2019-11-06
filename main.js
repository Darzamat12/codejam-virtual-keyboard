function sleep(millis) {
    var t = (new Date()).getTime();
    var i = 0;
    while (((new Date()).getTime() - t) < millis) {
        i++;
    }
}

const engLetters=["`","1","2","3","4","5","6","7","8","9","0","-","=","q","w","e","r","t","y","u","i","o","p","[","]","\\","a","s","d","f","g","h","j","k","l",";","'","z","x","c",
    "v","b","n","m",",",".","/"];
const ruLetters= ["ё","1","2","3","4","5","6","7","8","9","0","-","=","й","ц","у","к","е","н","г","ш","щ","з","х","ъ","\\","ф","ы","в","а","п","р","о","л","д","ж",
    "э","я","ч","с","м","и","т","ь","б","ю","."];


const keyboard={
    elems: {
        main:null,
        keyboardRow:null,
        keys:[]
    },

    eventHandlers:{
        oninput:null,
        onclose:null
    },

    properties:{
        value:"",
        caps:false,
        lang:false,//false==ru, true==eng
        langSwitchShift:false,
        langSwitchCtrl:false
    },

    init(){//create main elements(keyboard)
        let text=document.createElement('textarea');
        text.classList.add("textarea");
        document.body.appendChild(text);
        this.elems.main=document.createElement('div');
        this.elems.keyboardRow=document.createElement('div');

        
        this.elems.main.classList.add("keyboard");
        this.elems.keyboardRow.classList.add('keyboard__row');
        this.elems.keyboardRow.appendChild(this._createKey());

        this.elems.keys=this.elems.keyboardRow.querySelectorAll(".key");
        if(window.localStorage.getItem('language')=='eng'){ this._changeLanguage();
            window.localStorage.setItem('language', 'eng');
        }

        this.elems.main.appendChild(this.elems.keyboardRow);
        document.body.appendChild(this.elems.main);
        document.querySelector(".textarea").setAttribute('readonly','readonly');
        document.querySelectorAll(".textarea").forEach(element =>{
            this.open(element.value, currentValue=>{
                element.value=currentValue;
            })
        })

        this._realKeyboardInput();

    },

    _createKey(){
        const fragment=document.createDocumentFragment();
        const keyWrapper=[
            "ё","1","2","3","4","5","6","7","8","9","0","-","=","Backspace",
            "Tab","й","ц","у","к","е","н","г","ш","щ","з","х","ъ","\/","DEL",
            "CapsLock","ф","ы","в","а","п","р","о","л","д","ж","э","ENTER",
            "Shift","я","ч","с","м","и","т","ь","б","ю",".","▲","Shift ",
            "Ctrl","Win","Alt","Space","Alt ","◄","▼","►","Ctrl "

        ];
        keyWrapper.forEach(key=>{
            const keyElement=document.createElement('button');
            const lineBreak=["Backspace","DEL","ENTER","Shift "].indexOf(key)!==-1;
            keyElement.setAttribute("type","button");
            keyElement.classList.add("key");

            switch(key){
                case "Backspace":
                    keyElement.textContent=key;
                    keyElement.classList.add("key--wide");
                    keyElement.addEventListener("click",()=>{
                        this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                        this._callEvent("oninput");
                    })
                    break;
                case "Tab":
                    keyElement.textContent=key;
                    keyElement.classList.add("key--special");
                    keyElement.addEventListener("click",()=>{
                        this.properties.value=this.properties.value+"   ";
                        this._callEvent("oninput");
                    })
                    break;
                case "DEL":
                    keyElement.textContent=key;
                    keyElement.classList.add("key--special");
                   
                    break;

                case "ENTER":
                    keyElement.textContent=key;
                    keyElement.classList.add("key--wide");
                    keyElement.addEventListener("click",()=>{
                        this.properties.value+="\n";
                        this._callEvent("oninput");
                    })
                    break;
                case "CapsLock":
                    keyElement.textContent=key;
                    keyElement.classList.add("key--wide");
                    keyElement.addEventListener("click",()=>{
                        this._toggleCaps();
                    })
                    break;
                case "Space":
                    keyElement.textContent=key;
                    keyElement.classList.add("key--space");
                    keyElement.addEventListener("click",()=>{
                        this.properties.value+=" ";
                        this._callEvent("oninput");
                    })
                    break;
                case "Shift": case "Shift ": 
                    keyElement.textContent=key;
                    keyElement.addEventListener("mousedown",()=>{
                        this._toggleCaps();
                    })
                    keyElement.addEventListener("mouseup",()=>{
                        this._toggleCaps();
                    })
                    keyElement.classList.add("key--wide");
                    break;
                case "Ctrl": case "Ctrl ":
                    keyElement.textContent=key;
                    keyElement.classList.add("key--special");
                    break;
                case "Alt": case "Alt ":
                    keyElement.textContent=key;
                    keyElement.classList.add("key--special");
                    break;
                case "▲":
                case "◄":
                case "▼":
                case "►":
                    keyElement.textContent=key;
                    keyElement.classList.add("key--special");
                    keyElement.addEventListener("click",()=>{
                        this.properties.value+=this.properties.caps ? keyElement.textContent : keyElement.textContent;
                        this._callEvent("oninput");
                    })

                case "Win":
                    keyElement.textContent=key;
                    keyElement.classList.add("key--special");
                    break;
                default:

                    keyElement.textContent=key.toLowerCase();

                    keyElement.addEventListener("click",()=>{
                        this.properties.value+=this.properties.caps ? keyElement.textContent : keyElement.textContent;
                        this._callEvent("oninput");
                    })
                    break;
            }
            fragment.appendChild(keyElement);
            if(lineBreak) fragment.appendChild(document.createElement('br'));
        });
        return fragment;

    },

    _changeLanguage(){
        this.properties.langSwitchCtrl=0;
        this.properties.langSwitchShift=0;
        this.properties.lang=!this.properties.lang;
        if(window.localStorage.getItem('language')=='ru')window.localStorage.setItem('language','eng');
        else if(window.localStorage.getItem('language')=='eng') window.localStorage.setItem('language','ru');
        else window.localStorage.setItem('language','eng');
        let i=0;
        if(this.properties.lang)
        for(key of this.elems.keys){
            if(key.className==="key"){
                key.textContent=this.properties.caps ? engLetters[i].toUpperCase() : engLetters[i].toLowerCase();
                i++;
            }
        }

        else for(key of this.elems.keys){
            if(key.className==="key") {
                key.textContent=this.properties.caps ? ruLetters[i].toUpperCase() : ruLetters[i].toLowerCase();
                i++;}
        }

        
    },

    _realKeyboardInput(){
        let shiftCounter=0
        document.addEventListener("keydown",function(event){
            switch(event.keyCode){
                case 16:


                    if(event.location===1){
                        for(key of keyboard.elems.keys){
                            if(key.textContent=="Shift")key.classList.add("key--active");
                        }
                    }
                    else {
                        for(key of keyboard.elems.keys){
                            if(key.textContent=="Shift ")key.classList.add("key--active");
                        }
                    }
                    keyboard.properties.langSwitchShift=5;

                    if(shiftCounter<1){
                    keyboard._toggleCaps();
                    shiftCounter++;
                    }

                    console.log('shift');
                    if(keyboard.properties.langSwitchCtrl) keyboard._changeLanguage();
                    break;
            
                case 17:

                if(event.location===1){
                        for(key of keyboard.elems.keys){
                            if(key.textContent=="Ctrl")key.classList.add("key--active");
                        }
                    }
                    else {
                        for(key of keyboard.elems.keys){
                            if(key.textContent=="Ctrl ")key.classList.add("key--active");
                        }
                    }
                    keyboard.properties.langSwitchCtrl=5;
                    if(keyboard.properties.langSwitchShift) keyboard._changeLanguage();
                    console.log('ctrl');
                    break;

                case 18:
                        if(event.location===1){
                            for(key of keyboard.elems.keys){
                                if(key.textContent=="Alt")key.classList.add("key--active");
                            }
                        }
                        else {
                            for(key of keyboard.elems.keys){
                                if(key.textContent=="Alt ")key.classList.add("key--active");
                            }
                        }
                        break;

                case 20:

                    for(key of keyboard.elems.keys){
                                if(key.textContent=="CapsLock")key.classList.add("key--active");
                            }
                    keyboard._toggleCaps();
                    break;

                case 9:
                    for(key of keyboard.elems.keys){
                                if(key.textContent=="Tab")key.classList.add("key--active");
                            }
                            break;
                case 8:
                    for(key of keyboard.elems.keys){
                                if(key.textContent=="Backspace")key.classList.add("key--active");

                            }
                            keyboard.properties.value = keyboard.properties.value.substring(0, keyboard.properties.value.length - 1);
                            keyboard._callEvent("oninput");


                            break;

                case 13:
                    
                        for(key of keyboard.elems.keys){
                                if(key.textContent=="Enter")key.classList.add("key--active");
                            }
                            break;

                case 91:
                     for(key of keyboard.elems.keys){
                                if(key.textContent=="Win")key.classList.add("key--active");
                            }
                            break;
                case 37:
                        for(key of keyboard.elems.keys){
                            if(key.textContent=="◄")key.classList.add("key--active");
                        }
                        keyboard.properties.value+="◄";
                        keyboard._callEvent("oninput");
                        break;
                case 38:
                        for(key of keyboard.elems.keys){
                            if(key.textContent=="▲")key.classList.add("key--active");
                        }
                        keyboard.properties.value+="▲";
                        keyboard._callEvent("oninput");
                        break;
                case 39:
                        for(key of keyboard.elems.keys){
                            if(key.textContent=="►")key.classList.add("key--active");
                        }
                        keyboard.properties.value+="►";
                        keyboard._callEvent("oninput");
                        break;
                case 40:
                        for(key of keyboard.elems.keys){
                            if(key.textContent=="▼")key.classList.add("key--active");
                        }
                        keyboard.properties.value+="▼";
                        keyboard._callEvent("oninput");
                        break;

                case 32:
                        for(key of keyboard.elems.keys){
                            if(key.textContent=="Space")key.classList.add("key--active");
                        }
                        keyboard.properties.value+=" ";
                        keyboard._callEvent("oninput");
                        break;

                        

                default:
                        console.log(event.keyCode);
                        let temp;
                        let tempLetter;
                        if(ruLetters.indexOf(event.key.toLowerCase())===-1){
                            temp=engLetters.indexOf(event.key.toLowerCase());
                            if(keyboard.properties.lang)
                                tempLetter=engLetters[temp];
                            else tempLetter=ruLetters[temp];
                            keyboard.properties.value+=keyboard.properties.caps ? tempLetter.toUpperCase() : tempLetter.toLowerCase();
                            keyboard._callEvent("oninput");
                            for(key of keyboard.elems.keys){
                                if(key.textContent==tempLetter)key.classList.add("key--active");
                            }
                            console.log(keyboard.properties.value);
                        }
                        else{
                            temp=ruLetters.indexOf(event.key.toLowerCase());
                            if(keyboard.properties.lang)
                                tempLetter=engLetters[temp];
                            else tempLetter=ruLetters[temp];
                            keyboard.properties.value+=keyboard.properties.caps ? tempLetter.toUpperCase() : tempLetter.toLowerCase();
                            keyboard._callEvent("oninput");
                            for(key of keyboard.elems.keys){
                                if(key.textContent==tempLetter)key.classList.add("key--active");
                                
                            }
                            
                        }
        }
        
    })

        document.addEventListener("keyup",function(event){

            switch(event.keyCode){
                case 16:
                     if(event.location===1){
                        for(key of keyboard.elems.keys){
                            if(key.textContent=="Shift")key.classList.remove("key--active");
                        }
                    }
                    else{
                        for(key of keyboard.elems.keys){
                            if(key.textContent=="Shift ")key.classList.remove("key--active");
                        }
                    }
                    keyboard.properties.langSwitchShift=0;
                    keyboard._toggleCaps();
                    shiftCounter=0;
                    break;
                case 17:
                    if(event.location===1){
                        for(key of keyboard.elems.keys){
                            if(key.textContent=="Ctrl")key.classList.remove("key--active");
                        }
                    }
                    else{
                        for(key of keyboard.elems.keys){
                            if(key.textContent=="Ctrl ")key.classList.remove("key--active");
                        }
                    }
                    
                    keyboard.properties.langSwitchCtrl=0;
                    break;

                case 18:
                    if(event.location===1){
                        for(key of keyboard.elems.keys){
                            if(key.textContent=="Alt")key.classList.remove("key--active");
                        }
                    }
                    else{
                        for(key of keyboard.elems.keys){
                            if(key.textContent=="Alt ")key.classList.remove("key--active");
                        }
                    }
                    break;

                    case 9:
                    for(key of keyboard.elems.keys){
                                if(key.textContent=="Tab")key.classList.remove("key--active");
                            }
                        keyboard.properties.value+="    ";
                        keyboard._callEvent("oninput");
                        break;

                        case 32:
                                for(key of keyboard.elems.keys){
                                    if(key.textContent=="Space")key.classList.remove("key--active");
                                }
                                break;
                        case 91:
                                for(key of keyboard.elems.keys){
                                    if(key.textContent=="Win")key.classList.remove("key--active");
                                }
                                break;
                    case 8:
                        for(key of keyboard.elems.keys){
                                if(key.textContent=="Backspace")key.classList.remove("key--active");
                            }
                            break;
                    case 13:
                        for(key of keyboard.elems.keys){
                                if(key.textContent=="Enter")key.classList.remove("key--active");
                            }
                            keyboard.properties.value+="\n";
                            break;

                    case 37:
                            for(key of keyboard.elems.keys){
                                if(key.textContent=="◄")key.classList.remove("key--active");
                            }
                            break;

                    case 38:
                        for(key of keyboard.elems.keys){
                            if(key.textContent=="▲")key.classList.remove("key--active");
                        }
                        break;

                    case 39:
                        for(key of keyboard.elems.keys){
                            if(key.textContent=="►")key.classList.remove("key--active");
                        }
                        break;
                    case 40:
                        for(key of keyboard.elems.keys){
                            if(key.textContent=="▼")key.classList.remove("key--active");
                        }
                        break;
                    case 32:
                        for(key of keyboard.elems.keys){
                            if(key.textContent=="Space")key.classList.remove("key--active");
                        }
                        break;

                    

                

                default:
                        let temp;
                        let tempLetter;
                        if(ruLetters.indexOf(event.key.toLowerCase())===-1){
                            temp=engLetters.indexOf(event.key.toLowerCase());
                            if(keyboard.properties.lang)
                                tempLetter=engLetters[temp];
                            else tempLetter=ruLetters[temp];
                            
                            for(key of keyboard.elems.keys){
                                if(key.textContent==tempLetter)key.classList.remove("key--active");
                            }
                            console.log(keyboard.properties.value);
                        }
                        else{
                            temp=ruLetters.indexOf(event.key.toLowerCase());
                            if(keyboard.properties.lang)
                                tempLetter=engLetters[temp];
                            else tempLetter=ruLetters[temp];
                            
                            for(key of keyboard.elems.keys){
                                if(key.textContent==tempLetter)key.classList.remove("key--active");
                                
                            }
                            
                        }

            }

            
        })

    },

    _callEvent(handler){
        if (typeof this.eventHandlers[handler] == "function") {
            this.eventHandlers[handler](this.properties.value);
        }
    },

    _toggleCaps(){
        this.properties.caps=!this.properties.caps;
        

        for(key of this.elems.keys){
            if(key.className==="key" )
                key.textContent=this.properties.caps ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
        }
    },

    open(initValue,oninput,onclose){
        this.properties.value=initValue || "";
        this.eventHandlers.oninput=oninput;
        this.eventHandlers.onclose=onclose;

    },
    
    close(){
        this.properties.value="";
        this.eventHandlers.oninput=oninput;
        this.eventHandlers.onclose=onclose;
    },


};

window.addEventListener("DOMContentLoaded",function(){
    console.log(window.localStorage.getItem('language'));
    keyboard.init();
    
    
});



















// let keysFirstRowRu=["ё","1","2","3","4","5","6","7","8","9","0","-","+"];
// let keysThirdRowRu=["ф","ы","в","а","п","р","о","л","д","ж","э"];
// let keysSecondRowRu=["й","ц","у","к","е","н","г","ш","щ","з","х","ъ","\/"];
// let keysForthRowRu=["я","ч","с","м","и","т","ь","б","ю","."]

// let key=document.createElement('div');
// key.className="key";
// key.id="key";



// let wrapper=document.createElement('div');
// wrapper.className="wrapper";

// document.body.prepend(wrapper);
// let keyboard=document.createElement('div');
// keyboard.className="keyboard";
// wrapper.appendChild(keyboard);
// let keyboardRow=document.createElement('div');
// keyboardRow.className="keyboard__row";
// document.querySelector("body > div > div").append(keyboardRow);
// for(let i=0;i<13;i++) document.querySelector("body>div>div>div").insertAdjacentHTML('beforeend','<div class="key" id="key" >'+keysFirstRowRu[i]+'</div>');
// document.querySelector("body > div > div").insertAdjacentHTML('beforeend','<div class="keyboard__row"></div>');
// document.querySelector("body > div > div").insertAdjacentHTML('beforeend','<div class="keyboard__row"></div>');
// document.querySelector("body > div > div").insertAdjacentHTML('beforeend','<div class="keyboard__row"></div>');
// for(let i=0;i<13;i++) document.querySelector("body > div > div > div:nth-child(2)").insertAdjacentHTML('beforeend','<div class="key" id="key">'+keysSecondRowRu[i]+'</div>');

// change=function(){
//     key.style.color="black";
//     key.style.backgroundColor="white";
//     console.log("action");
// };

