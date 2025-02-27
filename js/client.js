const socket=io('http://localhost:8000');
const form=document.getElementById('send-container')
const messageInput=document.getElementById('messageInp')
const messageContainer=document.querySelector(".container")
const audio=new Audio('tune.mp3');
let isUserInteracted = false; 
const append=async (message,position)=>{
    const messageElement=document.createElement('div');
    messageElement.innerText=message;
    messageElement.classList.add('message')
    messageElement.classList.add(position)
    messageContainer.append(messageElement);
    if(position=='left' && isUserInteracted){
        try{
       await  audio.play();
        }catch(error){
            console.error("Audio playback error:", error);
        }
    }
}
document.addEventListener('click', () => {
    isUserInteracted = true;
});
document.addEventListener('keydown', () => {
    isUserInteracted = true;
});
form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message=messageInput.value;
    append(`You:${message}`,'right')
    socket.emit('send',message);
    messageInput.value=''
})
const name=prompt("Enter your name to join");
socket.emit('new-user-joined',name);
socket.on('user-joined',name=>{
    append(`${name} joined the chat`,'right')
})
socket.on('receive',data=>{
    append(`${data.name}:${data.message}`,'left')
})
socket.on('left',name=>{
    append(`${name} left the chat`,'right')
})

