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

describe('Current time line', () => {
  it('renders inside the visible window and can be disabled', () => {
    mountGantt(umd);
    cy.get('.gantt-elastic__grid-line-time').should('exist');
    cy.window().then(window => {
      const line = window.document.querySelector('.gantt-elastic__grid-line-time');
      expect(parseFloat(line.getAttribute('x1'))).to.be.greaterThan(0);
      window.ganttInstance.state.options.chart.currentTimeLine.display = false;
    });
    cy.get('.gantt-elastic__grid-line-time').should('not.exist');
  });

  it('supports color override and ticks via updateInterval', () => {
    mountGantt(umd).then(window => {
      const gantt = window.ganttInstance;
      gantt.state.options.chart.currentTimeLine.color = '#00FF00';
      // short interval for the test - startNowTimer() picks up option changes
      gantt.state.options.chart.currentTimeLine.updateInterval = 50;
      gantt.startNowTimer();
    });
    cy.get('.gantt-elastic__grid-line-time').should('have.css', 'stroke', 'rgb(0, 255, 0)');
    cy.wait(150);
    cy.window().then(window => {
      const nowAtCheck = window.ganttInstance.state.now;
      cy.wait(150).then(() => {
        expect(window.ganttInstance.state.now).to.be.greaterThan(nowAtCheck);
      });
    });
  });
});
