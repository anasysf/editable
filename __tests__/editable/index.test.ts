import Editable from '../../src/editable';

describe('Initiate an Editable instance.', () => {
  test('table id to equal to `test`', () => {
    const table = document.createElement('table');
    table.id = 'test';

    const editable = new Editable(table.id, {
      dataSrc: 'a',
      fields: [],
    });
    expect(editable.tableId).toBe(table.id);
  });
});
