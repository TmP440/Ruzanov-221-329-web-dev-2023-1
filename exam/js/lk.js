/* eslint-disable no-use-before-define */
/* eslint-disable max-len */
const api_key = '8c41fc00-75c5-41e6-aa6d-bff1d18e53d0';

let orders;
let routes;

function loadOrders() {
    const url = `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders?api_key=${api_key}`;

    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);

    xhr.onload = function () {
        orders = JSON.parse(this.response);
        setupOrdersTable();
    };

    xhr.send();
}


function setupOrdersTable() {
    let tbody = document.getElementById("orders");
    tbody.innerHTML = "";

    for (let i = 0; i < orders.length; i++) {
        let row = tbody.insertRow();

        let number = row.insertCell(0);
        let num = i + 1;
        number.innerText = num.toString();

        let route = getRoute(orders[i].route_id);
        let name = row.insertCell(1);
        name.innerText = route.name.toString();


        let date = row.insertCell(2);
        date.innerText = orders[i].date.toString();

        let price = row.insertCell(3);
        price.innerText = orders[i].price.toString();

        let cellButton = row.insertCell(4);
        let buttonLook = makeButton("bi-eye-fill", "orderModal",
            route.id, orders[i].guide_id, orders[i].id, showOrderBtnClick);
        let buttonEdit = makeButton("bi-pencil-fill", "changeModal",
            route.id, orders[i].guide_id, orders[i].id, changeOrderBtnClick);
        let buttonDelete = makeButton("bi-trash-fill", "deleteModal",
            route.id, orders[i].guide_id, orders[i].id, deleteOrderBtnClick);
        cellButton.appendChild(buttonLook);
        cellButton.appendChild(buttonEdit);
        cellButton.appendChild(buttonDelete);
    }
}

function changeOrderData() {
    let order = getOrder(currentOrderID);
    let changedOrder = new FormData();

    let currentDate = document.getElementById("routeDate").value.toString();
    let currentTime = document.getElementById("routeTime").value.toString();
    let currentDuration = document.getElementById("routeDuration").value.toString();
    let currentPersons = document.getElementById("peopleCount").value.toString();
    let currentPrice = document.getElementById("totalPrice").innerText.toString();
    const currentFirstOption = document.getElementById("firstCheckBox").checked ? 1 : 0;
    const currentSecondOption = document.getElementById("secondCheckBox").checked ? 1 : 0;

    if (currentDate !== order.date.toString()) {
        changedOrder.append("date", currentDate);
    }
    if (currentTime !== order.time.toString()) {
        changedOrder.append("time", currentTime);
    }
    if (currentDuration !== order.duration.toString()) {
        changedOrder.append("duration", currentDuration);
    }
    if (currentPersons !== order.persons.toString()) {
        changedOrder.append("persons", currentPersons);
    }
    if (currentPrice !== order.price.toString()) {
        changedOrder.append("price", currentPrice);
    }
    if (currentFirstOption != order.optionFirst) {
        changedOrder.append("optionFirst", currentFirstOption);
    }
    if (currentFirstOption != order.optionSecond) {
        changedOrder.append("optionSecond", currentSecondOption);
    }
    return changedOrder;
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

function changeOrder() {
    const url = `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders/${id}?api_key=${api_key}`;
    let order = changeOrderData();
    console.log(order);

    let xhr = new XMLHttpRequest();
    xhr.open("PUT", url,);
    xhr.responseType = "json";

    xhr.onload = function() {
        if (xhr.status) {
            showAlert("Запись успешна изменена!", "success");
            loadOrders();
        } else {
            showAlert("Ошибка при редактировании: " + this.response.error, "danger");
        }
    };

    xhr.send(order);
}

function deleteOrder(id) {
    const url = `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders/${id}?api_key=${api_key}`;

    let xhr = new XMLHttpRequest();
    xhr.open("DELETE", url);
    xhr.responseType = "json";

    xhr.onload = function () {
        if (xhr.status) {
            showAlert("Запись успешна удалена!", "success");
            loadOrders();
        } else {
            showAlert("Ошибка при удаление: " + this.response.error, "danger");
        }
    };

    xhr.send();
}

function checkPeopleNumber() {
    if (parseInt(document.getElementById("peopleCount").value) > 10) {
        document.getElementById("secondCheckBox").disabled = true;
        document.getElementById("secondCheckBox").checked = "";
    } else {
        document.getElementById("secondCheckBox").disabled = false;
    }
}

function deleteOrderBtnClick() {
    if (confirm("Вы уверены, что хотите удалить данный заказ?")) {
        deleteOrder(event.currentTarget.getAttribute("order-id"));
    }
}

function makeButton(iconClass, modalId, routeId, guideId, orderId, handler) {
    let button = document.createElement("button");
    button.type = "button";
    button.className = "btn p-1";
    button.setAttribute("data-bs-toggle", "modal");
    button.setAttribute("data-bs-target", "#" + modalId);

    let icon = document.createElement("i");
    icon.className = "bi " + iconClass;
    button.appendChild(icon);

    button.setAttribute("route-id", routeId);
    button.setAttribute("guide-id", guideId);
    button.setAttribute("order-id", orderId);
    button.addEventListener("click", handler);

    return button;
}

function getOrder(id) {
    let order;
    for (let i = 0; i < orders.length; i++) {
        if (orders[i].id.toString() === id.toString()) {  
            order = orders[i];
        }
    }
    return order;
}

function getRoute(id) {
    let route;
    for (let i = 0; i < routes.length; i++) {
        if (routes[i].id.toString() === id.toString()) {
            route = routes[i];
        }
    }
    return route;
}

function loadRoutes() {
    const url = `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes?api_key=${api_key}`;

    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);

    xhr.onload = function () {
        routes = JSON.parse(this.response);
    };

    xhr.send();
}

function confirmOrderClick() {
    changeOrder(currentOrderID);
    loadOrders();
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

window.onload = function () {
    loadRoutes();
    loadOrders();
};