import express from 'express';
import cors from 'cors';
import { todos } from './todos.js';
import { PORT } from '../helpers/constants.js';

const app = express();

// Settings for server
app.use(express.json()); // Server work with JSON
app.use(cors()); // CORS fetching

app.get('/', (request, response) => {
    response.send(JSON.stringify(todos))
})

app.post('/', (request, response) => {
    const newTodo = request.body;
    todos.push(newTodo);
    response.send('ok');
})

app.delete('/:id', (request, response) => {
    const { id } = request.params;
    const index = todos.findIndex(todo => todo.id === Number(id));

    if (index !== -1) {
        todos.splice(index, 1);
        response.send('Todo item deleted'); // TODO: Without. work with double click?
    } else {
        response.status(404).send('Todo item not found');
    }
});

app.put('/:id', (request, response) => {
    const { id } = request.params;
    const { isDone } = request.body;
    const todo = todos.find(todo => todo.id === Number(id));

    if (todo) {
        if (isDone !== undefined) todo.isDone = isDone;
        response.send('Todo item updated');
    } else {
        response.status(404).send('Todo item not found');
    }
});

app.listen(PORT, () => {
    console.log(`We are listening port ${PORT}...`);
});
