(() => {

  const container = document.getElementById('todoApp');
  container.classList.add('mx-auto');
  const savedTodos = JSON.parse(localStorage.getItem(token)); // Загружаем массив со всеми объектами из ЛС
  const defaultTodos = [
    {id: 1, name: 'Открыть список дел', done: true},
    {id: 2, name: 'Начать пользоваться списком дел', done: false},
  ];
  // Здесь объекты формата {id:.., name:..., done:true/false}
  let todos = [];
  let count = 3;

  document.addEventListener('DOMContentLoaded', function() {
    createTodoApp(container, heading, savedTodos);
  });

  function createTodoApp(container, title, userTodos) {
    todos = userTodos ? userTodos : defaultTodos;
    createTodoTitle(container, title);
    const createForm = createTodoForm();
    const mainForm = createForm.form;
    let mainInput = createForm.input;
    const mainBtn = createForm.btnSubmit;
    let myList = createTodoList();
    // Добавляем DOM-элементы на страницу
    mainForm.append(mainInput);
    mainForm.append(mainBtn);
    container.append(mainForm);
    container.append(myList);

    // Создание новых эл-тов через сабмит
    // Получаем значение инпута, создаём объект, где name - значение инпута, 
    // новый объект добавляем  в todos. Далее в todos он станет DOM-элементом li и добавится на страницу
    mainForm.addEventListener('submit', elem => {
      elem.preventDefault();
      if (!mainInput.value) {
        return
      };
      const newTodoObject = {
        name: mainInput.value,
        done: false,
        id: count,
      } 
      ++count;
      todos.push(newTodoObject);
      refreshLocal(todos);
      objToDomElem(newTodoObject);
      mainInput.value = ''; // Очищаем инпут после добавления дела
    });

    for (let todo of todos) {
      objToDomElem(todo);
    };
  };

  function objToDomElem(anyObj) {
    const newItem = createTodoItem(anyObj).item;
    handlerDone(newItem);
    handlerDelete(newItem);
    const list = document.querySelector('ul')
    list.append(newItem);
  };

  // Добавляет в контейнер заголовок, ничего не возвращает
  function createTodoTitle(container, title) {
    const caption = document.createElement('h2');
    caption.style.textAlign = 'center';
    caption.textContent = title;
    container.append(caption);
  }

  function createTodoForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let btnWrapper = document.createElement('div');
    let btnSubmit = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    btnWrapper.classList.add('input-group-append');
    btnSubmit.type = 'submit';
    btnSubmit.classList.add('btn', 'btn-primary', 'disabled');
    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Добавить дело';

    form.append(input);
    form.append(btnSubmit);

    input.addEventListener('input', function(elem) {
      elem.preventDefault();
      btnSubmit.disabled = !elem.target.value;
      elem.target.value ? btnSubmit.classList.remove('disabled') : btnSubmit.classList.add('disabled');
    })

    return {
      form,
      input,
      btnSubmit,
    };
  };

  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  };

  // Получает на вход объект формата {id:.., name:..., done:true/false}
  // Возвращает DOM-элемент li
  function createTodoItem(objTodo) {
    let item = document.createElement('li');
    let btnWrapper =  document.createElement('div');
    let btnDone = document.createElement('button');
    let btnDelete = document.createElement('button');

    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = objTodo.name;
    item.id = objTodo.id;

    btnWrapper.classList.add('btn-group', 'btn-group-sm');
    btnDone.classList.add('btn', 'btn-success');
    btnDelete.classList.add('btn', 'btn-danger');
    btnDone.type = 'button'
    btnDelete.type = 'button'
    btnDone.textContent = 'Выполнено';
    btnDelete.textContent = 'Удалить';

    if (objTodo.done) {
      item.classList.add('list-group-item-success');
    }

    btnWrapper.append(btnDone);
    btnWrapper.append(btnDelete);
    item.append(btnWrapper);

    return {
      item,
      btnDone,
      btnDelete,
    }
  };

  // Получаем ДОМ-элемент, находим там кнопку и вешает обработчик
  // Сохраняем после каждого клика loadedTodo()
  // Ничего не возвращает
  function handlerDone(obj) {
    let eBtnDone = obj.querySelector('.btn-success');
    eBtnDone.addEventListener('click', function() {
      obj.classList.toggle('list-group-item-success');
      const curTodo = todos.find(e => e.id === Number(obj.id));
      curTodo.done = !curTodo.done;
      refreshLocal(todos);
    });
  };
  function handlerDelete(obj) {
    let eBtnDelete = obj.querySelector('.btn-danger');
    eBtnDelete.addEventListener('click', () => {
      if (confirm('Вы уверены?')) {
        todos = todos.filter(e => e.id !== Number(obj.id));
        obj.remove();
        refreshLocal(todos);
      };
    });
  };

  // Обновляет Локарсторейдж
  // Получает на вход массив с объектами дел todos
  // Приводит к JSON-формату и добавляет в ЛС
  function refreshLocal(objList) {
    localStorage.setItem(token, JSON.stringify(objList));
  }
}) ()
