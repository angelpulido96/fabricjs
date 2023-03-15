import { Inter } from 'next/font/google'
import { fabric } from 'fabric';
import { Fragment, useEffect, useRef, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import FabricCanvas from '@/components/fabricCanvas';

var deleteIcon = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const imagesList = [
    {
      id: 1,
      url: '/estrella.jpeg',
      width: '40%'
    },
    {
      id: 2,
      url: '/mama-quiere.jpeg',
      width: '30%'
    },
    {
      id: 3,
      url: '/kelder.png',
      width: '30%'
    },
  ]

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

  const [selected, setSelected] = useState(0)
  const [newText, setNewText] = useState('')
  const [fontStyle, setFontStyle] = useState(0)

  const [texts, setTexts] = useState([])


  const adNewText = () => {

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

    canvasRef.hoverCursor = 'pointer'
    canvasInstance.on('mouse:down', (event) => {

      const pointer = canvasInstance.getPointer(event)

      const iText = new fabric.IText(`Escribe tu texto ${texts.length + 1}`, {
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

      setTexts([...texts, iText])
      const textos = [...texts, iText]

      iTextRef.current = textos[textos.indexOf(iText)]
      canvasInstance.add(iText)
      canvasInstance.renderAll()
      canvasInstance.off('mouse:down')
    })
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



  const handleDaownloadImage = (event) => {
    canvasInstance.renderAll()
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
          <Typography style={{ color: 'red' }}>Lista de mensajes</Typography>
          {/* {
            canvasInstance._objects.map((item, index) => (
              <Fragment key={index}>
                <Stack direction='row' textAlign='center' >
                  <Typography style={{ color: 'red' }}>{item.text}</Typography>
                  <Button onClick={() => handleDeleteText(item)}>Delete</Button>
                  <Button onClick={() => handleSelectEdit(item)} >Edit</Button>
                </Stack>
              </Fragment>
            ))
          } */}
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
      <FabricCanvas image={image} setImage={setImage} text={newText} />
    </div >
  );
}
