import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { signInStart,signInSuccess,signInFailure } from '../redux store/user/userSlice'
import OAuth from '../components/OAuth'
export default function SignOut() {
  const [formData,setFormData] = useState({}) 
  const {loading,error} = useSelector((state)=>state.user)
  const dispatch = useDispatch();
  
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
      dispatch(signInStart())
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      // console.log(data);
      if(data.success === false){
        dispatch(signInFailure(data.errorMessage))
      }
      else{
        dispatch(signInSuccess(data))
        navigate('/signin')
      }
    } catch (error) {
      dispatch(signInFailure(error.message))
    }
  }
  return (
    <div  className='p-3 max-w-lg mx-auto'>
    <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
    <form className='flex flex-col gap-4 mx-auto' onSubmit={handleSubmit}>
      <input type="text" className='p-3 rounded-lg border' placeholder='username' id='username'  onChange={handleChange}/>
      <input type="email" className='p-3 rounded-lg border' placeholder='email' id='email' onChange={handleChange}/>
      <input type="password" className='p-3 rounded-lg border' placeholder='password' id='password' onChange={handleChange}/>
      <button disabled={loading} className='rounded-lg p-3 uppercase bg-slate-700 text-white hover:opacity-95 disabled:opacity-80'>{loading?'loading...':'Sign Up'}</button>
    <OAuth/>
    </form>
    <div className='flex gap-2 mt-4'>
      <p>Have an account?</p>
      <Link to="/signin" className='text-blue-700'>Sign in</Link>
    </div>
    {error && <p className='text-red-500'>{error}</p>}
  </div>
  )
}
