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

describe('Task selection', () => {
  it('highlights list row and chart bar on click, persists over zoom', () => {
    mountGantt(umd).then(window => {
      expect(window.ganttInstance.state.selectedTaskId).to.equal(null);
    });
    // click the ID cell of the first visible row (task 1) - no custom events on that column
    cy.get('.gantt-elastic__task-list-item-value')
      .first()
      .click();
    cy.get('.gantt-elastic__task-list-item')
      .first()
      .should('have.class', 'gantt-elastic__task-list-item--selected');
    cy.get('.gantt-elastic__chart-row-wrapper')
      .first()
      .should('have.class', 'gantt-elastic__chart-row--selected');
    cy.window().then(window => {
      expect(window.ganttInstance.state.selectedTaskId).to.equal(1);
    });
    // selection survives zoom
    cy.window().then(window => {
      window.ganttInstance.$emitBus.emit('times-timeZoom-change', 10);
    });
    cy.get('.gantt-elastic__chart-row-wrapper')
      .first()
      .should('have.class', 'gantt-elastic__chart-row--selected');
  });

  it('exposes selectTask/clearSelection and clears on outside click', () => {
    mountGantt(umd).then(window => {
      const gantt = window.ganttInstance;
      gantt.selectTask(10);
      expect(gantt.state.selectedTaskId).to.equal(10);
      gantt.clearSelection();
      expect(gantt.state.selectedTaskId).to.equal(null);
    });
    cy.get('.gantt-elastic__task-list-item--selected').should('not.exist');
    cy.get('.gantt-elastic__chart-row--selected').should('not.exist');
    // select again, then press on empty chart area
    cy.window().then(window => {
      window.ganttInstance.selectTask(10);
    });
    cy.get('.gantt-elastic__task-list-item--selected').should('exist');
    // press on empty chart area - dispatch directly on the container so the
    // target is the container itself, not whatever SVG sits at its center
    cy.get('.gantt-elastic__main-view-container').then($container => {
      $container[0].dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });
    cy.get('.gantt-elastic__task-list-item--selected').should('not.exist');
  });

  it('taskSelection.display = false disables selection', () => {
    mountGantt(umd).then(window => {
      const gantt = window.ganttInstance;
      gantt.state.options.taskSelection.display = false;
      gantt.selectTask(10);
      expect(gantt.state.selectedTaskId).to.equal(null);
    });
    cy.get('.gantt-elastic__task-list-item--selected').should('not.exist');
  });
});
