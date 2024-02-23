import { useDispatch, useSelector } from "react-redux"
import { useEffect, useRef, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import { updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserFailure,
  deleteUserSuccess,
  signInStart, 
  signOutUserStart, 
  signOutUserFailure, 
  signOutUserSuccess } from "../redux store/user/userSlice";
import {Link} from 'react-router-dom'
export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [fileperc, setfileperc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingError,setShowListingError] = useState(false)
  const [ userListings, setUserListings] = useState([])
  const dispatch = useDispatch();
  

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setfileperc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
          );
          console.log(formData.avatar)
      }
    );
  };
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data)
      if (data.success === false) {
        dispatch(updateUserFailure(data.errorMessage));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async() =>{
    try {
      dispatch(deleteUserStart);
      const res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method:'DELETE'
      }) 
      const data = await res.json();
      if(data.success == false){
        dispatch(deleteUserFailure(data.errorMessage))
        return;
      }
      dispatch(deleteUserSuccess(data))
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }

  const handleSignOut = async() =>{
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if( data.success == false){
        dispatch(signOutUserFailure(data.errorMessage))
        return;
      }
      dispatch(signOutUserSuccess(data))
    } catch (error) {
      dispatch(signOutUserFailure(error.message))
    }
  }

  const handleShowListing = async () =>{
    try {
      setShowListingError(false)
      const res = await fetch(`/api/user/listing/${currentUser._id}`)
      const data = await res.json();
      if( data.success === false){
        setFileUploadError(true)
        return
      }
      setUserListings(data)
      console.log(userListings)
    } catch (error) {
      setShowListingError(true)
    }
  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-3' onSubmit={handleSubmit}>
         <input type="file" 
         ref={fileRef} 
         hidden 
         accept="image/*"
         onChange={(e)=>setFile(e.target.files[0])}
         />
       <img
          onClick={() => fileRef.current.click()}
          src={currentUser.avatar ? currentUser.avatar : formData.avatar}
          alt='profile'
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
        />
        <p className="text-sm self-center">
         {
           fileUploadError ? (<span className="text-red-700">Error Uploading image(Image must be less than 2mb)</span>)
           : fileperc >0 && fileperc < 100 ? <span className="text-black-700">Uploading {fileperc}% completed</span>
           : fileperc == 100 ? <span className="text-green-700">Image Uploaded Successfully</span>
           : ''
          }
          </p>
        <input type="text" defaultValue={currentUser.username} onChange={handleChange} name="username" id="username" placeholder="username" className="border p-3 rounded-lg"/>
        <input type="email" defaultValue={currentUser.email} onChange={handleChange} name="email" id="email" placeholder="email" className="border p-3 rounded-lg"/>
        <input type="password" name="password" id="password" onChange={handleChange} placeholder="password" className="border p-3 rounded-lg"/>
        <button
          disabled={loading}
          className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Update'}
        </button>
        
        <Link to={'/create'} 
        className="bg-green-700 text-white text-center rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80 ">
          Create Listing
        </Link>
        
        
      </form>
      <div className="flex justify-between mt-4">
        <span onClick={handleDeleteUser} className="text-red-600 cursor-pointer ">Delect account</span>
        <span onClick={handleSignOut} className="text-red-600 cursor-pointer ">Sign out</span>
      </div>
      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'>
        {updateSuccess ? 'User is updated successfully!' : ''}
      </p>
      <button onClick={handleShowListing} type="button" className="text-green-700 w-full">Show Listings</button>
      <p className="text-red-700 w-full">{showListingError?"Error in showing Listing" : ""}</p>
      {userListings && userListings.length > 0 &&
      <div className="flex flex-col gap-4">
        <h1 className="text-center text-2xl font-semibold mt-6">Your Listings</h1>
        {userListings.map((listing)=>{
          return <div key={listing._id} className="bor
           rounded-lg p-3 flex justify-between items-center gap-4">
            <Link to={`/listing/${listing._id}`}>
            <img className="h-16 w-16 object-contain" src={listing.imageUrls[0]} alt="Listing images" />
            </Link>
            <Link className="flex-1 text-slate-700 font-semibold hover:underline truncate" to={`/listing/${listing._id}`}>
              <p>{listing.name }</p>
            </Link>
            <div className="flex flex-col items-center">
              <button className="text-red-700 uppercase">DELETE</button>
              <button className="text-green-700 uppercase">EDIT</button>
            </div>
          </div>
        })}

      </div>
      }
    </div>
  )
}
