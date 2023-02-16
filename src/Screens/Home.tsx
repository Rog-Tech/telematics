import React from 'react'
import {Button} from 'primereact/button'
import { useLocation, useNavigate } from 'react-router-dom'
export const Home = () => {
  const navigate = useNavigate()

  return (
    <div>
      <Button onClick={()=> navigate('/dashboard')} label='Login' />
    </div>
  )
}
