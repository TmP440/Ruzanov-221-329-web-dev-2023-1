/* eslint-disable max-len */
/* eslint-disable no-use-before-define */
const api_key = '8c41fc00-75c5-41e6-aa6d-bff1d18e53d0';

let currentPage = 1;
let routesOnPage = 5;
let selectedRouteID;
let selectedGuideID;
let routes;
let filteredRoutes;
let guides;
let filteredGuides;

let weekends = [
    "01-01", "01-02", "01-03", "01-04", "01-05", "01-06", "01-07", "01-08",
    "02-23",
    "03-08",
    "04-29", "04-30",
    "05-01", "05-09", "05-10",
    "06-12",
    "11-04",
    "12-30", "12-31"
];

function setupRoutesNameFilter() {
    setupRoutesObjectFilter();
    const searchedName = document.getElementById("routeName").value;
    filteredRoutes = routes.filter(route => {
        return route.name.toString().includes(searchedName);
    });
    currentPage = 1;
    setupPagination();
    setupRoutesTable();
}

function setupRoutesObjectFilter() {
    let selector = document.getElementById("routeSelector");
    let selectedOption = selector.options[selector.selectedIndex];

    currentPage = 1;
    if (selectedOption.value === "Не выбрано") {
        filteredRoutes = routes;
    } else {
        filteredRoutes = routes.filter(route => {
            return route.mainObject.toString().includes(selectedOption.value);
        });
    }
    setupPagination();
    setupRoutesTable();
}

function setupGuidesSelector() {
    let selector = document.getElementById("languageSelector");
    selector.innerHTML = '';
    selector.appendChild(makeOption("Не выбран"));
    let uniqueObjects = uniqueLanguagesSet();
    uniqueObjects.forEach(name => {
        selector.appendChild(makeOption(name));
    });
}

function uniqueLanguagesSet() {
    const languagesSet = new Set();
    for (let i = 0; i < guides.length; i++) {
        languagesSet.add(guides[i].language.toString());
    }
    return languagesSet;
}

function setupGuidesTable() {
    let tbody = document.getElementById("guides");
    tbody.innerHTML = "";

    for (let i = 0; i < filteredGuides.length; i++) {
        let row = tbody.insertRow();

        let photo = row.insertCell(0);
        photo.innerHTML = '<img src="img/gigachad.jpg" width="50em" height="50em" alt="profile">';

        let name = row.insertCell(1);
        name.innerText = filteredGuides[i].name.toString();

        let language = row.insertCell(2);
        language.innerText = filteredGuides[i].language.toString();

        let workExperience = row.insertCell(3);
        workExperience.innerText = filteredGuides[i].workExperience.toString();

        let pricePerHour = row.insertCell(4);
        pricePerHour.innerText = filteredGuides[i].pricePerHour.toString();

        let cellButton = row.insertCell(5);
        let button = document.createElement("button");
        button.type = "button";
        button.className = "btn btn-dark";
        button.setAttribute("data-bs-toggle", "modal");
        button.setAttribute("data-bs-target", "#orderModal");
        button.textContent = "Выбрать";
        button.setAttribute("guide-id", filteredGuides[i].id);
        button.addEventListener("click", chooseGuideButtonClick);
        cellButton.appendChild(button);
    }
}

function clearModalFields() {
    document.getElementById("routeDate").value = "";
    document.getElementById("routeTime").value = "";
    document.getElementById("routeDuration").value = "1";
    document.getElementById("routeDate").value = "";
    document.getElementById("peopleCount").value = "1";
    document.getElementById("firstCheckBox").checked = "";
    document.getElementById("secondCheckBox").checked = "";
}

function setupModalFields() {
    let routeName, guideName;
    routes.forEach(route =>{
        if (route.id == selectedRouteID) {
            routeName = route.name;
        }
    });

    guides.forEach(guide =>{
        if (guide.id == selectedGuideID) {
            guideName = guide.name;
        }
    });
    document.getElementById("selectedGuideName").innerText = guideName;
    document.getElementById("selectedRouteName").innerText = routeName;
}

function chooseGuideButtonClick() {
    selectedGuideID = event.target.getAttribute("guide-id");
    clearModalFields();
    setupModalFields();
    calculateTotalPrice();
}

function checkPeopleCount() {
    if (parseInt(document.getElementById("peopleCount").value) > 10) {
        document.getElementById("secondCheckBox").disabled = true;
        document.getElementById("secondCheckBox").checked = "";
    } else {
        document.getElementById("secondCheckBox").disabled = false;
    }
}

function calculateTotalPrice() {
    let amount = 0;

    let firstMultiplicator = 1;
    let secondMultiplicator = 1.15;
    if (document.getElementById("firstCheckBox").checked) {
        firstMultiplicator = 0.85;
    }

    let routeTime = document.getElementById("routeTime").value.split(":");
    let routeTimeHours = parseInt(routeTime[0]);
    let routeTimeMinutes = parseInt(routeTime[1]);
    let morningPlus = 0, eveningPlus = 0;
    if (routeTimeHours >= 9 && routeTimeHours <= 12) {
        if (!(routeTimeHours === 12 && routeTimeMinutes > 0)) {
            morningPlus = 400;
        }
    }
    if (routeTimeHours >= 20 && routeTimeHours <= 23) {
        if (!(routeTimeHours === 23 && routeTimeMinutes > 0)) {
            eveningPlus = 1000;
        }

    }
    let weekendMultiplicator = 1;

    let date = document.getElementById("routeDate").value;
    weekends.forEach(weekend=>{
        if (weekend.toString().includes(date)) {
            weekendMultiplicator = 1.5; 
        }

    });
    let peopleCount = parseInt(document.getElementById("peopleCount").value);
    let peoplePlus = 0;
    if (peopleCount > 5 && peopleCount <= 10) {
        peoplePlus = 1000;
        secondMultiplicator = 1.25;
    } else if (peopleCount > 10 && peopleCount <= 20) {
        peoplePlus = 1500;

    }
    let selector = document.getElementById("routeDuration");

    let routeDuration = parseInt(selector.options[selector.selectedIndex].value);
    let pricePerHour = 0;
    guides.forEach(guide =>{
        if (guide.id == selectedGuideID) {
            pricePerHour = parseInt(guide.pricePerHour);
        }
    });

    amount = pricePerHour * routeDuration * weekendMultiplicator + morningPlus + eveningPlus + peoplePlus;
    amount *= firstMultiplicator;
    if (document.getElementById("secondCheckBox").checked) {
        amount *= secondMultiplicator;
    }

    document.getElementById("totalPrice").innerText = Math.ceil(amount).toString();
}

function setupGuideLanguageFilters() {
    let selector = document.getElementById("languageSelector");
    let selectedOption = selector.options[selector.selectedIndex];

    if (selectedOption.value === "Не выбран") {
        filteredGuides = guides;
    } else {
        filteredGuides = guides.filter(guide => {
            return guide.language.toString() === selectedOption.value;
        });
    }
    setupGuidesTable();
}

function setupGuideExpFilters() {
    let maxExp = parseInt(document.getElementById("expMaxValue").value);
    let minExp = parseInt(document.getElementById("expMinValue").value);
    if (!isNaN(minExp) && isNaN(maxExp)) {
        filteredGuides = filteredGuides.filter(guide => {
            return parseInt(guide.workExperience) >= minExp;
        });
    } else if (isNaN(minExp) && !isNaN(maxExp)) {
        filteredGuides = filteredGuides.filter(guide => {
            return parseInt(guide.workExperience) <= maxExp;
        });
    } else if (!isNaN(minExp) && !isNaN(maxExp)) {
        filteredGuides = filteredGuides.filter(guide => {
            return parseInt(guide.workExperience) <= maxExp && parseInt(guide.workExperience) >= minExp;
        });
    }
    setupGuidesTable();
}

function setupRoutesTable() {
    let tbody = document.getElementById("routes");
    tbody.innerHTML = "";

    for (let i = (currentPage - 1) * routesOnPage; i < currentPage * routesOnPage; i++) {
        if (i < routes.length) {
            if (filteredRoutes[i] !== undefined) {
                let row = tbody.insertRow();

                let name = row.insertCell(0);
                name.innerText = filteredRoutes[i].name.toString();

                let description = row.insertCell(1);
                description.innerText = filteredRoutes[i].description.toString();

                let mainObject = row.insertCell(2);
                mainObject.innerText = filteredRoutes[i].mainObject.toString();

                let buttonPlace = row.insertCell(3);
                let button = document.createElement("button");
                button.type = "button";
                button.className = "btn btn-dark";
                button.textContent = "Выбрать";
                button.setAttribute("route-id", filteredRoutes[i].id);
                if (parseInt(selectedRouteID) === parseInt(filteredRoutes[i].id)) {
                    row.className = "table-danger";
                }
                button.addEventListener("click", chooseRouteButtonClick);
                buttonPlace.appendChild(button);
            }
        }
    }
}

function loadGuides(id) {
    const url = `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes/${id}/guides?api_key=${api_key}`;

    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);

    xhr.onload = function () {
        guides = JSON.parse(this.response);
        filteredGuides = guides;
        setupGuidesTable();
        setupGuidesSelector();
    };

    xhr.send();
}

function chooseRouteButtonClick() {
    selectedRouteID = event.target.getAttribute("route-id");
    let routesInTable = document.getElementById("routes").children;
    for (let i = 0; i < routesInTable.length; i++) {
        routesInTable[i].className = "";
    }
    event.target.parentNode.parentNode.className = "table-danger";
    document.getElementById("guidesBlock").style.display = 'block';
    loadGuides(selectedRouteID);
}

function createPaginationButton(content) {
    const li = document.createElement('li');
    li.classList.add('page-item');
    const a = document.createElement('a');
    a.classList.add('page-link');
    a.href = '#pagination';
    a.innerHTML = content;
    li.appendChild(a);
    return li;
}

function setupPagination() {
    const totalPages = Math.ceil(filteredRoutes.length / routesOnPage);
    const pagination = document.querySelector('#pagination');
    pagination.innerHTML = '';
    let prev = createPaginationButton('<span aria-hidden="true">&laquo;</span>');
    prev.onclick = function () {
        currentPage = Math.max(1, currentPage - 7);
        setupPagination();
    };
    pagination.appendChild(prev);

    for (let i = currentPage; i <= Math.min(totalPages, currentPage + 7); i++) {
        let item = createPaginationButton(i);
        item.onclick = function () {
            currentPage = i;
            setupRoutesTable();
        };
        pagination.appendChild(item);
    }
    let next = createPaginationButton('<span aria-hidden="true">&raquo;</span>');
    next.onclick = function () {
        if (currentPage + 7 < totalPages - 1) {
            currentPage = currentPage + 7;
            setupPagination();
        }
    };
    pagination.appendChild(next);
}

function setupLanguageSelector() {
    let selector = document.getElementById("routeSelector");
    selector.innerHTML = '';
    selector.appendChild(makeOption("Не выбрано"));
    let uniqueObjects = uniqueObjectsSet();
    uniqueObjects.forEach(name => {
        selector.appendChild(makeOption(name));
    });
}

function uniqueObjectsSet() {
    const objectsSet = new Set();
    for (let i = 0; i < routes.length; i++) {
        let objects = routes[i].mainObject.toString().split("-");
        for (let j = 0; j < objects.length; j++) {
            if (objects[j] !== undefined && objects[j].length > 4 && objects[j].length < 25) {
                objectsSet.add(objects[j]);
            }
        }
    }
    return objectsSet;
}

function makeOption(content) {
    const option = document.createElement('option');
    option.value = content;
    option.text = content;
    return option;
}

function loadRoutes() {
    const url = `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes?api_key=${api_key}`;

    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);

    xhr.onload = function () {
        routes = JSON.parse(this.response);
        filteredRoutes = routes;
        setupPagination();
        setupRoutesTable();
        setupLanguageSelector();
    };
    xhr.send();
}

function buildOrderData() {
    let order = new FormData();

    const isFirstChecked = document.getElementById("firstCheckBox").checked ? 1 : 0;
    const isSecondChecked = document.getElementById("secondCheckBox").checked ? 1 : 0;

    order.append("guide_id", selectedGuideID);
    order.append("route_id", selectedRouteID);
    order.append("date", document.getElementById("routeDate").value.toString());
    order.append("time", document.getElementById("routeTime").value.toString());
    order.append("duration", document.getElementById("routeDuration").value.toString());
    order.append("persons", document.getElementById("peopleCount").value.toString());
    order.append("price", document.getElementById("totalPrice").innerText.toString());
    order.append("optionFirst", isFirstChecked.toString());
    order.append("optionSecond", isSecondChecked.toString());

    return order;
}

function showAlert(msg, type) {
    const alertPlaceholder = document.getElementById('placeForAlert');
    const appendAlert = (message, type) => {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('');

        alertPlaceholder.append(wrapper);

        setTimeout(() => {
            wrapper.remove();
        }, 5000);
    };
    appendAlert(msg, type);
}

function confirmOrderClick() {
    const url = `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders?api_key=${api_key}`;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.responseType = "json";

    let order = buildOrderData();

    xhr.onload = function () {
        if (xhr.status === 200) {
            showAlert("Рандеву назначено! :)", "light");
        } else {
            showAlert("Ошибка при оформлении: " + this.response.error, "dark");
        }
    };

    xhr.send(order);
}

window.onload = function () {
    loadRoutes();
};