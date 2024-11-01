import {useEffect} from 'react'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const navigate = useNavigate()
  const Logout = ()=>{
    localStorage.clear('token')
    navigate('/login')
  }
  useEffect(() => {
    const token = localStorage.getItem('token')
    if(!token)
    {
      alert("Login or Signin First")
      navigate('/login')
    }
  }, [])

  
  return (
    
    <div>
      <div>
        Dashboard
      </div>
      <div>
        <button onClick={Logout}>Log out</button>
      </div>
    </div>
    
  )
}

export default Dashboard