const umd = '/tests/assets/umd.html';

describe('Event delegation', () => {
  it('binds mouse/touch listeners per container, not per row', () => {
    const rowSubtreeListeners = [];
    const containerListeners = [];
    cy.visit('/tests/assets/umd.html', {
      onBeforeLoad(win) {
        const original = win.EventTarget.prototype.addEventListener;
        win.EventTarget.prototype.addEventListener = function(type, listener, options) {
          try {
            if (/^(mouse|touch)/.test(type) && this instanceof win.Element) {
              if (this.closest('.gantt-elastic__chart-row-wrapper, .gantt-elastic__task-list-item')) {
                rowSubtreeListeners.push(this.nodeName + ':' + type);
              }
              if (
                this.classList.contains('gantt-elastic__main-view-container') ||
                this.classList.contains('gantt-elastic__task-list-items')
              ) {
                containerListeners.push(this.classList[0] + ':' + type);
              }
            }
          } catch (error) {
            // measurement only - never break listener registration
          }
          return original.call(this, type, listener, options);
        };
      }
    });
    cy.window().then(window => {
      // only expander svgs keep their own click handlers inside row subtrees;
      // every bar/cell mouse/touch event flows through the two containers
      expect(
        rowSubtreeListeners.length,
        'row-subtree mouse/touch listeners: ' + rowSubtreeListeners.join(', ')
      ).to.be.lessThan(12);
      expect(containerListeners.filter(entry => entry.startsWith('gantt-elastic__main-view-container')).length, 'chart container delegation').to.be.greaterThan(8);
      expect(containerListeners.filter(entry => entry.startsWith('gantt-elastic__task-list-items')).length, 'task list container delegation').to.be.greaterThan(8);
    });
  });

  it('still fires bar and cell events with correct payloads', () => {
    cy.viewport(1440, 900)
      .document()
      .then(doc => {
        doc.body.innerHtml = '';
      })
      .visit(umd, { timeout: 10000 })
      .window()
      .then(window => {
        const gantt = window.ganttInstance;
        window.__seen = [];
        for (let name of ['chart-project-click', 'chart-project-mouseenter', 'chart-project-mousedown', 'taskList-project-click']) {
          gantt.$on(name, payload => window.__seen.push({ name, id: payload.data.id }));
        }
      });
    // click a chart bar (project type = task 1) through the delegated path
    cy.get('.gantt-elastic__chart-row-bar')
      .first()
      .click();
    // hover it
    cy.get('.gantt-elastic__chart-row-bar')
      .first()
      .trigger('mouseover');
    // press it - mousedown must survive the drag-scroll handler on the same
    // container setting scroll.scrolling (issue #10 review finding)
    cy.get('.gantt-elastic__chart-row-bar')
      .first()
      .trigger('mousedown', { which: 1 });
    // click the first list cell (delegated cell dispatch)
    cy.get('.gantt-elastic__task-list-item-value')
      .first()
      .click();
    cy.window().then(window => {
      const names = window.__seen.map(entry => entry.name);
      expect(names, 'seen events: ' + JSON.stringify(window.__seen)).to.include('chart-project-click');
      expect(names).to.include('chart-project-mouseenter');
      expect(names).to.include('chart-project-mousedown');
      expect(names).to.include('taskList-project-click');
      expect(window.ganttInstance.state.selectedTaskId).to.equal(1);
    });
  });

  it('Enter on a focused list expander toggles without selecting', () => {
    cy.viewport(1440, 900)
      .document()
      .then(doc => {
        doc.body.innerHtml = '';
      })
      .visit(umd, { timeout: 10000 })
      .window()
      .then(window => {
        expect(window.ganttInstance.getTask(2).collapsed).to.equal(true);
      });
    cy.get('.gantt-elastic__task-list-expander-content[aria-label*="great responsibility"]')
      .focus()
      .focused()
      .trigger('keydown', { key: 'Enter', bubbles: true });
    cy.window().then(window => {
      expect(window.ganttInstance.getTask(2).collapsed, 'expander toggled').to.equal(false);
      expect(window.ganttInstance.state.selectedTaskId, 'row must not get selected').to.equal(null);
    });
  });

  it('keeps selection working from list cell clicks (delegated)', () => {
    cy.viewport(1440, 900)
      .document()
      .then(doc => {
        doc.body.innerHtml = '';
      })
      .visit(umd, { timeout: 10000 });
    cy.get('.gantt-elastic__task-list-item-value')
      .eq(1)
      .click();
    cy.get('.gantt-elastic__task-list-item--selected').should('exist');
  });
});
