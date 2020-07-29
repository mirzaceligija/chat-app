const socket = io()

//Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

socket.on('message', (message)=>{
    console.log(message)
    const html = '<p> <span class="message__meta">' + message.username + ' ' + moment(message.createdAt).format('H:mm') + '</span>' + message.text + '</p>'
    $messages.insertAdjacentHTML('beforeend', html)
})


socket.on('roomData', ({ room, users }) =>{
    document.querySelector('.room-name').innerHTML = room
    var onlineUsers = document.querySelector('.user-list')

    for(var i=0; i<users.length; i++){
        onlineUsers.innerHTML += "<li>" + users[i].username + "<li>"
    }

    console.log(users)
    console.log(users[0].username)
})

socket.on('locationMessage', (message)=>{
    console.log(message)
    const html = '<p> <span class="message__meta">' + message.username + ' ' + moment(message.createdAt).format('H:mm') + ' </span> <a href="'+ message.url + ' " target=_blank"> My current location </a> </p>'
    $messages.insertAdjacentHTML('beforeend', html)
})

$messageForm.addEventListener('submit', (e)=>{
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) =>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if(error){
            return console.log(error)
        }
        console.log('Message delivered!', message)
    })
})

$sendLocationButton.addEventListener('click', () =>{
    if(!navigator.geolocation){
        return alert('Your browser doesn\'t support geolocation !')
    }
    
    $sendLocationButton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) =>{
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location shared!')
        })
    })
})

socket.emit('join', {username, room}, (error) => {
    if(error) {
        alert(error)
        location.href="/"
    }
})