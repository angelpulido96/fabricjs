const fabricScalingControl = (fabric) => {

    const rotateImg = document.createElement('img');
    rotateImg.src = '/south_east.svg'

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

    fabric.Object.prototype.controls.br = new fabric.Control({
        x: 0.5,
        y: 0.5,
        offsetY: 7,
        offsetX: 6,
        cursorStyle: 'pointer',
        actionHandler: fabric.controlsUtils.scalingEqually,
        render: renderIcon(rotateImg),
        cornerSize: 20
    });
}

export default fabricScalingControl