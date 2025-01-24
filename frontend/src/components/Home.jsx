/* eslint-disable react/no-unescaped-entities */

import { Bell, LineChart, Search,} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'



const Home = () => {

    const navigate = useNavigate()
      const dash = ()=>{
        navigate('/dashboard')
      }


  return (
    <div>
       <section className="px-4 py-12 bg-white md:px-6 lg:px-8">
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
    </section>
    <section className="px-4 py-12 md:px-6 lg:px-8 bg-gray-100">
        <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Ready to Start Saving?</h2>
        <p className="text-xl text-gray-600 mb-8">
            Join thousands of smart shoppers who never miss a deal.
        </p>
        <Button size="lg" onClick={dash} className="bg-gray-900 text-white hover:bg-gray-800" >Check your DashBoard</Button>
        </div>

    </section>
    </div>
  )
}

export default Home
