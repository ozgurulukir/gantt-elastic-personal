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

describe('updateTask - O(changed) mutation API', () => {
  it('patches a task without the full setup() rebuild', () => {
    mountGantt(umd).then(window => {
      const gantt = window.ganttInstance;
      let changedEmitted = 0;
      gantt.$on('tasks-changed', () => {
        changedEmitted++;
      });
      // full setup() recreates every task object - reference identity proves
      // this update ran O(changed) instead of the rebuild path
      const before = gantt.getTask(1);
      const updated = gantt.updateTask(1, { label: 'patched by updateTask', percent: 42 });
      expect(updated).to.equal(before);
      expect(updated.label).to.equal('patched by updateTask');
      expect(gantt.getTask(1)).to.equal(before);
      cy.wait(100).then(() => {
        // tasks-changed still flows through the output watcher
        expect(changedEmitted).to.be.greaterThan(0);
        // no drift rebuild happened on the flush after the patch
        expect(gantt.getTask(1)).to.equal(before);
      });
      // the patched label is rendered in the task list (interpolated)
      cy.get('.gantt-elastic__task-list-item-value')
        .eq(1)
        .should('contain.text', 'patched by updateTask');
    });
  });

  it('recomputes geometry when duration changes and full rebuild on window exit', () => {
    mountGantt(umd).then(window => {
      const gantt = window.ganttInstance;
      const task = gantt.getTask(1);
      const oldWidth = task.width;
      const oldEnd = task.endTime;
      // shrinking keeps the task inside the rendered window - O(changed) path
      gantt.updateTask(1, { duration: task.duration / 2 });
      expect(task.endTime).to.equal(task.startTime + task.duration);
      expect(task.endTime).to.be.lessThan(oldEnd);
      expect(task.width).to.be.lessThan(oldWidth);
      // moving the task far outside the rendered time window falls back to
      // setup() - the chart range itself must be recalculated
      const reference = gantt.getTask(1);
      gantt.updateTask(1, { start: '2030-06-01' });
      expect(gantt.getTask(1)).to.not.equal(reference);
    });
  });

  it('keeps pure computeds side-effect free (dependency lines still render)', () => {
    mountGantt(umd);
    // expand task 2 so its children (and their dependency sources) become visible
    cy.get(
      'div.gantt-elastic__task-list-items > div:nth-child(2) > div:nth-child(2) > div > div.gantt-elastic__task-list-expander-wrapper > svg'
    )
      .click()
      .wait(100);
    cy.get('.gantt-elastic__chart-dependency-lines-path').should('have.length.greaterThan', 0);
    cy.window().then(window => {
      // no reactive dependencyLines property is written back onto tasks
      expect(window.ganttInstance.getTask(1).dependencyLines).to.equal(undefined);
    });
  });
});
