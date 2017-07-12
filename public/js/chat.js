$(document).ready(function() {
    var socket = io.connect();
    var username, message;

    $('#setUserName').submit(function(e) {
        e.preventDefault();
        if (username) {
            $('.error').html("You already selected a username, " + username);
            $('.error').stop().fadeIn(400).delay(2000).fadeOut(400);
            $('#userName').hide();
            $('#chatWindow').show();
        } else {
            username = $('#username').val();
            socket.emit('new-user', username, function(isUsernameExist) {
                if (isUsernameExist) {
                    $('#userName').hide();
                    $('#chatWindow').show();
                } else {
                    $('#error').html("Sorry, that nickname is already taken , try something else");
                }
            })
            $('#username').val("");
        }
    })

    socket.on('user-updated', function(usernames) {
        var markup = '<ul>'
        usernames.forEach(function(user) {
            markup += '<li>' + user + '</li>'
        })
        markup += '</ul>'
        $('#users').html(markup);
    })

    $('#chatMessage').keydown(function(e) {
        if (e.keyCode == 13) {
            $(this.form).submit()
            return false;
        }
    });

    $('#chatBox').submit(function(e) {
        e.preventDefault();
        if (username) {
            message = $('#chatMessage').val();
            socket.emit('message-sent', message, function(status) {
                $('.error').html(status);
                $('.error').stop().fadeIn(400).delay(2000).fadeOut(400);
            });
            $('#chatMessage').val("");
        } else {
            $('.error').html("Please choose a username before sending messages");
            $('.error').stop().fadeIn(400).delay(2000).fadeOut(400);
        }
    });

    socket.on('new-message', function(messageData) {
        if (messageData.username === username) {
            $('#chatHistory').append("<p align='right'><b>" + messageData.username + " : </b>" + messageData.message + "</p>");
        } else {
            $('#chatHistory').append("<p align='left'><b>" + messageData.username + " : </b>" + messageData.message + "</p>");
        }
    })

    socket.on('private-message', function(messageData) {
        if (messageData.from === username) {
            $('#chatHistory').append("<p align='right'><b>You sent a private message to " + messageData.to + ": </b>" + messageData.message + "</p>");
        } else {
            $('#chatHistory').append("<p align='left'><b>" + messageData.from + " sent you a private message: </b>" + messageData.message + "</p>");
        }
    });

});
