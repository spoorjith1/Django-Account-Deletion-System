import React from 'react'
import { useEffect, useState, useContext } from 'react'
import axiosInstance from '../axiosInstance'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../AuthProvider'
import { Link } from 'react-router-dom'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [restoreLoading, setRestoreLoading] = useState(false)
  const [restoreError, setRestoreError] = useState('')
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [scheduledDelete, setScheduledDelete] = useState(null)
  const {isLoggedIn, setIsLoggedIn} = useContext(AuthContext)

  const handleLogin = async (e)=> {
    e.preventDefault();
    if (!username) {
      setError('Please Enter username')
      setTimeout(()=> {setError('')}, 3000 )
      return
    }
    if (!password) {
      setError('Please Enter password')
      setTimeout(()=> {setError('')}, 3000 )
      return
    }

    setLoading(true)

    const userData = {username, password}

    try {
      const response = await axiosInstance.post('/token/', userData)
      if (response.data.account_scheduled_for_deletion) {
        setScheduledDelete(response.data)
        setError('')
        return
      }
      localStorage.setItem('accessToken', response.data.access)
      localStorage.setItem('refreshToken', response.data.refresh)
      setIsLoggedIn(true)
      setError('')
      navigate('/home')
    }
    catch (error) {
      setError('InValid email or password')
      setTimeout(()=> {setError('')}, 3000 )
      setUsername('')
      setPassword('')
    }
    finally {
      setLoading(false)
    }
  }

  const handleOk = ()=> {
    setScheduledDelete(null)
    setUsername('')
    setPassword('')
  }

  const handleRestore = async ()=> {
    setRestoreLoading(true)
    try {
      const response = await axiosInstance.post('/account-restore/', {user_id: scheduledDelete.user_id})
      setScheduledDelete(null)
      alert('Account Restored')
    }
    catch (error) {
      setRestoreError('Failed to restore account')
    }
    finally {
      setRestoreLoading(false)
    }
  }

  return (
    <div className='page-container login-register-page'>
      <div className='sign-container'>
        <h2 className='sign-title'>Login</h2>
        {scheduledDelete &&
        <div className='acc-restore-box'>
          <h3 className='restore-title'>Account scheduled for deletion</h3>
          <p className='restore-content'>Your account is scheduled for deletion</p>
          <p className='restore-content'>deletion date : <b>{new Date(scheduledDelete.deletion_date).toLocaleDateString()}</b></p>
          <div className='restore-btns-box'>
            <button type='button' onClick={handleOk} className='res-btns ok-btn'>Ok</button>
            {restoreLoading ? (
              <button type='button' disabled className='restore-btn'>Restoring Account...</button>
            ) : (
              <button type='button' onClick={handleRestore} className='restore-btn'>Restore Account</button>
            )}
          </div>
        </div>
        }
        <form onSubmit={handleLogin} className='form-box'>
          <div className='input-box'>
            <label className='input-labels'>username : </label>
            <input type='text' value={username} onChange={(e)=> setUsername(e.target.value)} className='input-fields'/>
          </div>
          <div className='input-box'>
            <label className='input-labels'>Password : </label>
            <input type='password' value={password} onChange={(e)=> setPassword(e.target.value)}  className='input-fields' />
          </div>
          {error && <div className='sign-error'>{error}</div>}
          {loading ? 
          (<button type='submit' className='sign-btn' disabled>Logging In...</button>) 
          : 
          (<button type='submit' className='sign-btn'>Login</button>)
          }
        </form>
        <p className='sign-alter'>New ? <Link to='/register' className='alter-link'>Register</Link></p>
      </div>
    </div>
  )
}

export default Login
