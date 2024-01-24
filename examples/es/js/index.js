import {
  Editable,
  Field,
  Editor,
  EditButton,
  EditorType,
  FieldType,
  Events,
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
      type: FieldType.NUM,
    }),
    new Field({
      name: 'title',
      sortable: true,
      type: FieldType.STRING,
      editor: new Editor({
        type: EditorType.STRING,
      }),
    }),
  ],
  buttons: [new EditButton()],
  updateDataSrc: {
    src: 'https://dummyjson.com/products/1',
  },
});

editable.on(Events.UPDATED, ({ test }) => console.log(test));

console.log(editable);
