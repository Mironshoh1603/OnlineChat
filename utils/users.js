let users = [];

function userJoin(id, username, room) {
  const user = { id, username, room };
  users.push(user);
  return user;
}
function getCurrentUser(id) {
  return users.find((val) => val.id === id);
}
function userLeave(id) {
  const index = users.findIndex((val) => val.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}
function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}

module.exports = { userJoin, getCurrentUser, userLeave, getRoomUsers };
