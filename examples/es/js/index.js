import {
  Editable,
  Field,
  EditButton,
  Events,
  StringInput,
  DeleteButton,
} from '../../../dist/es/index.js';

const editable = new Editable('my-table', {
  dataSrc: {
    src: 'https://dummyjson.com/products',
    method: 'GET',
    prop: 'products',
  },
  fields: [
    new Field({
      name: 'id',
      type: 'num',
    }),
    new Field({
      name: 'title',
      sortable: true,
      type: 'string',
      editor: new StringInput(),
    }),
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
  .on(Events.DELETE, ({ deleteCB }) => {
    alert('aaaaaaaaaaa');
    deleteCB(true);
  });

console.log(editable);
