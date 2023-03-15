import { Button, Grid } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { fabric } from 'fabric';
import fabricCloneControl from '@/fabricControls/clone';
import fabricDeleteControl from '@/fabricControls/delete';
import fabricRotateControl from '@/fabricControls/rotate';
import fabricScalingControl from '@/fabricControls/scaling';

const FabricCanvas = (props) => {

  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const iTextRef = useRef(null)

  const [list, setList] = useState('')
  console.log("🚀 ~ file: fabricCanvas.js:16 ~ FabricCanvas ~ list:", list)

  const [canvasInstance, setCanvasInstance] = useState(null)

  const createIText = () => {
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
    }
    canvasInstance.on('mouse:down', (event) => {

      fabricCloneControl(fabric, setList)
      fabricDeleteControl(fabric)
      fabricRotateControl(fabric)
      fabricScalingControl(fabric)
      const pointer = canvasInstance.getPointer(event)

      const iText = new fabric.IText(props.text, {
        fontSize: 20,
        left: pointer.x,
        top: pointer.y,
        fontStyle: 'normal',
        textAlign: 'center',
        fontFamily: '',
        centeredScaling: true,
        centeredRotation: true,
        fill: 'white'
      })

      iText.setControlsVisibility(HideControls)
      iTextRef.current = iText
      canvasInstance.add(iText)
      canvasInstance.renderAll()
      canvasInstance.off('mouse:down')
    })
  }

  function handleFileUpload(event) {
    const file = event.target.files[0]

    if (file) {
      const reader = new FileReader()

      reader.readAsDataURL(file)

      reader.onloadend = function (e) {
        props.setImage({
          src: e.target.result,
          height: 500,
          width: 500
        })
      }
    }
  }

  useEffect(() => {
    if (props.image) {

      const container = containerRef.current
      const canvas = new fabric.Canvas(canvasRef.current)
      setCanvasInstance(canvas)
      canvas.setWidth(container.clientWidth)
      canvas.setHeight(container.clientHeight)

      fabric.Image.fromURL(props.image.src, (fabricImage) => {
        const check = fabricImage.width - fabricImage.height
        // fabricImage.scaleToWidth(canvas.width)
        if (fabricImage.width > fabricImage.height && check > 500) {
          fabricImage.scaleToWidth(canvas.width)
        } else {
          fabricImage.scaleToHeight(canvas.height)
        }
        canvas.setBackgroundImage(fabricImage, canvas.renderAll.bind(canvas),
          // {
          // scaleX: canvas.width / fabricImage.width,
          // scaleY: canvas.height / fabricImage.height
          // }
        )
      })
      canvas.renderAll();

      canvas.on('object:selected', function (e) {
        e.target.set({
          borderColor: 'red',
          cornerColor: 'green',
          cornerSize: 20,
          transparentCorners: true
        })
      })

      canvas.on('before:selection:cleared', function (e) {
        e.target.set({
          borderColor: 'black',
          cornerColor: 'white',
          cornerSize: 20,
          transparentCorners: true
        })
      })
    }
  }, [props.image])

  return (
    <>
      <Grid item>
        <div ref={containerRef} style={{ width: '700px', height: '500px' }}>
          <input type="file" onChange={handleFileUpload} />
          <canvas ref={canvasRef} />
        </div>
        <br />
        <Button onClick={createIText}>Add text</Button>
      </Grid >
    </>
  )
}

export default FabricCanvas