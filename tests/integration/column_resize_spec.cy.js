const umd = '/tests/assets/umd.html';

function mountGantt(url) {
  return cy
    .viewport(1440, 900)
    .document()
    .then(doc => {
      doc.body.innerHtml = '';
    })
    .visit(url, { timeout: 10000 });
}

describe('Column width resize', () => {
  it('resizes with arrow keys, clamps, and resets on double click', () => {
    mountGantt(umd).then(window => {
      const gantt = window.ganttInstance;
      expect(gantt.state.options.taskList.columns[0].width).to.equal(40);
    });
    let changedEmitted = 0;
    cy.window().then(window => {
      window.ganttInstance.$on('taskList-column-width-changed', () => {
        changedEmitted++;
      });
    });
    cy.get('.gantt-elastic__task-list-header-resizer-wrapper')
      .first()
      .focus()
      .trigger('keydown', { key: 'ArrowRight' });
    cy.window().then(window => {
      const gantt = window.ganttInstance;
      expect(gantt.state.options.taskList.columns[0].width).to.equal(50);
      expect(changedEmitted).to.be.greaterThan(0);
    });
    // fine step with shift
    cy.get('.gantt-elastic__task-list-header-resizer-wrapper')
      .first()
      .trigger('keydown', { key: 'ArrowLeft', shiftKey: true });
    cy.window().then(window => {
      expect(window.ganttInstance.state.options.taskList.columns[0].width).to.equal(49);
    });
    // double click resets to the configured width
    cy.get('.gantt-elastic__task-list-header-resizer-wrapper')
      .first()
      .dblclick();
    cy.window().then(window => {
      expect(window.ganttInstance.state.options.taskList.columns[0].width).to.equal(40);
    });
    // clamped from below
    for (let i = 0; i < 8; i++) {
      cy.get('.gantt-elastic__task-list-header-resizer-wrapper')
        .first()
        .trigger('keydown', { key: 'ArrowLeft' });
    }
    cy.window().then(window => {
      const gantt = window.ganttInstance;
      expect(gantt.state.options.taskList.columns[0].width).to.equal(gantt.state.options.taskList.minWidth);
    });
  });

  it('persists widths when taskList.persistColumnWidths is on', () => {
    mountGantt(umd).then(window => {
      const gantt = window.ganttInstance;
      gantt.state.options.taskList.persistColumnWidths = true;
      cy.wrap(null);
    });
    cy.get('.gantt-elastic__task-list-header-resizer-wrapper')
      .first()
      .focus()
      .trigger('keydown', { key: 'ArrowRight' });
    cy.window().then(window => {
      const stored = JSON.parse(window.localStorage.getItem('gantt-elastic:column-widths:default'));
      expect(stored).to.be.an('object');
      const idKey = Object.keys(stored)[0];
      expect(stored[idKey]).to.equal(window.ganttInstance.state.options.taskList.columns[0].width);
      window.localStorage.clear();
    });
  });
});
