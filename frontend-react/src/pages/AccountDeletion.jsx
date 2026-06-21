import React from 'react'
import { useNavigate } from 'react-router-dom'

function AccountDeletion() {
  const navigate = useNavigate()

  return (
    <div className='page-container page'>
      <div className="container">
        <h3 className='delete-title'>Delete your Account</h3>
        <div className='delete-box'>
          <p><b>NOTE :</b> by deleting your account, your whole data from this application will permanently be deleted. and you cannot retrieve the data in the future. if you think you did a mistake you will have next <b>30 Days</b> to login back to your account and "Cancel the Account Deletion". after 30 Days the account will permanently removed from our database.</p>
          <div className='delete-btns-box'>
            <button className='del-cancel-btn' onClick={()=> navigate('/')}>Cancel</button>
            <button className='del-confirm-btn'>Yes, Delete the Account</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountDeletion
