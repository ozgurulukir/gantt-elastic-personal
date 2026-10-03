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
    // enter the bar, then mouseout with the relatedTarget still inside the
    // same row - the row hover must survive child-element crossings
    cy.get('.gantt-elastic__chart-row-wrapper')
      .first()
      .as('row');
    cy.get('@row')
      .find('.gantt-elastic__chart-row-bar')
      .first()
      .trigger('mouseover');
    cy.get('@row').should('have.class', 'gantt-elastic__chart-row--hover');
    cy.get('@row')
      .find('.gantt-elastic__chart-row-bar-polygon')
      .first()
      .then($polygon => {
        cy.get('@row')
          .find('.gantt-elastic__chart-row-bar')
          .first()
          .trigger('mouseout', { relatedTarget: $polygon[0] });
      });
    cy.wait(50);
    cy.get('@row').should('have.class', 'gantt-elastic__chart-row--hover');
    // leaving the row entirely (relatedTarget null) clears the hover
    cy.get('@row').trigger('mouseout');
    cy.wait(50);
    cy.get('.gantt-elastic__chart-row--hover').should('not.exist');
  });
});
