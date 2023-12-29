import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function SignIn() {
  const [formData,setFormData] = useState({}) 
  const [error,setError] = useState(null)
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate()
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit =async (e) =>{
    e.preventDefault();
    try {
      setLoading(true)
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if(data.success === false){
        setLoading(false)
        setError(data.errorMessage)
      }
      setLoading(false)
      if(data._id){
        setError(null)
        navigate('/')
      }
    } catch (error) {
      setLoading(false)
      setError(error.message)
    }
  }
  return (
    <div  className='p-3 max-w-lg mx-auto'>
    <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
    <form className='flex flex-col gap-4 mx-auto' onSubmit={handleSubmit}>
      <input type="email" className='p-3 rounded-lg border' placeholder='email' id='email' onChange={handleChange}/>
      <input type="password" className='p-3 rounded-lg border' placeholder='password' id='password' onChange={handleChange}/>
      <button disabled={loading} className='rounded-lg p-3 uppercase bg-slate-700 text-white hover:opacity-95 disabled:opacity-80'>{loading?'loading...':'Sign In'}</button>
    </form>
    <div className='flex gap-2 mt-4'>
      <p>Dont have an account?</p>
      <Link to="/signup" className='text-blue-700'>Sign Up</Link>
    </div>
    {error && <p className='text-red-500'>{error}</p>}
  </div>
  )
}
