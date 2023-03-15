const fabricRotateControl = (fabric) => {

    const rotateImg = document.createElement('img');
    rotateImg.src = '/rotate.svg'

    function renderIcon(icon) {
        return function renderIcon(ctx, left, top, styleOverride, fabricObject) {
            var size = this.cornerSize;
            ctx.save();
            ctx.translate(left, top);
            ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
            ctx.drawImage(icon, -size / 2, -size / 2, size, size);
            ctx.restore();
        };
    }

    fabric.Object.prototype.controls.mtr = new fabric.Control({
        x: -0.5,
        y: 0.5,
        offsetY: 3,
        offsetX: -8,
        cursorStyle: 'pointer',
        actionHandler: fabric.controlsUtils.rotationWithSnapping,
        actionName: 'rotate',
        render: renderIcon(rotateImg),
        cornerSize: 24,
        withConnection: false
    });
}

export default fabricRotateControl