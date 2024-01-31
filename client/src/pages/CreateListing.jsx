import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react'
import { app } from '../firebase';

export default function CreateListing() {
    const [files,setFiles] = useState([])
    const [formData,setFormData] = useState({
        imageUrls: [],
    })
    const [imageUploadError,setImageuploadError] = useState(false)
    const [uploading,setUploading]= useState(false);
    console.log(formData)

     
    const handleUploadButton = () =>{
        if( files.length > 0 && files.length + formData.imageUrls.length < 7){
            const promises = [];
            setUploading(true)
            setImageuploadError(false)
            for (let i = 0; i < files.length; i++){
                promises.push(storageImage(files[i]))
            }
            Promise.all(promises).then((urls)=>{
                setFormData({
                    ...formData,
                    imageUrls:formData.imageUrls.concat(urls)
                });
                setImageuploadError(false)
                setUploading(false)
            }).catch((error)=>{
                setImageuploadError('Image upload failed (2mb max per image) and should be image type only')
                setUploading(false)
            })
        }else{
            setImageuploadError('Upload only 6 images per listing')
            setUploading(false)
        }
    }
    const storageImage = async (file) =>{
        return new Promise((resolve,reject)=>{
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage,fileName);
            const uploadTask = uploadBytesResumable(storageRef,file);
            uploadTask.on("state_changed",
            (snapshot)=>{
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`Uploading is ${Math.round(progress)}% completed`);
            },
            (error)=>{
                reject(error);
            },
            ()=>{
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                    resolve(downloadURL)
                })
            }
            )
        })
    }
    const handleRemoveImage = (index) =>{
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_,i)=> i !== index)
        })
    }
  return (
    <main className='p-3 mx-auto max-w-4xl'>
      <h1 className='text-3xl font-semibold text-center my-7'>Create Listing</h1>
      <form className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
        <input type="text" className='border p-3 rounded-lg' name="name" id="name" minLength='4' maxLength='62' required placeholder='Name' />
        <textarea type="text" className='border p-3 rounded-lg' name="description" id="description"  required placeholder='Description' />
        <input type="text" className='border p-3 rounded-lg' name="address" id="address"  required placeholder='Address' />
        <div className='flex flex-wrap gap-6'>
            <div className='flex gap-2'>
                <input type="checkbox" id='sale' className='w-5'/>
                <span>Sell</span>
            </div>
            <div className='flex gap-2'>
                <input type="checkbox" id='rent' className='w-5'/>
                <span>Rent</span>
            </div>
            <div className='flex gap-2'>
                <input type="checkbox" id='parking' className='w-5'/>
                <span>Parking Spot</span>
            </div>
            <div className='flex gap-2'>
                <input type="checkbox" id='furnished' className='w-5'/>
                <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
                <input type="checkbox" id='offer' className='w-5'/>
                <span>Offer</span>
            </div>
        </div>
        <div className='flex flex-wrap gap-6'>
            <div className="flex items-center gap-2">
                <input type="number" className='border border-gray-300 rounded-lg p-3 ' name="bedrooms" id="bedrooms" required min="1" max="10"/>
                <p>BedRooms</p>
            </div>
            <div className="flex items-center gap-2">
                <input type="number" className='border border-gray-300 rounded-lg p-3 ' name="bathrooms" id="bathrooms" required min="1" max="5"/>
                <p>Bathrooms</p>
            </div>
            <div className="flex items-center gap-2">
                <input type="number" className='border border-gray-300 rounded-lg p-3 ' name="regularPrice" id="regularPrice" required placeholder='Rs.'min="1" max="50000"/>
                <div className='flex flex-col items-center '>
                <p>Regular Price</p>
                <span className='text-xs'>(Rs / month)</span>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <input type="number" className='border border-gray-300 rounded-lg p-3 ' name="discountPrice" id="discountPrice" required placeholder='Rs.' min="1" max="50000"/>
                <div className='flex flex-col items-center '>
                <p>Discounted Price</p>
                <span className='text-xs'>(Rs / month)</span>
                </div>
            </div>
        </div>
        </div>
        <div className='flex flex-col flex-1 gap-4'>
            <p className='font-semibold'>Images:
            <span className='font-normal text-gray-600 ml-2'>The First image will be the cover (max 6)</span>
            </p>
            <div className='flex gap-4'>
            <input type="file" onChange={(e)=>setFiles(e.target.files)} className='p-3 border border-gray-700 rounded w-full' id="images" accept='image/*' multiple />
            <button type='button' disabled={uploading} onClick={handleUploadButton} className='p-3 border border-green-700 text-white bg-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>{uploading?"uploading":"upload"}</button>
            </div>
            <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>
            {
                formData.imageUrls.length > 0 && formData.imageUrls.map((url, index)=>{
                    return <div key={url} className='flex justify-between p-3 border items-center'>
                        <img src={url} alt="listing url" className='w-20 h-20 object-contain rounded-lg'/>
                        <button type='button' onClick={()=>handleRemoveImage(index)} className='text-red-700 uppercase rounded-lg p-3 hover:opacity-70'>delete</button>
                    </div>
                })
            }
            <button className='p-3 text-white bg-slate-700 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 mt-4'>Create Listing</button>
        </div>
      </form>
    </main>
  )
}
