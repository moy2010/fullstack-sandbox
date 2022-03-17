const express = require('express');
const { checkSchema, validationResult } = require('express-validator');
const ToDosService = require('../services/todosService');

const ToDosServiceInstance = new ToDosService();


const router = express.Router();

// Get ToDos Lists
router.route('/todos').get(async function (req, res) {
  ToDosServiceInstance.getToDosLists().then(todoLists => {
    res.json(todoLists);
  }).catch(() => {
    // ToDo: Handle error
    res.status(500).send('Error fetching ToDos lists');
  });
});

// Create ToDos Lists
router.route('/todos').post(checkSchema({
    title: {
      notEmpty: true,
      errorMessage: "ToDos list title cannot be empty"
    },
    todos: {
      notEmpty: true,
      errorMessage: "At least one ToDo is necessary"
    },
  }), async function (req, res) {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  ToDosServiceInstance.createToDosList(req.body.title, req.body.todos).then(() => {
    res.status(201).send('ToDos list created successfully');
  }).catch(() => {
    // ToDo: Handle error
    res.status(400).send('Error creating ToDos list');
  });
});

// Patch ToDos List
router.route('/todos/:todoListId').patch(checkSchema({
  title: {
    notEmpty: true,
    errorMessage: "ToDos list title cannot be empty"
  },
  todos: {
    notEmpty: true,
    errorMessage: "At least one todo is necessary"
  },
}), async function (req, res) {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  ToDosServiceInstance.updateToDosList(req.params.todoListId, req.body.title, req.body.todos).then(() => {
    res.status(200).send('ToDos list updated successfully');
  }).catch(() => {
    // ToDo: Handle error
    res.status(400).send('Error updating ToDos list');
  });
});

module.exports = router;