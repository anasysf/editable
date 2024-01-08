$(function () {
  import { Field } from 'editable';
  const fields = [
    new Field({
      name: 'test',
      type: 'list-stc',
      data: [
        {
          test: 1,
          test2: 2,
        },
      ],
      editor: new Editor({
        type: 'list-stc',
        required: true,
      }),
    }),
  ];

  const editable = $('#data-table').editable({
    rowId: 'id',
    dataSrc: {
      src: 'https://dummyjson.com/users?limit=2',
      method: 'GET',
      prop: 'users',
    },
    updateDataSrc: {
      src: 'https://dummyjson.com/users/1',
      method: 'PUT',
    },
    deleteDataSrc: {
      src: 'https://dummyjson.com/users/1',
      method: 'DELETE',
    },
    postDataSrc: 'https://dummyjson.com/users/add',
    fields,
  });

  $('#add-row').click(() => editable.addRow());

  editable
    .on('input-invalid', ({ message, tr, row, element, value }) => {
      console.error(message, tr, row, element, value);
      element.type === 'email' ? (element.type = 'number') : (element.type = element.type);
    })
    .on('input-valid', ({ tr, row, element, value }) => {
      console.info(tr, row, element, value);
    })
    .on('http-error', ({ status, statusText, url }) => {
      console.error(status, statusText, url);
    })
    .on('error', ({ message }) => {
      console.error(message);
    })
    .on('edit', ({ tr, row, rowData, elements }) => {
      console.info(tr, row, rowData, elements);
    })
    .on('edited', ({ tr, row, rowData, oldRowData }) => {
      console.info(tr, row, rowData, oldRowData);
    })
    .on('updated', ({ tr, row, rowData, oldRowData }) => {
      console.info(tr, row, rowData, oldRowData);
    })
    .on('delete', ({ tr, row, rowData }) => {
      console.info(tr, row, rowData);
    })
    .on('deleted', ({ tr, row, rowData }) => {
      console.info(tr, row, rowData);
    })
    .on('new-row', ({ tr, row }) => {
      console.info(tr, row);
    })
    .on('new-row-save', ({ tr, row, rowData }) => {
      console.info(tr, row, rowData);
    })
    .on('new-row-saved', ({ tr, row, rowData, response }) => {
      console.info(tr, row, rowData, response);
    })
    .on('new-row-cancel', ({ tr, row }) => {
      console.info(tr, row);
    })
    .on('new-row-cancelled', ({ tr, row }) => {
      console.info(tr, row);
    })
    .on('cancel', ({ tr, row, rowData }) => {
      console.info(tr, row, rowData);
    })
    .on('cancelled', ({ tr, row, rowData }) => {
      console.info(tr, row, rowData);
    });
});
