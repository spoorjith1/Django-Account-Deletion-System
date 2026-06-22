import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../axiosInstance'

function AccountDeletion() {
  const [success, setSuccess] = useState('')
  const [error, SetError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleDeletion = async ()=> {
    setLoading(true)
    try {
      const response = await axiosInstance.post('/profile/account-delete/')
      setSuccess('Account Deleted Successfully')
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      setTimeout(()=> {
        setSuccess('')
        navigate('/login')
      }, 1500)
    }
    catch (error) {
      SetError('Failed to delete account')
      setTimeout(()=> {SetError('')}, 3000)
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <div className='page-container page'>
      <div className="container">
        {error && <div className='del-error'>{error}</div>}
        <h3 className='delete-title'>Delete your Account</h3>
        <div className='delete-box'>
          <p><b>NOTE :</b> by deleting your account, your whole data from this application will permanently be deleted. and you cannot retrieve the data in the future. if you think you did a mistake you will have next <b>30 Days</b> to login back to your account and "Cancel the Account Deletion". after 30 Days the account will permanently removed from our database.</p>
          <div className='delete-btns-box'>
            <button className='del-cancel-btn' onClick={()=> navigate('/')}>Cancel</button>
            {loading ? (
              <button className='del-confirm-btn' disabled>Deleting Account...</button>
            ) : (
              <button className='del-confirm-btn' onClick={handleDeletion}>Yes, Delete the Account</button>
            )}
          </div>
        </div>
        {success && <div className='del-success'>{success}</div>}
      </div>
    </div>
  )
}

export default AccountDeletion
