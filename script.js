
// const msgerForm = get(".msger-inputarea");
// const msgerInput = get(".msger-input");
const roomname = localStorage.getItem("roomname");
const username = localStorage.getItem("username");
var joined= false
document.getElementById("room-heading").innerHTML= roomname
const msgerChat = get(".msger-chat");

const socket = new WebSocket('wss://s0zkw4rk2h.execute-api.ap-south-1.amazonaws.com/api');

socket.addEventListener('open', function (event) {
  socket.send(username);
});


function get(selector, root = document) {
  return root.querySelector(selector);
}

function formatDate(date) {
  const h = "0" + date.getHours();
  const m = "0" + date.getMinutes();

  return `${h.slice(-2)}:${m.slice(-2)}`;
}

var message = document.getElementById("message-input");
message.addEventListener("keypress", function(event) {
  var key = event.which || event.keyCode;
  if(key === 13 && this.value.trim() !== "")
  {
    socket.send(this.value)
    this.value = "";
  }
});

function sendMessage(){
  socket.send(message.value)
  message.value=""
}

function appendMessage(side, text) {
  //   Simple solution for small apps
  const msgHTML = `
    <div class="msg ${side}-msg">
      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-time">${formatDate(new Date())}</div>
        </div>
        <div class="msg-text">${text}</div>
      </div>
    </div>
  `;

  msgerChat.insertAdjacentHTML("beforeend", msgHTML);
  msgerChat.scrollTop += 500;
}

socket.addEventListener('message', function (event) {
  if(joined==false)
  {
    socket.send('/join '+roomname);
    joined=true
  }
  if(event.data.indexOf("Joined chat room")!=-1 || event.data.indexOf("joined room.")!=-1 || 
  event.data.indexOf("Commands available:")!=-1)
  {
    appendMessage("center",event.data);
  }
  else{
    if(event.data.indexOf(username+":")!=-1)
    {
      appendMessage("right",event.data);
    }
    else
    {
      appendMessage("left",event.data);
    }
  }
}  
)

