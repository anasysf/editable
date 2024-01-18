import {
  Editable,
  Field,
  Editor,
  EditButton,
  EditorType,
  FieldType,
} from '../../../dist/es/index.js';

const editable = new Editable('my-table', {
  dataSrc: {
    src: 'https://jsonplaceholder.typicode.com/posts',
    method: 'GET',
  },
  fields: [
    new Field({
      name: 'id',
      sortable: true,
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
});

console.log(editable);
