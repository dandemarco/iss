let url = 'https://api.wheretheiss.at/v1/satellites/25544'

let issLat = document.querySelector('#iss-lat')
let issLong = document.querySelector('#iss-long')

let update = 10000  //10 seconds

let maxFailedAttempts = 3
let issMarker
let icon = L.icon({
    iconUrl: `iss.png`,
    iconSize: [50, 50],
    iconAnchor: [25, 25]
})

let map = L.map('iss-map').setView([0, 0], 1)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

iss(maxFailedAttempts)   //call iss function once to start


//Fetch returns a promise. If the promise is fulfilled, 'then' is called. If the promise isn't fulfilled, 'catch' is called

function iss(attempts) {

    if (attempts <= 0) {
        alert('Attempted to contact server, failed after several attempts')
        return
    }

    fetch(url).then( res => {        //'res' is a variable we made to store the json response
        return res.json()           //process response into json
    }).then( (issData) => {         //put the JSON data into new variable 'issData'
        console.log(issData)
        let lat = issData.latitude
        let long = issData.longitude
        issLat.innerHTML = lat
        issLong.innerHTML = long

        //create marker if it doesn't exist
        //move marker if it does exist

        if (!issMarker) {
            //create marker
            issMarker = L.marker([lat, long], {icon: icon}).addTo(map)
        } else {
            issMarker.setLatLng([lat, long])
        }

        let timeElement = document.querySelector('#time')
        let date = Date()
        timeElement.innerHTML = `Last update: ${date}`

    }).catch( (err) => {
        attempts--
        console.log('ERROR!', err)
    })
    .finally( () => {
        //finally runs whether the fetch worked or failed
        //Call the iss function after a delay of update milliseconds to update the location
        setTimeout(iss, update, attempts)
    })
}