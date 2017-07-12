var chatHandler = function(io, users) {
    io.sockets.on('connection', function(socket) {
        console.log("New connection established")

        socket.on('new-user', function(username, callback) {
            if (username in users) {
                console.log(username + " username already exists");
                callback(false);
            } else {
                console.log(username + " username added");
                callback(true);
                socket.username = username;
                users[username] = socket;
                console.log("current users:");
                console.log(Object.keys(users));
                updateUsers();
            }
        })

        socket.on('message-sent', function(message, callback) {
            var message = message.trim();
            if (message.indexOf('@') === 0) {
                var spaceIndex = message.indexOf(' ');
                if (message.length === 1 || spaceIndex === 1) {
                    callback("Please write the target username after @")
                } else if (spaceIndex === -1) {
                    callback("Please write the message after " + message)
                } else {
                    var toUser = message.substring(1, spaceIndex);
                    var message = message.substring(spaceIndex + 1);
                    if (toUser === socket.username) {
                        callback("Sorry, you cannot chat with yourself!");
                    } else if (toUser in users) {
                        users[toUser].emit('private-message', {
                            message: message,
                            from: socket.username,
                            to: toUser
                        });
                        users[socket.username].emit('private-message', {
                            message: message,
                            from: socket.username,
                            to: toUser
                        });
                    } else {
                        callback("Sorry, " + toUser + " is not online");
                    }
                }
            } else {
                io.sockets.emit('new-message', {
                    message: message,
                    username: socket.username
                });
            }
        })

        socket.on('disconnect', function(data) {
            if (socket.username) {
                delete users[socket.username];
                console.log("current users:");
                console.log(Object.keys(users));
                updateUsers();
            }
        });

        function updateUsers() {
            io.sockets.emit('user-updated', Object.keys(users))
        }
    })
}
module.exports = chatHandler;
