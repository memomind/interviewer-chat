import bot from './assets/bot.svg'
import user from './assets/user.svg'
import {Configuration, OpenAIApi} from 'openai';

const apikey1 = "sk-0uSFX7Ou4HWx8jMUm"
const apikey2 = "KHhT3BlbkFJYgPx"


const form = document.querySelector('form')
const chatcontainer = document.querySelector('#chat_container')
const config = new Configuration({
    apiKey: apikey1+apikey2+"w6hLxSxDDvrW9o0h"
})
const openai = new OpenAIApi(config)
let loadInterval;

const user_info = []


function loader(element){
    element.testContent = ''

    loadInterval = setInterval(()=>{
        element.textContent += '.';

        if (element.textContent === '...'){
            element.testContent = '';
        }
    }, 300)
}

function typeText(element, text){
    let index = 0
    text = String(text)

    let interval = setInterval(()=>{
        if (index<text.length){
            element.innerHTML += text.charAt(index);
            index ++;
        }
        else{
            clearInterval(interval)
        }
    },20)
}

function generateUniqueID(){
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`
}


function chatStripe (isAI,value,uniqueId){
return (
    `
    <div class = "wrapper ${isAI && 'ai'}">
    <div class = "chat">
    <div class="profile">
    <img src="${isAI ? bot: user}" alt="${isAI ? 'bot': 'user'}">
</div>

<div class="message" id="${uniqueId}">${value}</div>
    
</div>
    </div>
    `
)
}

async function request_openai(user){
    try{
        console.log(user_info)
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {role: "system", content: "I want you to act as an interviewer. I will be the candidate and you will ask me the interview questions for a certain position. I want you to only reply as the interviewer. Do not write all the conservation at once. I want you to only do the interview with me. Ask me the questions and wait for my answers. Do not write explanations. Ask me the questions one by one like an interviewer does and wait for my answers."},
                {role: "user", content: `${user}`},
                {role: "assistant", "content": `${user_info.join(', ')}`},
                // {"role": "user", "content": "Where was it played?"}
            ]
        });
        const reply = response.data.choices[0].message.content
        console.log(reply)
        return reply
    }
    catch (e) {
        console.log(e)
        alert(e)
    }
}

const handleSubmit = async (e) =>{
    e.preventDefault();
    const data = new FormData(form);
    // user's chat stipe
    const user = String(data.get('prompt'))
    chatcontainer.innerHTML += chatStripe(false,user);
    user_info.push(user)

    form.reset()

    // bot's chatstripe
    const uniqueID = generateUniqueID();
    chatcontainer.innerHTML += chatStripe(true,"", uniqueID);

    chatcontainer.scrollTop = chatcontainer.scrollHeight;

    const msgDiv = document.getElementById(uniqueID);

    loader(msgDiv);



    const response = await request_openai(data.get('prompt'),'')

    clearInterval(loadInterval)
    msgDiv.innerHTML = "";

    const parsedData = String(response).trim()
    typeText(msgDiv,parsedData)

}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e)=>{
    if (e.keyCode===13){
        handleSubmit(e);
    }
})


async function greeting(){
    const bot_greeting =  await request_openai('Ask me which position I aim for')
    const uniqueID = generateUniqueID();

    chatcontainer.innerHTML += chatStripe(true,"", uniqueID);
    chatcontainer.scrollTop = chatcontainer.scrollHeight;
    const msgDiv = document.getElementById(uniqueID);
    loader(msgDiv);


    clearInterval(loadInterval)
    msgDiv.innerHTML = "";

    typeText(msgDiv,bot_greeting)
}

await greeting()