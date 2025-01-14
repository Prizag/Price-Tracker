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


    async function loadItems()
    {
        if(token)
        {
            const  decoded = jwtDecode(token);
                  const userId = decoded.userId
            try 
            {
                const response = await axios.get('http://localhost:3000/item/list',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                        params: { userId: userId }
                    }
                )   
                console.log("Fetched Items:", response.data);
                setItems(response.data) 

            } catch (error) 
            {
                console.error("Error fetching items:", error);
            }
        }
    }

    
    
  return (
    <div>
      
      <h1>
        Hello world
      </h1>
    </div>

  )
}

export default Tracker
