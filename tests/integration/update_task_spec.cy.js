const umd = '/tests/assets/umd.html';
const standalone = '/tests/assets/standalone.html';

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
      const updated = gantt.updateTask(1, { label: 'patched by updateTask', progress: 42 });
      expect(updated).to.equal(before);
      expect(updated.label).to.equal('patched by updateTask');
      expect(updated.progress).to.equal(42);
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

  it('translates legacy patch fields (percent, dependentOn) onto the canonical names', () => {
    mountGantt(umd).then(window => {
      const gantt = window.ganttInstance;
      const updated = gantt.updateTask(2, { percent: 55, dependentOn: [1] });
      expect(updated.progress).to.equal(55);
      expect(updated.dependencies).to.deep.equal([1]);
      // the legacy keys are not written onto the task
      expect(updated.percent).to.equal(undefined);
      expect(updated.dependentOn).to.equal(undefined);
    });
  });

  it('keeps canonical patches durable across reinit when taskMapping renames the field', () => {
    mountGantt(standalone).then(window => {
      const gantt = window.ganttInstance;
      // simulate the documented owner contract (README usage example): the
      // tasks prop always reflects the latest tasks-changed output
      const propTasks = gantt.tasks;
      gantt.$on('tasks-changed', tasks => {
        propTasks.splice(0, propTasks.length, ...tasks);
      });
      gantt.updateTask(1, { progress: 66 });
      expect(gantt.getTask(1).progress).to.equal(66);
      // the fixture maps progress onto a 'percent' source field - the add-task
      // reinit below re-maps every task from that source, so the patch must
      // have been mirrored onto it or it would be silently reverted
      cy.wait(150)
        .then(() => {
          window.addTask();
        })
        .wait(300)
        .then(() => {
          expect(gantt.getTask(88), 'reinit picked up the added task').to.not.equal(null);
          expect(gantt.getTask(1).progress, 'patch survives the reinit').to.equal(66);
        });
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
      // moving the task far outside the rendered time window rebuilds the
      // chart range around it - the patch survives the rebuild and the
      // window actually grows
      const reference = gantt.getTask(1);
      const oldLastTime = gantt.state.options.times.lastTime;
      gantt.updateTask(1, { start: '2030-06-01' });
      expect(gantt.getTask(1)).to.not.equal(reference);
      expect(new Date(gantt.getTask(1).startTime).getFullYear(), 'patch survives the rebuild').to.equal(2030);
      expect(gantt.state.options.times.lastTime, 'window grows around the task').to.be.greaterThan(oldLastTime);
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
