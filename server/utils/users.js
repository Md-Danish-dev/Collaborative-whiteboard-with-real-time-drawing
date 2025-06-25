const users= [];

const addUser =({userName,userId,roomId,host,presenter,socketId}) => {
    const user = {userName,userId,roomId,host,presenter,socketId};
    users.push(user);
    return users;
};


const removeUser = (id) => {
    const index = users.findIndex((user) => user.socketId === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
    return users;
};

const getUser = (id) => {
    return users.find((user) => user.socketId === id);
};

const getUsersInRoom = (roomId) => {
    return users.filter((user) => user.roomId === roomId);
};

module.exports = { addUser, removeUser, getUser, getUsersInRoom };

