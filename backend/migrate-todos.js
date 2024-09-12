const mongoDbClient = require("./database/mongoDbClient");
const ToDosService = require("./services/todosService");

mongoDbClient.connectToServer(async function (err) {
  if (err) {
    console.error(err);
    process.exit();
  }

  const ToDosServiceInstance = new ToDosService();

  // Naive migration of ToDos
  await ToDosServiceInstance.migrateToDos();

  const allNewToDosLists = await ToDosServiceInstance.getAllToDosLists();

  const successfulMigration = allNewToDosLists.flatMap(todoList => todoList.todos).every(toDo => typeof toDo.task === 'string');

  if (successfulMigration) {
    console.log('successful migration');
  } else {
    console.log('something went wrong with the migration migration');
  }
});