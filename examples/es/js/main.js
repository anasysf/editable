import {
  Checkbox,
  DeleteButton,
  EditButton,
  Editable,
  Events,
  Field,
  SelectStatic,
  StringInput,
} from '../../../dist/es/index.js';

const editable = new Editable('my-table', {
  dataSrc: {
    src: 'https://dummyjson.com/todos?limit=2',
    method: 'GET',
    prop: 'todos',
  },
  fields: [
    /* New Field({
      name: 'id',
      type: 'num',
    }), */
    new Field({
      name: 'todo',
      type: 'string',
      editor: new StringInput(),
    }),
    new Field({
      name: 'completed',
      editor: new Checkbox({
        activeLabel: 'yessiir',
        inactiveLabel: 'nosir',
      }),
    }),
    new Field({
      name: '3a',
      editor: new SelectStatic({
        data: [
          {
            userId: 26,
            username: 'yofs',
            firstName: 'Anas Youssef',
            lastName: 'El Mahdad',
          },
          {
            userId: 48,
            username: 'ziko',
            firstName: 'Zakaria',
            lastName: 'Hmiri',
          },
        ],
        prop: 'username',
        id: 'userId',
      }),
    }),
  ],
  buttons: [new EditButton(), new DeleteButton()],
  updateDataSrc: 'https://dummyjson.com/todos/1',
  rowId: 'id',
  deleteDataSrc: 'https://dummyjson.com/todos/1',
  postDataSrc: 'https://dummyjson.com/todos/add',
});

editable
  .on(Events.UPDATED, ({ test }) => console.log(test))
  .on(Events.DELETE, ({ deleteRow }) => deleteRow(true));

const addRowBtn = document.getElementById('add-row');
addRowBtn.addEventListener('click', () => editable.addRow());

console.log(editable);
