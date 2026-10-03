const xssPage = '/tests/assets/xss.html';
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

describe('XSS escaping', () => {
  it('never executes injected handlers, html rendering stays sanitized', () => {
    mountGantt(xssPage).then(window => {
      expect(window.__xsspwned, 'onerror handler must not have fired').to.equal(undefined);
    });
    // header title (options.title.html true): script/handlers stripped
    cy.get('.gantt-elastic__header-title--html script').should('not.exist');
    cy.get('.gantt-elastic__header-title--html img').should('not.have.attr', 'onerror');
    // user column keeps the safe link
    cy.get('.gantt-elastic__task-list-item-value a[href="https://example.com/john"]').should('exist');
    // the malicious img is sanitized: no onerror attribute anywhere
    cy.get('.gantt-elastic__chart-row-text-content--html img').should('not.have.attr', 'onerror');
    cy.get('.gantt-elastic__task-list-item-value img').should('not.have.attr', 'onerror');
    cy.window().then(window => {
      expect(window.__xsspwned, 'no execution after render').to.equal(undefined);
    });
  });

  it('renders task fields as literal text when html rendering is off', () => {
    mountGantt(umd).then(window => {
      const gantt = window.ganttInstance;
      // umd.html has html: true on the label (Description, index 1) column - turn it off
      gantt.state.options.taskList.columns[1].html = false;
      gantt.getTask(1).label = '<img src=x onerror="window.__pwned=1">broken<script>window.__pwned=2</script>';
    });
    cy.get('.gantt-elastic__chart-row-text-content--text').should('contain.text', '<img src=x onerror=');
    cy.get('.gantt-elastic__chart-row-text-content--text img').should('not.exist');
    cy.window().then(window => {
      expect(window.__pwned, 'injected code must not execute').to.equal(undefined);
    });
  });
});
