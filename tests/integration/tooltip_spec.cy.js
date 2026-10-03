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

describe('Chart tooltip', () => {
  it('shows task details on bar hover and hides on mouseout', () => {
    mountGantt(umd).then(window => {
      expect(window.ganttInstance.getTask(1).label.length).to.be.greaterThan(0);
    });
    // hover any bar that is fully inside the viewport (initial scroll position varies)
    cy.get('.gantt-elastic__chart-row-bar').then($bars => {
      const visible = [...$bars].find(el => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.top > 60 && rect.left > 300 && rect.right < 1400;
      });
      expect(visible, 'a chart bar inside the viewport').to.exist;
      cy.wrap(visible).trigger('mouseenter');
    });
    cy.get('.gantt-elastic__chart-tooltip')
      .should('exist')
      .and('contain.text', '–')
      .and('contain.text', 'progress:');
    cy.get('.gantt-elastic__chart-row-bar')
      .first()
      .trigger('mouseleave');
    cy.get('.gantt-elastic__chart-tooltip').should('not.exist');
  });

  it('supports custom format and can be disabled', () => {
    mountGantt(umd).then(window => {
      const gantt = window.ganttInstance;
      gantt.state.options.chart.tooltip.format = task => `custom:${task.id}`;
      // dispatch through the event bus directly - no synthetic mouse event needed
      gantt.$emitBus.emit('chart-project-mouseenter', {
        event: { clientX: 400, clientY: 300 },
        data: gantt.getTask(1)
      });
    });
    cy.get('.gantt-elastic__chart-tooltip', { timeout: 5000 }).should('have.text', 'custom:1');
    cy.window().then(window => {
      window.ganttInstance.state.options.chart.tooltip.display = false;
    });
    cy.get('.gantt-elastic__chart-tooltip').should('not.exist');
  });
});
