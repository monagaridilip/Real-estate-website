import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useEffect, useState } from 'react'
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdateListing() {
    const [files,setFiles] = useState([])
    const {currentUser} = useSelector((state) => state.user);
    const [loading,setLoading] = useState(false)
    const [ error,setError] = useState()
    const params = useParams();
    const navigate = useNavigate();
    const [formData,setFormData] = useState({
        imageUrls: [],
        name:'',
        description:'',
        address:'',
        type:'rent',
        bedrooms:1,
        bathrooms:1,
        regularPrice:2000,
        discountPrice:0,
        offer:false,
        parking:false,
        furnished:false
    })
    const [imageUploadError,setImageUploadError] = useState(false)
    const [uploading,setUploading]= useState(false);

    useEffect(()=>{
        const fetchListing = async () =>{
            const listingId = params.listingId
            console.log(listingId)
            const res =await fetch(`/api/listing/get/${listingId}`)
            const data = await res.json();
            if( data.success == false){
                setError(data.message)
            }
            setFormData(data)
        }
        fetchListing();
    },[])
    
    const handleUploadButton = () =>{
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            setUploading(true);
            setImageUploadError(false);
            const promises = [];
      
            for (let i = 0; i < files.length; i++) {
              promises.push(storeImage(files[i]));
            }
            Promise.all(promises)
              .then((urls) => {
                setFormData({
                  ...formData,
                  imageUrls: formData.imageUrls.concat(urls),
                });
                setImageUploadError(false);
                setUploading(false);
              })
              .catch((err) => {
                setImageUploadError('Image upload failed (2 mb max per image)');
                setUploading(false);
              });
          } else {
            setImageUploadError('You can only upload 6 images per listing');
            setUploading(false);
          }
    }
    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
          const storage = getStorage(app);
          const fileName = new Date().getTime() + file.name;
          const storageRef = ref(storage, fileName);
          const uploadTask = uploadBytesResumable(storageRef, file);
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log(`Upload is ${progress}% done`);
            },
            (error) => {
              reject(error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                resolve(downloadURL);
              });
            }
          );
        });
      };
      const handleRemoveImage = (index) => {
        setFormData({
          ...formData,
          imageUrls: formData.imageUrls.filter((_, i) => i !== index),
        });
      };

      const handleChange = (e) => {
        if (e.target.id === 'sale' || e.target.id === 'rent') {
          setFormData({
            ...formData,
            type: e.target.id,
          });
        }
    
        if (
          e.target.id === 'parking' ||
          e.target.id === 'furnished' ||
          e.target.id === 'offer'
        ) {
          setFormData({
            ...formData,
            [e.target.id]: e.target.checked,
          });
        }
    
        if (
          e.target.type === 'number' ||
          e.target.type === 'text' ||
          e.target.type === 'textarea'
        ) {
          setFormData({
            ...formData,
            [e.target.id]: e.target.value,
          });
        }
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          if (formData.imageUrls.length < 1)
            return setError('You must upload at least one image');
          if (+formData.regularPrice < +formData.discountPrice)
            return setError('Discount price must be lower than regular price');
          setLoading(true);
          setError(false);
          const res = await fetch(`/api/listing/update/${params.listingId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...formData,
              userRef: currentUser._id,
            }),
          });
          const data = await res.json();
          setLoading(false);
          if (data.success === false) {
            setError(data.message);
          }
          navigate(`/listing/${data._id}`);
        } catch (error) {
          setError(error.message);
          setLoading(false);
        }
      };
  return (
    <main className='p-3 mx-auto max-w-4xl'>
      <h1 className='text-3xl font-semibold text-center my-7'>Update Listing</h1>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
        <input 
            type="text" 
            className='border p-3 rounded-lg' name="name" id="name" minLength='4' maxLength='62' required   placeholder='Name' 
            onChange={handleChange} 
            value={formData.name} 
            />
        <textarea 
            type="text" 
            onChange={handleChange} 
            className='border p-3 rounded-lg' name="description" id="description"  
            value={formData.description} 
            required 
            placeholder='Description' />
        <input 
            type="text" 
            className='border p-3 rounded-lg' name="address" id="address"  
            onChange={handleChange} 
            value={formData.address} 
            required 
            placeholder='Address' />
        <div className='flex flex-wrap gap-6'>
            <div className='flex gap-2'>
                <input type="checkbox" id='sale' className='w-5'
                    onChange={handleChange}
                    checked={formData.type === 'sale'}
                    
                />
                <span>Sell</span>
            </div>
            <div className='flex gap-2'>
                <input type="checkbox" id='rent' className='w-5'
                    onChange={handleChange}
                    checked={formData.type === 'rent'}
                />
                <span>Rent</span>
            </div>
            <div className='flex gap-2'>
                <input type="checkbox" id='parking' className='w-5'
                    onChange={handleChange}
                    checked={formData.parking}
                />
                <span>Parking Spot</span>
            </div>
            <div className='flex gap-2'>
                <input type="checkbox" id='furnished' className='w-5'
                    onChange={handleChange}
                    checked={formData.furnished}
                />
                <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
                <input type="checkbox" id='offer' className='w-5'
                    onChange={handleChange}
                    checked={formData.offer}
                />
                <span>Offer</span>
            </div>
        </div>
        <div className='flex flex-wrap gap-6'>
            <div className="flex items-center gap-2">
                <input type="number" className='border border-gray-300 rounded-lg p-3 ' name="bedrooms" id="bedrooms" required min="1" max="10"
                onChange={handleChange}
                value={formData.bedrooms}
                />
                <p>BedRooms</p>
            </div>
            <div className="flex items-center gap-2">
                <input type="number" className='border border-gray-300 rounded-lg p-3 ' name="bathrooms" id="bathrooms" required min="1" max="5"
                onChange={handleChange}
                value={formData.bathrooms}
                />
                <p>Bathrooms</p>
            </div>
            <div className="flex items-center gap-2">
                <input type="number" className='border border-gray-300 rounded-lg p-3 ' name="regularPrice" id="regularPrice" required placeholder='Rs.'min="2000" max="100000"
                onChange={handleChange}
                value={formData.regularPrice}
                />
                <div className='flex flex-col items-center '>
                <p>Regular Price</p>
                {formData.type === 'rent' && (
                  <span className='text-xs'>(Rs. / month)</span>
                )}
                </div>
            </div>
            { formData.offer 
                && 
             <div className="flex items-center gap-2">
             <input type="number" className='border border-gray-300 rounded-lg p-3 ' name="discountPrice" id="discountPrice" required placeholder='Rs.' min="0" max="100000"
             onChange={handleChange}
             value={formData.discountPrice}
             />
             <div className='flex flex-col items-center '>
             <p>Discounted Price</p>
             {formData.type === 'rent' && (
                    <span className='text-xs'>(Rs / month)</span>
                  )}
             </div>
         </div>
            }
           
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
            <button disabled={loading || uploading} className='p-3 text-white bg-slate-700 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 mt-4'>{loading?"Updating...":"Update Listing"}</button>
            <p className='text-red-700 text-sm'>{error && error}</p>
        </div>
      </form>
    </main>
  )
}
