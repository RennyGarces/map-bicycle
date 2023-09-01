'use strict';
//working with leaflet API
/* https://leafletjs.com/ */
/* ========================================= */

/* ===================working with customizablçe icons */
//https://leafletjs.com/examples/custom-icons/

/* =====================variables =======================*/
const form = document.querySelector('.form'); //take the form summit
const inputKm = document.querySelector('.form__input--distance'); //take input distance
const inputTime = document.querySelector('.form__input--time');
const inputElevation = document.querySelector('.form__input--elevation');
const information = document.querySelector('.information');
const animation = document.querySelector('.animation');
const sidebar = document.querySelector('.sidebar');
let mapEvent; // store the object latitude and longitude in global variavel
let map;

/* ======================================================== */

const bicycleIcon = L.icon({
  iconUrl: 'img/bicycle.png',
  shadowUrl: 'img/bicycle-shadow.png',

  iconSize: [75, 40], // size of the icon
  shadowSize: [90, 25], // size of the shadow
  iconAnchor: [30, 74], // point of the icon which will correspond to marker's location
  shadowAnchor: [25, 62], // the same for the shadow
  popupAnchor: [15, -90], // point from which the popup should open relative to the iconAnchor
});

if (navigator.geolocation)
  //checking if we can get the location
  navigator.geolocation.getCurrentPosition(
    //taking the current location(we need to allow the browser to know our location)
    function (position) {
      //position access to the object where the latitude and longitude is locate
      const latitude = position.coords.latitude; //taking latitude
      const { longitude } = position.coords; //taking longitude thru destructuring
      const coords = [latitude, longitude]; //convert the elements in an array
      //L is a method of the Api we passing our div map
      //passing array coords
      //passing the number 13 it's the zoom in the map when the windows is opening
      map = L.map('map').setView(coords, 15);
      //=====>we can check all method available in console.log(map) object inheret all methods of the API;
      //adding type of map (layer) we searching in google
      L.tileLayer(
        'https://dev.{s}.tile.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png'
      ).addTo(map);
      /* ================================================================= */
      //we need to take the longitude and latitude when we click the map
      // we will use (on) method is like addEventListener in the API
      map.on('click', function (TakeEvent) {
        mapEvent = TakeEvent;
        //mapEvent taking latlng: v {lat: -3.337953961416472, lng: -26.015625}
        const { lat, lng } = mapEvent.latlng; //destructuring lat and lng of latlng

        /* =========when the user click whe remove the clast hidden of the form */
        form.classList.remove('hidden');
        information.classList.add('hidden');
        animation.classList.add('hidden');
        sidebar.classList.add('sidebar--columns');
        inputKm.focus(); //focus in the km input when the user click the map
        /* ============================================================ */
        /* ============================================================================ */
      });
      L.marker(coords, { icon: bicycleIcon })
        .addTo(map)
        .bindPopup('you are here')
        .openPopup();
    },
    function () {
      //(navigator.geolocation.getCurrentPosition)working with two function
      //the second function we pass the alert option when the location
      //does not work properly
      alert('please allow as check your current position');
    }
  );

form.addEventListener('submit', function (e) {
  e.preventDefault();
  inputKm.value = inputTime.value = inputElevation.value = '';
  const { lat, lng } = mapEvent.latlng; //destructuring lat and lng of latlng
  /* ============================================================================ */
  //editing the poppup costumizable
  //create variable and passing L.popip method to costumize our poppup
  const popupMarket = L.popup({
    autoClose: false,
    closeOnClick: false,
    className: '.leaflet-popup',
    maxWidth: 100,
  }); //option the edit style to the popup
  //we added a class in css

  L.marker([lat, lng] /* passing latlng */, {
    icon: bicycleIcon /* ADDING ICONS */,
    keyboard: true,
  })
    .addTo(map)
    .bindPopup(popupMarket /* passing L.popup */)
    .setPopupContent('hi' /* adding content from html in the popup market */)
    .openPopup();
  /* =============== */
});
