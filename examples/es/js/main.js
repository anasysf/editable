import {
  Checkbox,
  DeleteButton,
  EditButton,
  Editable,
  Events,
  Field,
  StringInput,
} from '../../../dist/es/index.js';

const editable = new Editable('my-table', {
  dataSrc: {
    src: 'https://dummyjson.com/products',
    method: 'GET',
    prop: 'products',
  },
  fields: [
    /* new Field({
      name: 'id',
      type: 'num',
    }), */
    new Field({
      name: 'title',
      type: 'string',
      editor: new StringInput(),
    }),
    /* new Field({
      name: 'stock',
      editor: new Checkbox({
        activeLabel: 'yessiir',
        inactiveLabel: 'nosir',
      }),
    }), */
  ],
  buttons: [new EditButton(), new DeleteButton()],
  updateDataSrc: {
    src: 'https://dummyjson.com/products/1',
  },
  rowId: 'id',
  deleteDataSrc: 'https://dummyjson.com/products/1',
});

editable
  .on(Events.UPDATED, ({ test }) => console.log(test))
  .on(Events.DELETE, ({ deleteRow }) => deleteRow(true)
  );

console.log(editable);
