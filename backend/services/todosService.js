const TodosDao = require('../daos/todosDao');
const ULID = require("ulid");
const {todoStatus} = require("../utils/models/todos");

class TodosService {
  constructor () {
    this.ToDosDao = new TodosDao();
  }

  createToDosList(newToDoListTitle, newToDoListToDos) {
    const nonEmptyToDos = newToDoListToDos.filter(todo => todo.task.length > 0);

    const newToDo = {title: newToDoListTitle, todos: nonEmptyToDos, id: ULID.ulid()};

    return this.ToDosDao.createToDosList(newToDo).then(() => newToDo);
  }

  getToDosLists() {
    return this.ToDosDao.getToDosLists();
  }

  updateToDosList(todoListId, newToDoListTitle, newToDoListToDos) {
    const nonEmptyToDos = newToDoListToDos.filter(todo => todo.task.length > 0);

    return this.ToDosDao.updateToDosList(todoListId, newToDoListTitle, nonEmptyToDos);
  }

  getAllToDosLists() {
    return this.ToDosDao.getAllToDosLists();
  }

  // Naive migration of data
  async migrateToDos() {
    const oldTodosLists = await this.getAllToDosLists();

    console.log('oldTodosLists', oldTodosLists);

    const newToDosLists = oldTodosLists.map(oldToDoList => ({
      ...oldToDoList,
      todos: oldToDoList.todos.map(oldToDo => ({
        task: oldToDo,
        status: todoStatus.Pending
      }))
    }));

    console.log('newToDosLists', newToDosLists);

    const futureMigratedToDosLists = newToDosLists.map(toDoList => {
      return this.updateToDosList(toDoList.id, toDoList.title, toDoList.todos);
    });

    try {
      return await Promise.all(futureMigratedToDosLists);
    } catch {
      console.log('An error occurred during the migration');
      const futureOldToDosLists = oldTodosLists.map(toDoList => {
        return this.updateToDosList(toDoList.id, toDoList.title, toDoList.todos);
      });

      return await Promise.all(futureOldToDosLists);
    }
  }
}

module.exports = TodosService;