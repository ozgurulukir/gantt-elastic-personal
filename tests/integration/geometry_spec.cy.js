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

describe('Geometry reactions', () => {
  it('resizes bars on zoom and grows rows on row height change', () => {
    mountGantt(umd).then(window => {
      const gantt = window.ganttInstance;
      window.__widthBefore = gantt.getTask(1).width;
      window.__heightBefore = gantt.getTask(1).height;
      gantt.$emitBus.emit('times-timeZoom-change', 10);
    });
    cy.wait(100);
    cy.window().then(window => {
      const gantt = window.ganttInstance;
      expect(gantt.state.options.times.timePerPixel).to.not.equal(743072);
      expect(gantt.getTask(1).width, 'bar width follows zoom').to.not.equal(window.__widthBefore);
      gantt.$emitBus.emit('row-height-change', 50);
    });
    cy.wait(100);
    cy.window().then(window => {
      const gantt = window.ganttInstance;
      expect(gantt.getTask(1).height, 'bar height follows row height').to.equal(50);
      const pitch = 50 + gantt.state.options.chart.grid.horizontal.gap * 2;
      expect(gantt.getTask(2).y, 'next row y follows the new pitch').to.be.greaterThan(pitch);
    });
  });

  it('exports svg markup of the rendered chart', () => {
    mountGantt(umd).then(window => {
      const svg = window.ganttInstance.getSVG();
      expect(svg).to.contain('<svg');
      expect(svg).to.contain('gantt-elastic');
    });
  });
});
