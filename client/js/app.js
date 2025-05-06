'use strict';

import {
    CHECKED_CLASS,
    CHECKED_ICON,
    CLOSE_ICON,
    DATA_ID, errorMessages, IS_ACTIVE,
    LOCALHOST_URL,
    REMOVE_CLASS
} from '../../helpers/constants.js';

const createButton = document.querySelector('.js-create');
const listRoot = document.querySelector('.js-list');

const renderTodoList = async () => {
    const result = await fetch(LOCALHOST_URL);
    const response = await result.json();

    listRoot.innerHTML = '';

    response.forEach(item => {
        const el = document.createElement('li');
        const elRemove = document.createElement('span');
        const elChecked = document.createElement('span');

        elRemove.classList.add(REMOVE_CLASS);
        elRemove.innerHTML = CLOSE_ICON;
        elRemove.setAttribute(DATA_ID, item.id);

        elChecked.classList.add(CHECKED_CLASS);
        item.isDone && elChecked.classList.add(IS_ACTIVE);
        elChecked.innerHTML = CHECKED_ICON;
        elChecked.setAttribute(DATA_ID, item.id);

        el.textContent = item.title;
        el.classList.add('list__item');
        el.appendChild(elRemove);
        el.appendChild(elChecked);

        listRoot.appendChild(el);
    })
}

const removeTodo = async (id) => {
    await fetch(`${LOCALHOST_URL}${id}`,{
        method: 'DELETE'
    });
}

const updateTodo = async (id, isDone) => {
    await fetch(`${LOCALHOST_URL}${id}`,{
        method: 'PUT',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({ isDone })
    });
}

const initTriggersListeners = () => {
    listRoot.addEventListener('click', event => {
        const targetElement = event.target;
        const id = targetElement.getAttribute(DATA_ID);
        const isRemoveTrigger = targetElement.classList.contains(REMOVE_CLASS);
        const isCheckedTrigger = targetElement.classList.contains(CHECKED_CLASS);

        if (id && isRemoveTrigger) {
            removeTodo(id)
                .then(() => {
                    renderTodoList()
                        .catch(err => { console.log(errorMessages.delete, err) });
                });
        } else if (id && isCheckedTrigger) {
            const newDoneValue = targetElement.classList.contains(IS_ACTIVE);

            updateTodo(id, !newDoneValue)
                .then(() => {
                    renderTodoList()
                        .catch(err => { console.log(errorMessages.update, err) });
                });
        }
    })
}

createButton.addEventListener('click', () => {
    const newTodoTitle = document.querySelector('input[name="todo"]').value;
    const newTodo = {
        id: Date.now(),
        title: newTodoTitle,
        isDone: false
    }

    fetch('http://localhost:3000/', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(newTodo)
    }).then(() => {
        renderTodoList()
            .catch(err => { console.log(errorMessages.get, err) });
    });
})

document.addEventListener('DOMContentLoaded', () => {
    renderTodoList()
        .catch(err => { console.log(errorMessages.get, err) });
    initTriggersListeners();
});
