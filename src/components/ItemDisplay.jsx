import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Button, List, ListItem, Card, CardMedia } from '@mui/material';

const ItemDisplay = () => {
  const [currentItem, setCurrentItem] = useState(null);
  const [banList, setBanList] = useState([]);
  const [viewedItems, setViewedItems] = useState([]);
  const [isDiscovered, setIsDiscovered] = useState(false);

  const fetchData = async () => {
    const API_KEY = 'live_6mNC6T50mZQBoqlEtbvi8r3PsZWt63XI7HWTdoRqDYuCNuEK4bhvahyL936cXQPf';
    let data;

    try {
      do {
        const res = await fetch('https://api.thecatapi.com/v1/images/search', {
          headers: {
            'x-api-key': API_KEY,
          },
        })

        if (!res.ok) throw new Error("Failed to fetch data");

        data = await res.json();
      } while (
        !data[0]?.breeds?.[0]?.name ||
        banList.includes(data[0].breeds[0].name) ||
        banList.includes(data[0].breeds[0]?.weight?.metric) ||
        banList.includes(data[0].breeds[0]?.origin) ||
        banList.includes(data[0].breeds[0]?.life_span)
      )

      setCurrentItem(data[0]);
      setIsDiscovered(true);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error fetching cat data. Please try again.");
    }
  }

  // Add or remove an attribute
  const toggleBanAttribute = (attr) => {
    if (attr) {
      if (banList.includes(attr)) {
        // Remove
        setBanList(banList.filter((item) => item !== attr));
      } else {
        // Add
        setBanList([...banList, attr]);
      }
    }
  }

  useEffect(() => {
    if (currentItem) {
      setViewedItems((prevItems) => [...prevItems, currentItem]);
    }
  }, [currentItem]);

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 3 }}>
      <Grid container spacing={2} sx={{ height: '100%' }}>
        <Grid item xs={12} sm={3} sx={{ backgroundColor: 'black', color: 'white', padding: 2 }}>
          <Typography variant="h6" align="center">
            Who have we seen so far?
          </Typography>
          <List sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {viewedItems.map((item, index) => (
              <ListItem key={index}>
                <Card sx={{ backgroundColor: '#333', color: 'white', width: '100%' }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={item.url}
                    alt="Seen Cat"
                    sx={{ objectFit: 'cover' }}
                  />
                  <Typography variant="body1" sx={{ p: 1 }}>
                    {item.breeds?.[0]?.name
                      ? `A ${item.breeds[0].name} cat from ${item.breeds[0]?.origin || 'Unknown'}`
                      : 'A cat with no breed information'}
                  </Typography>
                </Card>
              </ListItem>
            ))}
          </List>
        </Grid>

        <Grid item xs={12} sm={6} sx={{ textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Veni Vici!
          </Typography>
          <Typography variant="h6" gutterBottom>
            Discover cats from your wildest dreams!
          </Typography>

          {isDiscovered && currentItem ? (
            <>
              <Typography variant="h5">
                {currentItem.breeds?.[0]?.name || 'Breed not available'}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, my: 2 }}>
                <Box
                  sx={{ backgroundColor: 'black', color: 'white', p: 1 }}
                  onClick={() => toggleBanAttribute(currentItem.breeds?.[0]?.name)}
                >
                  {currentItem.breeds?.[0]?.name}
                </Box>
                <Box
                  sx={{ backgroundColor: 'black', color: 'white', p: 1 }}
                  onClick={() => toggleBanAttribute(currentItem.breeds?.[0]?.weight?.metric)}
                >
                  {currentItem.breeds?.[0]?.weight?.metric} lbs
                </Box>
                <Box
                  sx={{ backgroundColor: 'black', color: 'white', p: 1 }}
                  onClick={() => toggleBanAttribute(currentItem.breeds?.[0]?.origin)}
                >
                  {currentItem.breeds?.[0]?.origin}
                </Box>
                <Box
                  sx={{ backgroundColor: 'black', color: 'white', p: 1 }}
                  onClick={() => toggleBanAttribute(currentItem.breeds?.[0]?.life_span)}
                >
                  {currentItem.breeds?.[0]?.life_span} years
                </Box>
              </Box>
              <img
                src={currentItem.url}
                alt="Random Cat"
                style={{ maxWidth: '100%', height: '300px', objectFit: 'cover', borderRadius: '10px' }}
              />
            </>
          ) : (
            <Typography variant="body1">Click Discover to reveal a cat!</Typography>
          )}
          <Button variant="contained" sx={{ mt: 3 }} onClick={() => fetchData()}>
            Discover!
          </Button>
        </Grid>

        <Grid item xs={12} sm={3} sx={{ backgroundColor: 'black', color: 'white', padding: 2 }}>
          <Typography variant="h6" align="center">
            Ban List
          </Typography>
          <Typography variant="body2" align="center" gutterBottom>
            Click on an item to remove it from the ban list
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxHeight: '70vh', overflowY: 'auto' }}>
            {banList.map((item, index) => (
              <Button key={index} variant="contained" color="error" sx={{ my: 1 }} onClick={() => toggleBanAttribute(item)}>
                {item}
              </Button>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ItemDisplay;