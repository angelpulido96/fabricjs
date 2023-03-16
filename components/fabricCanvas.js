import { Button, FormControl, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { fabric } from 'fabric';
import fabricCloneControl from '@/fabricControls/clone';
import fabricDeleteControl from '@/fabricControls/delete';
import fabricRotateControl from '@/fabricControls/rotate';
import fabricScalingControl from '@/fabricControls/scaling';

const FabricCanvas = (props) => {

  const fontsFamily = [{
    id: 1,
    name: "Arial narrow"
  }, {
    id: 2,
    name: "Monaco"
  }, {
    id: 3,
    name: 'Verdana'
  }];
  const fontsStyles = [{
    id: 1,
    name: "normal"
  }, {
    id: 2,
    name: "italic"
  }, {
    id: 3,
    name: 'oblique'
  }];

  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const [image, setImage] = useState(null)
  const [color, setColor] = useState('')
  const [selected, setSelected] = useState(0)
  const [newText, setNewText] = useState('')
  const iTextRef = useRef(null)

  const [list, setList] = useState([])

  const [canvasInstance, setCanvasInstance] = useState(null)
  const [fontStyle, setFontStyle] = useState(0)

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

      const pointer = canvasInstance.getPointer(event)

      const iText = new fabric.IText(newText, {
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
        setImage({
          src: e.target.result,
          height: 500,
          width: 500
        })
      }
    }
  }

  canvasInstance?.on('object:added', (e) => {
    setList([...list, e.target])
  });

  canvasInstance?.on('selection:created', ({ selected }) => {
    console.log('entro');
    console.log('selected: ', selected);
  })


  useEffect(() => {
    if (image) {
      const canvas = new fabric.Canvas(canvasRef.current)
      const container = containerRef.current
      setCanvasInstance(canvas)
      canvas.setWidth(container.clientWidth)
      canvas.setHeight(container.clientHeight)

      fabric.Image.fromURL(image.src, (fabricImage) => {
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
    fabricCloneControl(fabric)
    fabricDeleteControl(fabric)
    fabricRotateControl(fabric)
    fabricScalingControl(fabric)
  }, [image])

  const handleSelectEdit = (item) => {
    iTextRef.current = item
    canvasInstance.setActiveObject(item)
    canvasInstance.renderAll()
  }

  const handleDeleteText = (item) => {
    const newArray = list.filter((t) => t !== item)
    setList(newArray)
    canvasInstance.remove(item)
  }

  const handleEditText = () => {
    if (newText) {
      iTextRef.current.set("text", newText)
      canvasInstance.renderAll()
    }
  }
  const handleDaownloadImage = (event) => {
    canvasInstance.renderAll()
    let link = event.currentTarget
    link.setAttribute('download', 'myImage.png')
    let image = canvasRef.current.toDataURL('image/png')
    link.setAttribute('href', image)
  }

  function handleColorChange() {
    setColor(color)
    iTextRef.current.set('fill', color)
    canvasInstance.renderAll()
  }

  function handleFontChange(value) {
    iTextRef.current.set('fontFamily', value)
    canvasInstance.renderAll()
  }

  const handleFontSyle = (value) => {
    iTextRef.current.set('fontStyle', value)
    canvasInstance.renderAll()
  }

  return (
    <>
      <br />
      <Grid container spacing={2}>
        <Grid item>
          <div ref={containerRef} style={{ width: '700px', height: '500px' }}>
            {
              !image &&
              < input type="file" onChange={handleFileUpload} />
            }
            <canvas ref={canvasRef} />
          </div>
          <br />
          <FormControl
            style={{ marginLeft: 12 }}
          >
            <InputLabel id="fontFamily">fontFamily</InputLabel>
            <Select
              size='small'
              id="fontFamily"
              value={selected}
              label="fontFamily"
              onChange={({ target: { value } }) => {
                setSelected(value)
                handleFontChange(value)
              }}
            >
              <MenuItem disabled value={0}>Selecciona un familiFont</MenuItem>
              {
                fontsFamily.map((item) => (
                  <MenuItem key={item.id} value={item.name}>{item.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
          <FormControl
            style={{ marginLeft: 12 }}
          >
            <InputLabel id="font">fontStyle</InputLabel>
            <Select
              size='small'
              id="fontSyle"
              value={fontStyle}
              label="fontStyle"
              onChange={({ target: { value } }) => {
                setFontStyle(value)
                handleFontSyle(value)
              }}
            >
              <MenuItem disabled key={0} value={0}>Selecciona un fontStyle</MenuItem>
              {
                fontsStyles.map(item => (
                  <MenuItem key={item.id} value={item.name}>{item.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
          <input type='color' onChange={({ target: { value } }) => setColor(value)} />
          <button style={{ marginLeft: 12 }} onClick={handleColorChange}>Cambiar color</button>
          <TextField
            size='small'
            style={{ marginLeft: 12 }}
            onChange={({ target: { value } }) => setNewText(value)}
            multiline={true}
            maxRows={3}
          />
          <Button onClick={createIText}>Add text</Button>
          <Button onClick={handleEditText} >Editar texto</Button>
          <a style={{ maginTop: 32, marginLeft: 12, cursor: 'pointer', color: 'black' }} onClick={handleDaownloadImage}>Download image</a>
        </Grid >
        <Grid item>
          <Typography style={{ color: 'red' }}>Lista de mensajes</Typography>
          {
            list.map((item, index) => (
              <Fragment key={index}>
                <Stack direction='row' textAlign='center' >
                  <Typography style={{ color: 'red' }}>{item.text}</Typography>
                  <Button onClick={() => handleDeleteText(item)}>Delete</Button>
                  <Button onClick={() => handleSelectEdit(item)} >Edit</Button>
                </Stack>
              </Fragment>
            ))
          }
        </Grid>
      </Grid>

    </>
  )
}

export default FabricCanvas