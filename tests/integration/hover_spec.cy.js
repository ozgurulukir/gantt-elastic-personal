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

describe('Row hover highlight', () => {
  it('highlights both chart row and list row, synced, until mouseout', () => {
    mountGantt(umd).then(window => {
      const gantt = window.ganttInstance;
      // hover from the chart side (same events the bars dispatch)
      gantt.$emitBus.emit('chart-task-mouseenter', {
        event: { clientX: 400, clientY: 300 },
        data: gantt.getTask(1)
      });
    });
    cy.get('.gantt-elastic__chart-row-wrapper')
      .first()
      .should('have.class', 'gantt-elastic__chart-row--hover');
    cy.get('.gantt-elastic__task-list-item')
      .first()
      .should('have.class', 'gantt-elastic__task-list-item--hover');
    // leave the bar
    cy.window().then(window => {
      const gantt = window.ganttInstance;
      gantt.$emitBus.emit('chart-task-mouseout', { event: {}, data: gantt.getTask(1) });
    });
    cy.get('.gantt-elastic__chart-row--hover').should('not.exist');
    cy.get('.gantt-elastic__task-list-item--hover').should('not.exist');
    // hover from the task list side highlights the same chart row
    cy.window().then(window => {
      const gantt = window.ganttInstance;
      gantt.$emitBus.emit('taskList-task-mouseenter', {
        event: {},
        data: gantt.getTask(1),
        column: {}
      });
    });
    cy.get('.gantt-elastic__chart-row-wrapper')
      .first()
      .should('have.class', 'gantt-elastic__chart-row--hover');
    cy.get('.gantt-elastic__task-list-item--hover').should('exist');
  });
});
