'use client'

import Image from "next/image"
import {useState, useEffect} from 'react'
import {firestore} from './firebase'
import {Box, Modal, Typography, TextField, Stack, Button} from '@mui/material'
import {collection, deleteDoc, doc, getDocs, query, getDoc, setDoc} from 'firebase/firestore'
import { SERVER_FILES_MANIFEST } from "next/dist/shared/lib/constants"
import { global } from "styled-jsx/css"

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState([false])
  const [itemName, setItemName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
  }

  const addItem = async(item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1})
    } else {
      await setDoc(docRef, {quantity: 1})
    }
      
    await updateInventory()
  }

  const removeItem = async(item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
      const {quantity} = docSnap.data()
      if (quantity === 1){
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }
      
    await updateInventory()
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Box 
      width="100vw" 
      height="100vh" 
      display="flex" 
      position="relative"
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      gap={2}
      sx={{
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url(/pantry.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.5, // Adjust opacity here
          zIndex: -1,
        }}
      }
      
    >
      <Modal open={open} onClose={handleClose}>
        <Box 
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value)
              }}
            />
        <Button
            variant="outlined"
            onClick={() => {
            addItem(itemName)
            setItemName('')
            handleClose()
          }}
        >
          Add
        </Button>
        </Stack>
        </Box>
      </Modal>
      <Box 
          width="800px"
          height="150px"
          display="flex"
          alignItems="center" 
          justifyContent="center"
          overflow='auto'
        >
          <Typography variant='h1' sx={{fontFamily: 'Roboto'}}>
            Pantry Tracker
          </Typography>
      </Box>   
      <TextField
        label="Search Inventory"
        variant="outlined"
        border='2px'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{marginBottom: 1, width: '800px',
          '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: 'black', // Set border color here
            borderWidth: '2px', // Adjust border width here if needed
          },
          '&:hover fieldset': {
            borderColor: 'black', 
          },
          '&.Mui-focused fieldset': {
            borderColor: 'black', 
          },
         },
          '& .MuiInputLabel-root': {
            color: 'black', 
            fontFamily: "Roboto",
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: 'black', 
            fontFamily: "Roboto"
          },
        }}
      />
      <Button 
        variant="contained"
        onClick={() => {
          handleOpen()
        }}
      >
        Add New Item
      </Button>
      <Box
        width="800px"
      >
        <Box 
          display="flex"
          width="800px"
          height="60px"
          bgcolor="#ADD8E6"
          alignItems="center" 
          justifyContent="center"
        >
          <Typography variant='h4' color='#333' sx={{fontFamily: 'Roboto'}}>
            Inventory Items
          </Typography>
        </Box>
      <Stack width="800px" height="300px" spacing={4} overflow="auto" bgcolor='#FFFFFF'>
        {
          filteredInventory.map(({name, quantity}) => (
            <Box
              key={name} 
              width="100%"
              minHeight="70px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgColor="#FFFFFF"
              padding={6}
              >
                <Typography 
                variant="h5"
                color="#333"
                textAlign="center"
                sx={{fontFamily: 'Roboto'}}
                >
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography 
                variant="h5"
                color="#333"
                textAlign="center"
                sx={{fontFamily: 'Roboto'}}
                >
                  {quantity}
                </Typography>
                <Stack 
                  direction="row"
                  spacing={2}>
                    <Button
                      variant="contained"
                      onClick={() => {
                        addItem(name)
                      }}
                    >
                      Add
                    </Button>
                <Button 
                  variant="contained"
                  onClick={() => {
                    removeItem(name)
                  }}
                >
                  Remove
                </Button>
                </Stack>
              </Box>
        ))}
      </Stack>
      </Box>
    </Box>
  )
}
