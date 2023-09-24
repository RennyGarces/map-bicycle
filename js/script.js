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
const nameBtn = document.querySelector(".form-button");
const workoutContainer = document.querySelector(".workout__container");
const resetBtn = document.querySelector(".reset");
const divtouchMap = document.querySelector(".info__touch");
const mapClick = document.getElementById("map");
const formName = document.querySelector(".form__row");

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
  numbers = 1;
  #name;
  #map;
  #mapEvent;
  #coords;
  elementhtmlMap;
  marker = [];
  circle = [];
  control = [];
  #dataUserCopy = [];

  constructor() {
    this._getDataUser();
    this._getGeolocation();

    form.addEventListener("submit", this._SummitFunction.bind(this));
    workoutContainer.addEventListener(
      "click",
      this._moveMapPosition.bind(this)
    );
    resetBtn.addEventListener("click", this.reset.bind(this));
    nameBtn.addEventListener("submit", function (e) {
      e.preventDefault();
      if (nameUser.value.match(/^[A-Za-z]+$/) && nameUser.value.length > 2) {
        mapClick.style.pointerEvents = "auto";
        formName.classList.add("hidden");
        const html = `<p class="banner__user touch_map"> ${
          nameUser.value[0].toUpperCase() +
          nameUser.value.slice(1, nameUser.value.length).toLowerCase()
        }
        touch the map</p>`;
        divtouchMap.insertAdjacentHTML("beforeend", html);
      } else {
        alert(`${nameUser.value} is a invalid name, try again!`);
        nameUser.value = "";
      }
    });
  }
  /* ================methods==================== */

  _getGeolocation() {
    navigator.geolocation.getCurrentPosition(
      this._getPosition.bind(this),
      this._gpsAccess()
    );
  }

  _getPosition(position) {
    bannerUser.classList.add("hidden");
    this.bicycleIcon = L.icon({
      iconUrl: "img/bicycle.png",
      shadowUrl: "img/bicycle-shadow.png",

      iconSize: [75, 40],
      shadowSize: [90, 25],
      iconAnchor: [40, 44],
      shadowAnchor: [25, 62],
      popupAnchor: [15, -90],
    });

    const latitude = position.coords.latitude;
    const { longitude } = position.coords;
    this.#coords = [latitude, longitude];
    //{scrollWheelZoom:false} prenvent default scroll up from the map
    this.#map = L.map("map").setView(this.#coords, 15);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
      this.#map
    );

    this.#map.on("click", this._modifyClasslistDom.bind(this));

    this.formUser.forEach((element) => this._createMarkerPosition(element));
    if (this.formUser.length > 0) {
      this._modifyClasslistDom();
      mapClick.style.pointerEvents = "auto";
      form.classList.add("hidden");
      animation.classList.remove("hidden");
    }
  }

  /* ============================== */
  _modifyClasslistDom(TakeEvent) {
    if (nameUser.value.match(/^[A-Za-z]+$/) && nameUser.value.length > 2) {
      this.#name =
        nameUser.value[0].toUpperCase() +
        nameUser.value.slice(1, nameUser.value.length).toLowerCase();
    }

    this._getTime();

    this.#mapEvent = TakeEvent;
    inputKm.focus();
    L.marker(this.#coords, { icon: this.bicycleIcon })
      .addTo(this.#map)
      .bindPopup(`${this.#name}`)
      .openPopup();

    L.circle(this.#coords, {
      color: " #dbce18",
      fillColor: " #dbce18",
      fillOpacity: 0.6,
      radius: 80,
    }).addTo(this.#map);
    this._modifyPresentation();
    form.classList.remove("hidden");
    animation.classList.add("hidden");
  }

  _modifyPresentation() {
    information.classList.add("hidden");

    divtouchMap.classList.add("hidden");
    sidebar.classList.add("sidebar--columns");
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
      formUserObject = new Bicycle(
        [lat, lng],
        distance,
        time,
        elevation,
        this.#name
      );
      this.formUser.push(formUserObject); //array formUser
      this.#dataUserCopy.push(formUserObject);
      this._HtmlFormUser(formUserObject); //passing to create html code
      this._createMarkerPosition(formUserObject); //passing object with the data
    }
    //clean fills output;
    this._HideFormCleanInputs();
    this._setlocalStorage();
  }
  _alertMessage(inputMessage) {
    alert(`${inputMessage}`);
  }
  _gpsAccess() {
    alert("please allow as check your current position");
  }
  _createMarkerPosition(ObjectBicycle) {
    this.numbers++;

    this.#name = ObjectBicycle.name;
    const popupMarket = L.popup({
      autoClose: false,
      closeOnClick: false,
      className: ".leaflet-popup",
      maxWidth: 100,
    });

    const marker = L.marker(ObjectBicycle.coords, {
      icon: this.bicycleIcon,
      keyboard: true,
    })
      .addTo(this.#map)
      .bindPopup(popupMarket)
      .setPopupContent(
        `${ObjectBicycle.name} location <span class="numbers"> ${this.numbers}</span>`
      )
      .openPopup();

    this.marker.push(marker);

    const circle = L.circle(ObjectBicycle.coords, {
      color: "#6f6ec9d7",
      fillColor: "#6f6ec9d7",
      fillOpacity: 0.6,
      radius: 100,
    }).addTo(this.#map);
    this.circle.push(circle);
  }
  _HtmlFormUser(ObjectBicycle) {
    const html = `
    
      <li class="workout" data-id=${ObjectBicycle.id}>
         <div class="workout__details">
          <span class="workout__icon"><img src="/img/bike-form.png"/></span>
          <span class="workout__value">${ObjectBicycle.distance}</span>
          <span class="workout__unit">km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon"><img src="/img/clock-form.png"/></span>
          <span class="workout__value">${ObjectBicycle.duration}</span>
          <span class="workout__unit">min</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon"><img src="/img/km-form.png"/></span>
          <span class="workout__value">${ObjectBicycle.speed.toFixed(1)}</span>
          <span class="workout__unit">km/h</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon"><img src="/img/mountain-form.png"/></span>
          <span class="workout__value">${ObjectBicycle.elevation.toFixed(
            1
          )}</span>
          <span class="workout__unit">m</span>
        </div>
      </li>
    `;
    workoutContainer.insertAdjacentHTML("beforeend", html);
  }
  _getTime() {
    const date = new Date();
    const htmlTimes = `<span class="banner__user">${date.toDateString()}</span>`;
    return header.insertAdjacentHTML("afterend", htmlTimes);
  }
  _HideFormCleanInputs() {
    inputKm.value = inputTime.value = inputElevation.value = "";
    form.classList.add("hidden");
    workoutContainer.classList.remove("hidden");
  }

  /* ------------------------------------------------------------------ */
  _moveMapPosition(htmlClasses) {
    this.elementhtmlMap = htmlClasses.target.closest(".workout");
    if (!this.elementhtmlMap) return;

    const checkingUsermap = this.formUser.find(
      (userArr) => userArr.id === this.elementhtmlMap.dataset.id //checking id html
    );
    if (!this.elementhtmlMap.dataset.route) {
      this._addRoutingMap(checkingUsermap);
    }
    this.elementhtmlMap.classList.add("workout__background");
    resetBtn.classList.remove("hidden");
    const workout = document.querySelectorAll(".workout");
    workout.forEach((el) => {
      if (el !== this.elementhtmlMap) {
        el.classList.remove("workout__background");

        this.#map.setView(checkingUsermap.coords, 15);
      } else {
        this.#map.setView(checkingUsermap.coords, 17);
      }
    });

    this.elementhtmlMap.setAttribute("data-route", "route added");
  }
  _addRoutingMap(checkingUsermap) {
    let control = L.Routing.control({
      waypoints: [
        L.latLng(this.#coords[0], this.#coords[1]),
        L.latLng(checkingUsermap.coords),
      ],

      createMarker: function () {
        return null;
      },
      fitSelectedRoutes: false,
      routeWhileDragging: false,
      addWaypoints: false,

      lineOptions: {
        styles: [{ color: "#6f6ec9d7", opacity: 1, weight: 5 }],
      },
    }).addTo(this.#map);

    this.control.push(control);
  }
  /* --------------------------------------------------------------- */
  _setlocalStorage() {
    localStorage.setItem("dataUser", JSON.stringify(this.#dataUserCopy));
  }
  _getDataUser() {
    const dataUser = JSON.parse(localStorage.getItem("dataUser"));
    if (!dataUser) return;

    this.formUser = dataUser;
    this.formUser.forEach((element) => this._HtmlFormUser(element));
  }
  reset() {
    resetBtn.classList.add("hidden");
    this.numbers = 1;
    this.formUser.forEach((userArr, i) => {
      if (userArr.id === this.elementhtmlMap.dataset.id) {
        this.#dataUserCopy.splice(i, 1);
        this.#map.removeControl(this.control[i]);
        this.#map.removeLayer(this.circle[i]);
        this.marker[i].remove();
      }
    });
    localStorage.setItem("dataUser", JSON.stringify(this.#dataUserCopy));
    this.elementhtmlMap.remove();
    const workout = document.querySelectorAll(".workout");
    if (workout.length === 0) {
      form.classList.remove("hidden");
      this.formUser = [];
      this.control = [];
      this.circle = [];
      this.marker = [];
      this.#dataUserCopy = [];
      this._removeALL();
    }
  }
  _removeALL() {
    localStorage.removeItem("dataUser");
    // location.reload();
  }
}

//  A method is a function that belongs to an object and can be
//  called using the dot notation, such as object.method(). However, a method
// is not executed until it is invoked by an object.
//That’s why we need to create a new object from the class
const appBicycleObject = new AppBicycle();
///////////////////////////////////////////
//localStorage.setItem("dataUser",JSON.stringify(this,formUser));
// JSON.PARSE(localStorage.getItem("dataUser"))
