

'use client'

import * as React from 'react'
import { useState,useEffect } from 'react'
import { Bell, ChevronDown, LineChart, Menu, Search, BellOff} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useNavigate } from 'react-router-dom'
import {  jwtDecode } from 'jwt-decode';

import axios from 'axios'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
  SidebarProvider,
} from '@/components/ui/sidebar'


export default function Dashboard() {

  let userId = "";
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const[token,setToken]=useState("");
  const url="http://localhost:3000";
  const handleSearch = async ()=>{
    const response = await axios.get(`http://localhost:3000/search?query=${query}`);
    setResults(response.data)
    console.log(response.data);
  }

const [savedStates, setSavedStates] = useState(
  results.map(() => false) 
);


  const navigate = useNavigate()
  const Logout = ()=>{
    localStorage.clear('token')
    navigate('/login')
  }
  
  
  const [trackedItems, setTrackedItems] = React.useState([
  ])
  useEffect(() => {
    const token = localStorage.getItem('token')
    if(!token)
    {
      alert("Login or Signin First")
      navigate('/login')
    }
    if(token){
      setToken(localStorage.getItem("token"));
      try {
        
        // const decoded = jwtDecode(token);
        // userId = decoded.userId
        console.log("decoded userId", userId);

      } catch (error) {
        console.error("Error decoding token:", err.message);
      }
    }
    fetchItemList();
  }, []);
  const fetchItemList=async()=>{
    const response=await axios.get(url+"/item/list");
    console.log("fetched Items")
    setTrackedItems(response.data.data);
  };
   
  const toggleSave = async (item,index) => {
    setSavedStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[index] = !newStates[index];
    
      return newStates;
    });

    if(token){
      const  decoded = jwtDecode(token);
      const userId = decoded.userId
      console.log("User Id decoded", userId)
      if (!userId || userId === "") {
        console.log("Invalid userId, can't save item");
        return;
      }

      await axios.post(url+"/item/store",{
        title:item.title?.toString() || "Untitled",
        price: item.price?.toString() || "0",
        url:item.newUrl.toString(),
        userId:userId});
    }
    await fetchItemList();
   
    console.log(trackedItems);
  };
  const removeItem = async (itemId) => {
    setTrackedItems((prev) => prev.filter((item) => item.id !== itemId));
     if(token){
      
      console.log("remove Triggred", itemId)
      await axios.post("http://localhost:3000/item/remove",{itemId:itemId,userId:userId});
     }
    await fetchItemList();
    console.log(trackedItems);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-100 text-gray-900">
        <Sidebar className="bg-white border-r border-gray-200">
          <SidebarHeader className="px-4 py-2 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800">Price History</h2>
          </SidebarHeader>
          <SidebarContent>
            { trackedItems.map((item, index) => (
              <div key={index} className="p-4 border-b border-gray-200">
                <h3 className="font-medium text-gray-800">{item.title}</h3>
                <p className="text-sm text-gray-600">Current: {item.price}</p>
                <div className="mt-2">
                  <LineChart className="h-16 w-full text-gray-400" />
                </div>
                <button className='px-2 py-2 text-sm text-white rounded bg-black hover:bg-slate-700' onClick={()=>removeItem(item._id)}>Remove Item</button>
              </div>
            ))}
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 bg-gray-50">
          <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <SidebarTrigger>
                <Menu className="h-6 w-6 text-gray-600" />
              </SidebarTrigger>
              <h1 className="text-2xl font-bold text-gray-800">PriceWatch</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
                <Bell className="h-5 w-5" />
              </Button>
              <Button onClick={Logout} variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900 font-bold">
                Log out
              </Button>
            </div>
          </header>
          <section className="px-4 py-12 md:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                Track Prices, Save Money
              </h2>
              <p className="mt-4 text-xl text-gray-600">
                Never overpay again. PriceWatch monitors your favorite products and alerts you when prices drop.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Input 
                  type="text" 
                  onChange ={(e)=>{setQuery(e.target.value)}}
                  placeholder="Enter product URL" 
                  className="w-full sm:w-96 bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                />
                <Button  onClick={handleSearch}size="lg" className="bg-gray-900 text-white hover:bg-gray-800">
                  Start Tracking
                </Button>
              </div>
            </div>
          </section>
          {results && (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
    {results.map((item, index) => (
      <div
        key={index}
        className="border border-gray-300 rounded-lg p-3 text-center bg-gray-100 shadow-md h-72"
      >
        <h3 className="text-lg font-semibold mb-2 truncate">{item.title}</h3>
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-36 object-contain rounded-md mb-2"
        />
        <a href={item.newUrl}><p className="text-md text-gray-700 mb-4 truncate" >{item.price}</p></a>
       <button
              className={`px-4 py-2 text-sm text-white rounded ${
                savedStates[index] ? "bg-gray-700 " : "bg-black hover:bg-slate-700"
              }`}
              onClick={() => toggleSave(item,index)}
            >
              {savedStates[index] ? "Saved!" : "Save Product"}
            </button>
      </div>
    ))}
  </div>
)}

       
        </main>
      </div>
    </SidebarProvider>
  )
}

