// Let node-config know where the configs are
process.env["NODE_CONFIG_DIR"] = __dirname + "/../config";
const mongoDbClient = require('../database/mongoDbClient');
const ToDosService = require("../services/todosService");
const {todoStatus} = require("../utils/models/todos");

mongoDbClient.connectToServer(async function (err) {
  if (err) {
    console.error(err);
    process.exit();
  }

  const ToDosServiceInstance = new ToDosService();

  // Seed todos
  await ToDosServiceInstance.createToDosList('My ToDos', [
    {task: "Write a book", status: todoStatus.Pending},
    {task: "Write a poem", status: todoStatus.Completed},
    {task: "Have a family", status: todoStatus.Pending}
  ]);

  await mongoDbClient.closeConnection();
});