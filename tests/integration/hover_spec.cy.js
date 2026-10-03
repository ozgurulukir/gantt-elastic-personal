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
  it('highlights both chart row and list row, synced, until mouseleave', () => {
    mountGantt(umd).then(window => {
      const gantt = window.ganttInstance;
      // hover from the chart side (same events the row wrappers dispatch)
      gantt.$emitBus.emit('chart-row-mouseenter', {
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
    // leave the row
    cy.window().then(window => {
      const gantt = window.ganttInstance;
      gantt.$emitBus.emit('chart-row-mouseleave', { event: {}, data: gantt.getTask(1) });
    });
    cy.get('.gantt-elastic__chart-row--hover').should('not.exist');
    cy.get('.gantt-elastic__task-list-item--hover').should('not.exist');
    // hover from the task list side highlights the same chart row
    cy.window().then(window => {
      const gantt = window.ganttInstance;
      gantt.$emitBus.emit('taskList-row-mouseenter', {
        event: {},
        data: gantt.getTask(1)
      });
    });
    cy.get('.gantt-elastic__chart-row-wrapper')
      .first()
      .should('have.class', 'gantt-elastic__chart-row--hover');
    cy.get('.gantt-elastic__task-list-item--hover').should('exist');
  });

  it('real mouse crossing inside a bar does not drop the highlight', () => {
    mountGantt(umd);
    cy.get('.gantt-elastic__chart-row-bar')
      .first()
      .trigger('mouseenter')
      .trigger('mouseover')
      .trigger('mouseout', { bubbles: true })
      .wait(50);
    // bubbling mouseout from a child element must not clear the hover;
    // the wrapper g is still hovered until the pointer truly leaves the row
    cy.get('.gantt-elastic__chart-row-wrapper')
      .first()
      .should('have.class', 'gantt-elastic__chart-row--hover');
    cy.get('.gantt-elastic__chart-row-wrapper')
      .first()
      .trigger('mouseleave')
      .wait(50);
    cy.get('.gantt-elastic__chart-row--hover').should('not.exist');
  });
});
