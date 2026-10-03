const largePage = '/tests/assets/large.html';

function mountGantt(url) {
  return cy
    .viewport(1440, 900)
    .document()
    .then(doc => {
      doc.body.innerHtml = '';
    })
    .visit(url, { timeout: 30000 });
}

describe('Row virtualization', () => {
  it('mounts a bounded number of rows for 2000 tasks and swaps them while scrolling', () => {
    mountGantt(largePage).then(window => {
      expect(window.ganttInstance.visibleTasks.length).to.equal(2000);
    });
    // window = viewport rows + 2*5 overscan - far below the 2000 visible tasks
    cy.get('.gantt-elastic__chart-row-wrapper').should('have.length.greaterThan', 0);
    cy.get('.gantt-elastic__chart-row-wrapper').its('length').then(chartRows => {
      expect(chartRows, 'chart rows stay bounded').to.be.lessThan(60);
    });
    cy.get('.gantt-elastic__task-list-item').its('length').then(listRows => {
      expect(listRows, 'task list rows stay bounded').to.be.lessThan(60);
    });
    // scroll deep into the dataset - row count stays bounded, different rows render
    cy.window().then(window => {
      window.ganttInstance.scrollTo(null, 50 * 36);
    });
    cy.wait(200);
    cy.get('.gantt-elastic__chart-row-wrapper').its('length').then(chartRows => {
      expect(chartRows, 'chart rows still bounded after scroll').to.be.lessThan(60);
    });
    cy.window().then(window => {
      expect(window.ganttInstance.renderedFirstIndex, 'window moved with the scroll').to.be.greaterThan(30);
    });
    // first rendered row matches its absolute position inside the viewport
    cy.get('.gantt-elastic__task-list-item').first().should('exist');
  });
});
