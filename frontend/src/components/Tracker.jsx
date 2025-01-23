import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
const Tracker = () => {

    const [token,setToken] = useState('');
    const [items,setItems] = useState([]);

    useEffect(() => {
      const tok = localStorage.getItem('token');
      if(!tok)
      {
        const navigate = useNavigate();
        navigate('/signin')
      }
      setToken(tok)
    }, [])


    useEffect(()=>{
        loadItems();
    },[token])


    async function loadItems() {
      const tok = localStorage.getItem('token');
      if (!tok) return;
  
      try {
          const decoded = jwtDecode(tok);
          const userId = decoded.userId;
          const response = await axios.get('http://localhost:3000/item/list', {
              headers: { Authorization: `Bearer ${tok}` },
              params: { userId },
          });
  
          const arr = response.data.data;
          const updatedArr = await Promise.all(
              arr.map(async (item) => {
                  try {
                      const imageResponse = await axios.get('http://localhost:3000/getImage', {
                          headers: { Authorization: `Bearer ${tok}` },
                          params: { url: item.url },
                      });
                      return { ...item, url: imageResponse.data };
                  } catch (error) {
                      console.error(`Error fetching image for ${item.title}:`, error);
                      return item; // Return the item without changes
                  }
              })
          );
          setItems(updatedArr);
          console.log("Setted Items")
      } catch (error) {
          console.error("Error fetching items:", error);
      }
  }
  

  useEffect(() => {
    console.log('Updated items:', items);
}, [items]);
    
  return (
    <div>
      {items && items.map((item)=>(
        <div key={item._id}> 
          <h1>{item.title}</h1>
          <img src={item.url.imageUrl} alt="Image not found" srcSet="" />
        </div>
        
      ))}
    </div>

  )
}

export default Tracker
