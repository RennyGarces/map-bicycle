"use strict";
//working with leaflet API
/* https://leafletjs.com/ */
/* ========================================= */

/* ===================working with customizablçe icons */
//https://leafletjs.com/examples/custom-icons/

/* =====================variables =======================*/
const header = document.querySelector("header");
const form = document.querySelector(".form"); //take the form summit
const inputKm = document.querySelector(".form__input--distance"); //take input distance
const inputTime = document.querySelector(".form__input--time");
const inputElevation = document.querySelector(".form__input--elevation");
const information = document.querySelector(".information");
const animation = document.querySelector(".animation");
const sidebar = document.querySelector(".sidebar");
const bannerUser = document.querySelector(".banner__user");
const nameUser = document.getElementById("name");

//let mapEvent, map; // store the object latitude and longitude in global variavel;

/* ======================================================== */
//bicycle icon =
// const bicycleIcon = L.icon({
//   iconUrl: "img/bicycle.png",
//   shadowUrl: "img/bicycle-shadow.png",

//   iconSize: [75, 40], // size of the icon
//   shadowSize: [90, 25], // size of the shadow
//   iconAnchor: [30, 74], // point of the icon which will correspond to marker's location
//   shadowAnchor: [25, 62], // the same for the shadow
//   popupAnchor: [15, -90], // point from which the popup should open relative to the iconAnchor
// });

// if (navigator.geolocation)
//   //checking if we can get the location
//   navigator.geolocation.getCurrentPosition(
//     //taking the current location(we need to allow the browser to know our location)
//     function (position) {
//       //position access to the object where the latitude and longitude is locate
//       const latitude = position.coords.latitude; //taking latitude
//       const { longitude } = position.coords; //taking longitude thru destructuring
//       const coords = [latitude, longitude]; //convert the elements in an array
//       //L is a method of the Api we passing our div map
//       //passing array coords
//       //passing the number 13 it's the zoom in the map when the windows is opening
//       map = L.map("map").setView(coords, 15);
//       //=====>we can check all method available in console.log(map) object inheret all methods of the API;
//       //adding type of map (layer) we searching in google
//       L.tileLayer(
//         "https://dev.{s}.tile.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png"
//       ).addTo(map);
//       /* ================================================================= */
//       //we need to take the longitude and latitude when we click the map
//       // we will use (on) method is like addEventListener in the API
//       map.on("click", function (TakeEvent) {
//         mapEvent = TakeEvent;
//         //mapEvent taking latlng: v {lat: -3.337953961416472, lng: -26.015625}
//         const { lat, lng } = mapEvent.latlng; //destructuring lat and lng of latlng

//         /* =========when the user click whe remove the clast hidden of the form */
//         form.classList.remove("hidden");
//         information.classList.add("hidden");
//         animation.classList.add("hidden");
//         sidebar.classList.add("sidebar--columns");
//         inputKm.focus(); //focus in the km input when the user click the map
//         /* ============================================================ */
//         /* ============================================================================ */
//       });
//       L.marker(coords, { icon: bicycleIcon })
//         .addTo(map)
//         .bindPopup("you are here")
//         .openPopup();
//     },
//     function () {
//       //(navigator.geolocation.getCurrentPosition)working with two function
//       //the second function we pass the alert option when the location
//       //does not work properly
//       alert("please allow as check your current position");
//     }
//   );

// form.addEventListener("submit", function (e) {
//   e.preventDefault();
//   inputKm.value = inputTime.value = inputElevation.value = ""; //clear input fornm when the user hit enter
//   const { lat, lng } = mapEvent.latlng; //destructuring lat and lng of latlng
//   /* ============================================================================ */
//   //editing the poppup costumizable
//   //create variable and passing L.popip method to costumize our poppup
//   const popupMarket = L.popup({
//     autoClose: false,
//     closeOnClick: false,
//     className: ".leaflet-popup",
//     maxWidth: 100,
//   }); //option the edit style to the popup
//   //we added a class in css

//   L.marker([lat, lng] /* passing latlng */, {
//     icon: bicycleIcon /* ADDING ICONS */,
//     keyboard: true,
//   })
//     .addTo(map)
//     .bindPopup(popupMarket /* passing L.popup */)
//     .setPopupContent("hi" /* adding content from html in the popup market */)
//     .openPopup();
//   /* =============== */
// });

/////////////////////classes object creation/////////////////////////
class Workout {
  id = (Date.now() + "").slice(-15);

  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }
}

class Bicycle extends Workout {
  constructor(coords, distance, duration, elevation, name) {
    super(coords, distance, duration);
    this.elevation = elevation;
    this.name = name;
    this.speedUser(); // speed in km
  }
  speedUser() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

////////////////////////classs arquitecture///////////////////
class AppBicycle {
  formUser = []; //to push the form
  bicycleIcon;
  numbers = 0;
  #name;
  #map;
  #mapEvent;
  #coords;
  constructor() {
    form.addEventListener("submit", this._SummitFunction.bind(this));
    this._getGeolocation();
  }
  _getGeolocation() {
    navigator.geolocation.getCurrentPosition(
      this._getPosition.bind(this),

      this._gpsAccess()
    );
  }

  /* ============================ */
  _getPosition(position) {
    bannerUser.classList.add("hidden");
    this.bicycleIcon = L.icon({
      iconUrl: "img/bicycle.png",
      shadowUrl: "img/bicycle-shadow.png",

      iconSize: [75, 40],
      shadowSize: [90, 25],
      iconAnchor: [30, 74],
      shadowAnchor: [25, 62],
      popupAnchor: [15, -90],
    });
    const latitude = position.coords.latitude;
    const { longitude } = position.coords;
    this.#coords = [latitude, longitude];
    //{scrollWheelZoom:false} prenvent default scroll up from the map
    this.#map = L.map("map").setView(this.#coords, 15);

    L.tileLayer(
      "https://dev.{s}.tile.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png"
    ).addTo(this.#map);

    this.#map.on("click", this._modifyClasslistDom.bind(this));
  }

  /* ============================== */
  _modifyClasslistDom(TakeEvent) {
    if (nameUser.value.match(/^[A-Za-z]+$/)) {
      //check if it is a string name
      this.#name = nameUser.value;
      this._getTime();
      this.#mapEvent = TakeEvent;
      form.classList.remove("hidden");
      information.classList.add("hidden");
      animation.classList.add("hidden");
      sidebar.classList.add("sidebar--columns");
      inputKm.focus();
      L.marker(this.#coords, { icon: this.bicycleIcon })
        .addTo(this.#map)
        .bindPopup(`${this.#name}`)
        .openPopup();
    } else {
      this._alertMessage(`Please type your name `);
    }
  }
  /* ================================= */
  ///////////// create objects with the user's input////////////////////
  _SummitFunction(e) {
    e.preventDefault();
    //inputs////////////////////////////////////////////////////
    let { lat, lng } = this.#mapEvent.latlng;
    let distance = +inputKm.value;
    let time = +inputTime.value;
    let elevation = +inputElevation.value;
    let formUserObject; //store the object
    ///////////////////////////////////////////////////////////
    //check inputs
    const checkNumber = (array) =>
      array.every((el) => {
        if (Number.isFinite(el) && el > 0) return el;
      });
    if (!checkNumber([distance, time, elevation])) {
      this._alertMessage(`Invalid input`);
    } else {
      this.numbers += 1;
      formUserObject = new Bicycle(
        [lat, lng],
        distance,
        time,
        elevation,
        this.#name
      );
      this.formUser.push(formUserObject); //array formUser
      this._HtmlFormUser(formUserObject); //passing to create html code
      this._createMarkerPosition(formUserObject, this.numbers); //passing object with the data
    }
    //clean fills output;
    this._HideFormCleanInputs();
    ////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////
  }
  _alertMessage(inputMessage) {
    alert(`${inputMessage}`);
  }
  _gpsAccess() {
    alert("please allow as check your current position");
  }
  _createMarkerPosition(ObjectBicycle, number) {
    const popupMarket = L.popup({
      autoClose: true,
      closeOnClick: false,
      className: ".leaflet-popup",
      maxWidth: 100,
    });

    L.marker(ObjectBicycle.coords, {
      icon: this.bicycleIcon,
      keyboard: true,
    })
      .addTo(this.#map)
      .bindPopup(popupMarket)
      .setPopupContent(
        `${ObjectBicycle.name} it is your path number
 ${number}`
      )
      .openPopup();
    console.log(ObjectBicycle);
  }
  _HtmlFormUser(ObjectBicycle) {
    const html = `
    <div class="workout__container">
      <li class="workout" data-id=${ObjectBicycle.id}>
         <div class="workout__details">
          <span class="workout__icon">🚴‍♀️</span>
          <span class="workout__value">${ObjectBicycle.distance}</span>
          <span class="workout__unit">km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⏱</span>
          <span class="workout__value">${ObjectBicycle.duration}</span>
          <span class="workout__unit">min</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${ObjectBicycle.speed.toFixed(1)}</span>
          <span class="workout__unit">km/h</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⛰</span>
          <span class="workout__value">${ObjectBicycle.elevation.toFixed(
            1
          )}</span>
          <span class="workout__unit">m</span>
        </div>
      </li>
    </div>
    `;
    sidebar.insertAdjacentHTML("beforeend", html);
  }
  _getTime() {
    const date = new Date();
    const htmlTimes = `<span class="banner__user">${date.toDateString()}</span>`;
    return header.insertAdjacentHTML("afterend", htmlTimes);
  }
  _HideFormCleanInputs() {
    inputKm.value = inputTime.value = inputElevation.value = "";
    form.classList.add("hidden");
  }
}

//  A method is a function that belongs to an object and can be
//  called using the dot notation, such as object.method(). However, a method
// is not executed until it is invoked by an object.
//That’s why we need to create a new object from the class
const appBicycleObject = new AppBicycle();
///////////////////////////////////////////
