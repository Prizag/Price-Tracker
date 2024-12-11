/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */



'use client'

import * as React from 'react'
import { useState } from 'react'
import { Bell, ChevronDown, LineChart, Menu, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
  SidebarProvider,
} from '@/components/ui/sidebar'

export default function Dashboard() {

  //changes made
  /* ----------------------------------- */
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async ()=>{
    const response = await axios.get(`http://localhost:3000/search?query=${query}`);
    setResults(response.data)
    console.log(response.data);
  }

/* ----------------------------------- */

  const navigate = useNavigate()
  const Logout = ()=>{
    localStorage.clear('token')
    navigate('/login')
  }
  React.useEffect(() => {
    const token = localStorage.getItem('token')
    if(!token)
    {
      alert("Login or Signin First")
      navigate('/login')
    }
  }, []);
  const [trackedItems, setTrackedItems] = React.useState([
    { name: 'Smartphone X', currentPrice: 599, history: [650, 625, 610, 599] },
    { name: 'Laptop Y', currentPrice: 1299, history: [1399, 1350, 1299] },
    { name: 'Headphones Z', currentPrice: 199, history: [249, 229, 209, 199] },
  ])

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-100 text-gray-900">
        <Sidebar className="bg-white border-r border-gray-200">
          <SidebarHeader className="px-4 py-2 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800">Price History</h2>
          </SidebarHeader>
          <SidebarContent>
            {trackedItems.map((item, index) => (
              <div key={index} className="p-4 border-b border-gray-200">
                <h3 className="font-medium text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-600">Current: ${item.currentPrice}</p>
                <div className="mt-2">
                  <LineChart className="h-16 w-full text-gray-400" />
                </div>
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
          {/* <section className="px-4 py-12 bg-white md:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">How It Works</h2>
              <div className="grid gap-8 md:grid-cols-3">
                <div className="text-center">
                  <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">Find Products</h3>
                  <p className="text-gray-600">Paste the URL of any product you want to track.</p>
                </div>
                <div className="text-center">
                  <LineChart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">Monitor Prices</h3>
                  <p className="text-gray-600">We'll keep an eye on price changes for you.</p>
                </div>
                <div className="text-center">
                  <Bell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">Get Alerts</h3>
                  <p className="text-gray-600">Receive notifications when prices drop.</p>
                </div>
              </div>
            </div>
          </section> */}
          <section className="px-4 py-12 md:px-6 lg:px-8 bg-gray-100">
            {/* <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4 text-gray-800">Ready to Start Saving?</h2>
              <p className="text-xl text-gray-600 mb-8">
                Join thousands of smart shoppers who never miss a deal.
              </p>
              <Button size="lg" className="bg-gray-900 text-white hover:bg-gray-800">Sign Up for Free</Button>
            </div> */}


            {/* Changes Made */ }
            {/* ----------------------------------- */}
            {results && results.map((item,index)=>(
              <div key={index}>
                   <h3>{item.title}</h3>
                    <img src={item.image} alt={item.title} width="100" />
                    <p>{item.price}</p>
              </div>

              
            ))}
            {/* ----------------------------------- */ }


          </section>
        </main>
      </div>
    </SidebarProvider>
  )
}

