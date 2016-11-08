(function () {

  'use strict';

  var $ = document.querySelector.bind(document);
  var ENTER_KEY = 13;
  var newTodoDom = document.getElementById('new-todo');
  var syncDom = document.getElementById('sync-wrapper');

  // LevelDB

  var NodePouchDB = require('pouchdb');
  var serverConfig = require('./serverconfig.js').serverConfig;

  var leveldbDB = new NodePouchDB('mydb-leveldb');

  var remoteCouch = new NodePouchDB(serverConfig.couchbaseSyncAddress);

  leveldbDB.info(function (err, info) {
    leveldbDB.changes({
      since: info.update_seq,
      live: true
    }).on('change', showTodos);
  });

  leveldbDB.info().then(function (info) {
    $('#leveldb').innerHTML = '&#10004; We can use PouchDB with LevelDB!';
  }).catch(function (err) {
    $('#leveldb').innerHTML = 'Error for LevelDB';
  });

  function addToDo(text) {
    var todo = {
      _id: new Date().toISOString(),
      title: text,
      completed: false
    };
    leveldbDB.put(todo).then(function (response) {
      console.log("Success: ", response);
    }).catch(function (err) {
      console.log("Failure: ", err);
    });
  }

  function showTodos() {
    leveldbDB.allDocs({ include_docs: true, descending: true }).then(function (doc) {
      redrawTOdosUI(doc.rows);
    }).catch(function (err) {
      console.log("failure: ", err);
    });
  }

  function checkboxChanged(todo, event) {
    todo.completed = event.target.checked;
    console.log(todo);
    leveldbDB.put(todo);
  }

  function deleteButtonPressed(todo) {
    leveldbDB.remove(todo);
  }

  function todoBlurred(todo, event) {
    var trimmedText = event.target.value.trim();
    if (!trimmedText) {
      leveldbDB.remove(todo);
    } else {
      todo.title = trimmedText;
      leveldbDB.put(todo);
    }
  }

  function sync() {
    syncDom.setAttribute('data-sync-state', 'syncing');

    var opts = { live: true, retry: true };
    leveldbDB.sync(remoteCouch, opts, syncError).on('change', function (change) {
      showTodos();
    }).on('error', function (err) {
      console.log(err);
    });
  }

  function createTodoListItem(todo) {
    var checkbox = document.createElement('input');
    checkbox.className = 'toggle';
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', checkboxChanged.bind(this, todo));

    var label = document.createElement('label');
    label.appendChild(document.createTextNode(todo.title));
    label.addEventListener('dblclick', todoDblClicked.bind(this, todo));

    var deleteLink = document.createElement('button');
    deleteLink.className = 'destroy';
    deleteLink.addEventListener('click', deleteButtonPressed.bind(this, todo));

    var divDisplay = document.createElement('div');
    divDisplay.className = 'view';
    divDisplay.appendChild(checkbox);
    divDisplay.appendChild(label);
    divDisplay.appendChild(deleteLink);

    var inputEditTodo = document.createElement('input');
    inputEditTodo.id = 'input_' + todo._id;
    inputEditTodo.className = 'edit';
    inputEditTodo.value = todo.title;
    inputEditTodo.addEventListener('keypress', todoKeyPressed.bind(this, todo));
    inputEditTodo.addEventListener('blur', todoBlurred.bind(this, todo));

    var li = document.createElement('li');
    li.id = 'li_' + todo._id;
    li.appendChild(divDisplay);
    li.appendChild(inputEditTodo);

    if (todo.completed) {
      li.classname += 'complete'; checkbox.checked = true;
    }

    return li;
  }

  function todoDblClicked(todo) {
    var div = document.getElementById('li_' + todo._id);
    var inputEditTodo = document.getElementById('input_' + todo._id);
    div.className = 'editing';
    inputEditTodo.focus();
  }

  function todoKeyPressed(todo, event) {
    if (event.keyCode === ENTER_KEY) {
      var inputEditTodo = document.getElementById('input_' + todo._id); inputEditTodo.blur();
    }
  }

  function redrawTOdosUI(todos) {
    var ul = document.getElementById('todo-list');
    ul.innerHTML = '';
    todos.forEach(function (todo) {
      ul.appendChild(createTodoListItem(todo.doc));
    });
  }

  function syncError() {
    syncDom.setAttribute('data-sync-state', 'error');
  }

  function newTodoKeyPressHandler(event) {
    if (event.keyCode === ENTER_KEY) {
      addToDo(newTodoDom.value);
      newTodoDom.value = '';
    }
  }

  function addEventListeners() {
    newTodoDom.addEventListener('keypress', newTodoKeyPressHandler, false);
  }

  addEventListeners();
  showTodos();

  if (remoteCouch) {
    sync();
  }
})();