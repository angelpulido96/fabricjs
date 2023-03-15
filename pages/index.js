import { Inter } from 'next/font/google'
import { fabric } from 'fabric';
import { Fragment, useEffect, useRef, useState } from 'react';
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

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

  const [image, setImage] = useState(null)
  const [color, setColor] = useState('blue')
  const [canvasInstance, setCanvasInstance] = useState(null)
  const [selected, setSelected] = useState(0)
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const [newText, setNewText] = useState('')
  const [fontStyle, setFontStyle] = useState(0)

  const [texts, setTexts] = useState([])
  const iTextRef = useRef(null)


  useEffect(() => {
    if (image) {
      const container = containerRef.current
      const canvas = new fabric.Canvas(canvasRef.current)
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

      const iText = new fabric.IText('Escribe tu texto', {
        fontSize: 20,
        left: 10,
        top: 10,
        fontStyle: '',
        textAlign: 'center',
        // selectable: false,
        fontFamily: '',
        centeredScaling: true,
        centeredRotation: true,
        fill: 'white'
      })
      setTexts([...texts, iText])
      const textos = [...texts, iText]

      iTextRef.current = textos[textos.indexOf(iText)]

      canvas.add(iText)
      canvas.renderAll();

      canvas.on('object:selected', function (e) {
        e.target.set({
          borderColor: 'red',
          cornerColor: 'green',
          cornerSize: 10,
          transparentCorners: false
        })
      })

      canvas.on('before:selection:cleared', function (e) {
        e.target.set({
          borderColor: 'black',
          cornerColor: 'white',
          cornerSize: 6,
          transparentCorners: true
        })
      })
    }
  }, [image])



  const adNewText = () => {
    const iText = new fabric.IText(`Escribe tu texto ${texts.length + 1}`, {
      fontSize: 20,
      left: 10,
      top: 10,
      fontStyle: 'normal',
      textAlign: 'center',
      // selectable: false,
      fontFamily: '',
      centeredScaling: true,
      centeredRotation: true,
      fill: 'white'
    })
    setTexts([...texts, iText])
    const textos = [...texts, iText]

    iTextRef.current = textos[textos.indexOf(iText)]
    canvasInstance.add(iText)
    canvasInstance.renderAll()
  }

  function handleColorChange() {
    setColor(color)
    iTextRef.current.set('fill', color)
    canvasInstance.renderAll()
  }



  const handleText = () => {
    if (newText) {
      iTextRef.current.set("text", newText)
      canvasInstance.renderAll()
    }
  }

  const handleFontSyle = (value) => {
    iTextRef.current.set('fontStyle', value)
    canvasInstance.renderAll()
  }

  function handleFontChange(value) {
    iTextRef.current.set('fontFamily', value)
    canvasInstance.renderAll()
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

  const handleDaownloadImage = (event) => {
    let link = event.currentTarget
    link.setAttribute('download', 'myImage.png')
    let image = canvasRef.current.toDataURL('image/png')
    link.setAttribute('href', image)
  }

  const handleSelectEdit = (item) => {
    iTextRef.current = item
  }

  const handleDeleteText = (item) => {
    const newArray = texts.filter((t) => t !== item)
    setTexts(newArray)
    canvasInstance.remove(item)
  }

  return (
    <div style={{ backgroundColor: 'white', height: '100vh' }}>
      <Grid container spacing={2}>
        <Grid item>
          <div ref={containerRef} style={{ width: '700px', height: '500px' }}>
            <input type="file" onChange={handleFileUpload} />
            <canvas ref={canvasRef} />
          </div>
          <br />
        </Grid >
        <Grid item>
          <Typography style={{ color: 'red' }}>Lista de mensajes</Typography>
          {
            texts.map((item, index) => (
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
      <br />
      {
        image && (
          <>
            <div>
              <input type='color' onChange={({ target: { value } }) => setColor(value)} />
              <button style={{ marginLeft: 12 }} onClick={handleColorChange}>Cambiar color</button>
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
              <TextField
                size='small'
                style={{ marginLeft: 12 }}
                onChange={({ target: { value } }) => setNewText(value)}
                multiline={true}
                maxRows={3}
              />
              <Button onClick={handleText} >Editar texto</Button>
              <Button onClick={adNewText} >Añadir otro texto</Button>
              <a style={{ maginTop: 32, marginLeft: 12, cursor: 'pointer', color: 'black' }} onClick={handleDaownloadImage}>Download image</a>
            </div>
          </>
        )
      }
    </div >
  );
}
