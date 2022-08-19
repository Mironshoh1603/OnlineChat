const chatForm = document.querySelector("#chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

console.log({ username, room });

const clientSocket = io();

clientSocket.emit("joinRoom", { username, room });
clientSocket.on("roomUsers", ({ room, users }) => {
  console.log(users, room);
  outputRooms(room);
  outputUsers(users);
});

clientSocket.on("message", (message) => {
  outputMessages(message);
  console.log(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;
  clientSocket.emit("chatMessage", msg);
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

function outputMessages(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

function outputRooms(room) {
  console.log("bu ishladi");
  roomName.innerText = room;
}

function outputUsers(users) {
  console.log(users);
  userList.innerHTML = "";
  for (let user of users) {
    const li = document.createElement("li");
    li.innerText = user.username;
    userList.appendChild(li);
  }
}
