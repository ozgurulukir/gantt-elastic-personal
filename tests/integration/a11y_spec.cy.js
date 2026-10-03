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

describe('Accessibility', () => {
  it('exposes roles and labels for bars, rows, tree and expanders', () => {
    mountGantt(umd);
    cy.get('.gantt-elastic__chart-graph-svg').should('have.attr', 'role', 'group');
    cy.get('.gantt-elastic__chart-row-wrapper').first().should('exist');
    cy.get('.gantt-elastic__chart-row-bar')
      .first()
      .should('have.attr', 'role', 'button')
      .then($bar => {
        // have.attr yields the attribute value (a string) - assert substring directly
        expect($bar.attr('aria-label'), 'bar aria label contains the date range').to.contain(' - ');
      });
    cy.get('.gantt-elastic__task-list-items').should('have.attr', 'role', 'tree');
    cy.get('.gantt-elastic__task-list-item')
      .eq(1)
      .should('have.attr', 'role', 'treeitem')
      .and('have.attr', 'aria-expanded');
    cy.get('.gantt-elastic__task-list-expander-content').should('have.attr', 'role', 'button');
  });

  it('operates the chart with keyboard only', () => {
    mountGantt(umd);
    // focus first bar, activate with Enter -> selection highlight
    cy.get('.gantt-elastic__chart-row-bar')
      .first()
      .focus()
      .focused()
      .trigger('keydown', { key: 'Enter' });
    cy.get('.gantt-elastic__chart-row--selected').should('exist');
    // arrows move focus between bars
    cy.focused().trigger('keydown', { key: 'ArrowDown' });
    cy.get('.gantt-elastic__chart-row-bar')
      .eq(1)
      .should('be.focused');
    // Escape clears the selection
    cy.focused().trigger('keydown', { key: 'Escape' });
    cy.get('.gantt-elastic__chart-row--selected').should('not.exist');
    // task list row: Enter selects, arrows navigate
    cy.get('.gantt-elastic__task-list-item')
      .first()
      .focus()
      .focused()
      .trigger('keydown', { key: 'Enter' });
    cy.get('.gantt-elastic__task-list-item--selected').should('exist');
    cy.focused().trigger('keydown', { key: 'ArrowDown' });
    cy.get('.gantt-elastic__task-list-item')
      .eq(1)
      .should('be.focused');
  });

  it('toggles the expander with Enter and reflects aria-expanded', () => {
    mountGantt(umd).then(window => {
      expect(window.ganttInstance.getTask(2).collapsed).to.equal(true);
    });
    // deterministic: find task 2's expander through its aria-label
    cy.get('.gantt-elastic__task-list-expander-content[aria-label*="great responsibility"]')
      .should('have.attr', 'aria-expanded', 'false')
      .focus()
      .focused()
      .trigger('keydown', { key: 'Enter', bubbles: true });
    cy.window().then(window => {
      expect(window.ganttInstance.getTask(2).collapsed).to.equal(false);
    });
    cy.get('.gantt-elastic__task-list-expander-content[aria-label*="great responsibility"]').should(
      'have.attr',
      'aria-expanded',
      'true'
    );
  });

  it('axe-core reports no critical violations on the gantt region', () => {
    mountGantt(umd);
    cy.request('https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js').then(response => {
      cy.window().then(window => {
        window.eval(response.body);
        return window.axe
          .run(window.document.querySelector('.gantt-elastic'), { resultTypes: ['violations'] })
          .then(results => {
            const critical = results.violations.filter(violation => violation.impact === 'critical');
            const summary = critical
              .map(violation => `${violation.id} (${violation.nodes.length} nodes)`)
              .join(', ');
            expect(critical, `critical axe violations: ${summary}`).to.deep.equal([]);
          });
      });
    });
  });
});
