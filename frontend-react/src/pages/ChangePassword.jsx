import React, { useState } from 'react'
import axiosInstance from '../axiosInstance'
import { useNavigate } from 'react-router-dom'

function PasswordChange() {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const showError = (message) => {
    setError(message)
    setTimeout(() => {setError('')}, 3000)
  }

  const handlePasswordChange = async (e)=> {
    e.preventDefault();
    setSuccess('')

    if (!oldPassword) {
      showError('Please Enter old password')
      return
    }

    if (!newPassword) {
      showError('Please Enter new password')
      return
    }

    if (!confirmPassword) {
      showError('Please Enter confirm password')
      return
    }

    if (newPassword !== confirmPassword) {
      showError('passwords did not match, please enter again')
      return
    }

    setLoading(true)

    const passwords = {old_password: oldPassword, new_password: newPassword}
    try {
      const response = await axiosInstance.put('/profile/change-password/', passwords)
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setError('')
      setSuccess(response.data.message)
      setTimeout(() => {
        setSuccess('')
        navigate('/')},
      3000)
    }
    catch (error) {
      const data = error.response?.data
      if (data?.old_password) {
        showError(data.old_password[0])
      }
      else if (data?.new_password) {
        showError(data.new_password[0])
      }
      else {
        showError('Failed to change password')
      }
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <div className='page-container page'>
      <div className='container'>
        <h3 className='change-title'>Change Password</h3>
        <div className='change-box'>
          <form className='change-form' onSubmit={handlePasswordChange}>
            <div className='pass-input-box'>
              <label className='pass-labels'>Current Password</label>
              <input type='password' className='pass-input' value={oldPassword} onChange={(e)=> setOldPassword(e.target.value)} autoComplete='current-password' />
            </div>
            <div className='pass-input-box'>
              <label className='pass-labels'>New Password</label>
              <input type='password' className='pass-input' value={newPassword} onChange={(e)=> setNewPassword(e.target.value)} autoComplete='new-password' />
            </div>
            <div className='pass-input-box'>
              <label className='pass-labels'>Confirm Password</label>
              <input type='password' className='pass-input' value={confirmPassword} onChange={(e)=> setConfirmPassword(e.target.value)} autoComplete='new-password' />
            </div>
            {error && <div className='pass-error'>{error}</div>}
            {loading ? (
              <button className='pass-change-btn' type='submit' disabled>Changing Password...</button>
            ) : (
              <button className='pass-change-btn' type='submit'>Change Password</button>
            )}
            {success && <div className='pass-success'><p>{success}</p></div>}
          </form>
        </div>
      </div>
    </div>
  )
}

export default PasswordChange
