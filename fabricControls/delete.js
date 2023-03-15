const fabricDeleteControl = (fabric) => {

  const deleteImg = document.createElement('img');
  deleteImg.src = '/close.svg'

  function renderIcon(icon) {
    return function renderIcon(ctx, left, top, styleOverride, fabricObject) {
      var size = this.cornerSize;
      ctx.save();
      ctx.translate(left, top);
      ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
      ctx.drawImage(icon, -size / 2, -size / 2, size, size);
      ctx.restore();
    }
  }

  function deleteObject(eventData, transform) {
    var target = transform.target;
    var canvas = target.canvas;
    canvas.remove(target);
    canvas.requestRenderAll();
  }

  fabric.Object.prototype.controls.deleteControl = new fabric.Control({
    x: 0.5,
    y: -0.5,
    offsetY: -8,
    offsetX: 8,
    cursorStyle: 'pointer',
    mouseUpHandler: deleteObject,
    render: renderIcon(deleteImg),
    cornerSize: 24
  })
}

export default fabricDeleteControl