const fabricCloneControl = (fabric, setList) => {

  const HideControls = {
    'tl': false,
    'tr': false,
    'bl': false,
    'br': true,
    'ml': false,
    'mt': false,
    'mr': false,
    'mb': false,
    'mtr': true
  };

  const cloneImg = document.createElement('img');
  cloneImg.src = '/clone.svg'
  let canvasCopy = null


  function cloneObject(eventData, transform) {
    const target = transform.target
    const canvas = target.canvas
    target.clone(function (cloned) {
      cloned.left += 10
      cloned.top += 10
      cloned.text = target.text
      canvas.add(cloned)
      canvas.renderAll();
      cloned.setControlsVisibility(HideControls)
    })
    console.log(canvas._objects);
    setList('Hola')
  }

  function renderIcon(icon) {
    return function renderIcon(ctx, left, top, styleOverride, fabricObject) {
      const size = this.cornerSize;
      ctx.save();
      ctx.translate(left, top);
      ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
      ctx.drawImage(icon, -size / 2, -size / 2, size, size);
      ctx.restore();
    }
  }

  fabric.Object.prototype.controls.clone = new fabric.Control({
    x: -0.5,
    y: -0.5,
    offsetY: -8,
    offsetX: -8,
    cursorStyle: 'pointer',
    mouseUpHandler: cloneObject,
    render: renderIcon(cloneImg),
    cornerSize: 24
  });

  return canvasCopy
}

export default fabricCloneControl