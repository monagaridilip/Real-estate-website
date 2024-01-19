import { useSelector } from "react-redux"
import { useEffect, useRef, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef();
  const [file,setFile] = useState(undefined)
  const [filePer,setFilePerc] = useState(0);
  const [fileUploadError,setFileUploadError] = useState(false);
  const [formData,setFormData] = useState({});
  
  console.log(filePer)
  console.log(formData)
  console.log(fileUploadError)
  useEffect(()=>{
    if(file){
      handleFileUpload(file);
    }
  },[file]);

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
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-3'>
         <input type="file" 
         ref={fileRef} 
         hidden 
         accept="image/*"
         onChange={(e)=>setFile(e.target.files[0])}
         />
        <img onClick={()=>fileRef.current.click()} src={ formData.avatar || currentUser.avatar} alt="profile" className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"/>
         <p className="text-sm self-center">
         {
           fileUploadError ? (<span className="text-red-700">Error Uploading image(Image must be less than 2mb)</span>)
           : filePer >0 && filePer < 100 ? <span className="text-black-700">Uploading {filePer}% completed</span>
           : filePer == 100 ? <span className="text-green-700">Image Uploaded Successfully</span>
           : ''
          }
          </p>
        <input type="text" name="username" id="username" placeholder="username" className="border p-3 rounded-lg"/>
        <input type="email" name="email" id="email" placeholder="email" className="border p-3 rounded-lg"/>
        <input type="password" name="password" id="password" placeholder="password" className="border p-3 rounded-lg"/>
        <button className="bg-slate-700 rounded-lg text-white p-3 uppercase hover:opacity-90">Update</button>
      </form>
      <div className="flex justify-between mt-4">
        <span className="text-red-600 cursor-pointer ">Delect account</span>
        <span className="text-red-600 cursor-pointer ">Sign out</span>
      </div>
    </div>
  )
}
