import React, { useEffect, useState } from 'react'
import axiosInstance from '../axiosInstance'
import { Link } from 'react-router-dom'
import Logout from '../components/Logout'

function Home() {
  const [userData, setUserData] = useState('')
  const [error, setError] = useState('')

  useEffect(()=> {
    const fetchUserData = async ()=> {
      try {
        const response = await axiosInstance.get('/profile/me/')
        setUserData(response.data)
      }
      catch (error) {
        setError('Failed to load user data')
      }
    }
    fetchUserData();
  }, [])
  return (
    <div className='page-container page'>
      <div className='container'>
        {error && <div>{error}</div>}

        <h2 className='profile-title'>Profile Page</h2>
        <div className='user-details-box'>
          <div className="user-details">
            <p>Username : <span className='username-span'>{userData.username}</span></p>
            <p>Email : <span className='email-span'>{userData.email}</span></p>
          </div>
        </div>

        <div className='acc-action-box'>
            <Link to='/change-password' className='acc-action-link'>Change Password</Link>
            <Link to='/account-deletion' className='acc-action-link'>Delete your account</Link>
            <Logout />
        </div>

      </div>
    </div>
  )
}

export default Home
