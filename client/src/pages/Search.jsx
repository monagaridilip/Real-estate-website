import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function Search() {
    const [sidebardata,setSidebardata] = useState({
        searchTerm:'',
        type:'all',
        parking:false,
        furnished:false,
        offer:false,
        sort:'createdAt',
        order:'desc'
    })
    const [loading,setLoading] = useState(false)
    const [listings,setListings] = useState({})
    const [showMore,setShowMore] = useState(false)
    console.log(listings)
    useEffect(()=>{
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const typeFromUrl = urlParams.get('type');
        const parkingFromUrl = urlParams.get('parking');
        const furnishedFromUrl = urlParams.get('furnished');
        const offerFromUrl = urlParams.get('offer');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order');
        if(
            searchTermFromUrl ||
            typeFromUrl ||
            parkingFromUrl ||
            furnishedFromUrl ||
            offerFromUrl ||
            sortFromUrl ||
            orderFromUrl){
                setSidebardata({
                    searchTerm:searchTermFromUrl || '',
                    type:typeFromUrl || 'all',
                    parking:parkingFromUrl === 'true'?true:false,
                    furnished:furnishedFromUrl === 'true' ? true : false,
                    offer:offerFromUrl === 'true' ? true : false,
                    sort:sortFromUrl || 'createdAt',
                    order:orderFromUrl || 'desc'
                });
            }

            const fetchListings = async () => {
              setLoading(true);
              setShowMore(false);
              const searchQuery = urlParams.toString();
              const res = await fetch(`/api/listing/get?${searchQuery}`);
              const data = await res.json();
              if (data.length > 8) {
                setShowMore(true);
              } else {
                setShowMore(false);
              }
              setListings(data);
              setLoading(false);
            };
            fetchListings()
    },[location.search])
    // console.log(sidebardata)
    const navigate = useNavigate();
    const handleChange = (e) => {
        if (
          e.target.id === 'all' ||
          e.target.id === 'rent' ||
          e.target.id === 'sale'
        ) {
          setSidebardata({ ...sidebardata, type: e.target.id });
        }
    
        if (e.target.id === 'searchTerm') {
          setSidebardata({ ...sidebardata, searchTerm: e.target.value });
        }
    
        if (
          e.target.id === 'parking' ||
          e.target.id === 'furnished' ||
          e.target.id === 'offer'
        ) {
          setSidebardata({
            ...sidebardata,
            [e.target.id]:
              e.target.checked || e.target.checked === 'true' ? true : false,
          });
        }
    
        if (e.target.id === 'sort_order') {
          const sort = e.target.value.split('_')[0] || 'created_at';
    
          const order = e.target.value.split('_')[1] || 'desc';
    
          setSidebardata({ ...sidebardata, sort, order });
        }
      };
      const handleSubmit = (e) =>{
        e.preventDefault();
        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm',sidebardata.searchTerm)
        urlParams.set('type',sidebardata.type)
        urlParams.set('parking',sidebardata.parking)
        urlParams.set('furnished',sidebardata.furnished)
        urlParams.set('offer',sidebardata.offer)
        urlParams.set('sort',sidebardata.sort)
        urlParams.set('order',sidebardata.order);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`)
    }   
  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-7  border-b-2 md:border-r-2 md:min-h-screen'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-7' >
            <div className='flex items-center gap-2 '>
            <label htmlFor="searchTerm"
            className='whitespace-nowrap font-semibold'
            >Search Term :</label>
            <input 
            type="text" 
            name="searchTerm" 
            id="searchTerm" 
            placeholder='Search...'
            className='border rounded-lg p-3 w-full'
            onChange={handleChange}
            value={sidebardata.searchTerm}/>
            </div>
            <div className='flex gap-2 flex-wrap items-center'>
                <label className='font-semibold'>Type:</label>
                <div className='flex gap-2'>
                    <input type="checkbox"
                    id="all"
                    onChange={handleChange}
                    checked={sidebardata.type === 'all'}
                    className='w-5'/>
                    <span>Rent & Sale</span>
                </div>
                <div className='flex gap-2'>
                    <input type="checkbox"
                    id="rent"
                    onChange={handleChange}
                    checked={sidebardata.type === 'rent'}
                    className='w-5'/>
                    <span>Rent</span>
                </div>
                <div className='flex gap-2'>
                    <input type="checkbox"
                    id="sale"
                    onChange={handleChange}
                    checked={sidebardata.type === 'sale'}
                    className='w-5'/>
                    <span>Sale</span>
                </div>
                <div className='flex gap-2'>
                    <input type="checkbox"
                    id="offer"
                    onChange={handleChange}
                    checked={sidebardata.offer}
                    className='w-5'/>
                    <span>Offer</span>
                </div>
            </div>
            <div className='flex gap-2 flex-wrap items-center'>
                <label className='font-semibold'>Amenities:</label>
                <div className='flex gap-2'>
                    <input type="checkbox"
                    id="parking"
                    onChange={handleChange}
                    checked={sidebardata.parking}
                    className='w-5'/>
                    <span>Parking</span>
                </div>
                <div className='flex gap-2'>
                    <input type="checkbox"
                    id="furnished"
                    onChange={handleChange}
                    checked={sidebardata.furnished}
                    className='w-5'/>
                    <span>Furnished</span>
                </div>
            </div>
            <div className='flex gap-2 items-center'>
                <label className='font-semibold'>Sort:</label>
                <select id="sort_order"
                    onChange={handleChange}
                    defaultValue={'createdAt_desc'}
                    className='p-3 rounded-lg border'
                >
                <option value='regularPrice_desc'>Price High to Low</option>
                <option value='regularPrice_asc'>Price Low to High</option>
                <option value='createdAt_asc'>Oldest</option>
                <option value='createdAt_desc'>Latest</option>
                </select>
            </div>
            <button
            className='bg-slate-700 p-3 rounded-lg uppercase text-white hover:opacity-90'
            >Search</button>
        </form>
      </div>
      <div className=''>
        <h1 className=' text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>Listing results:</h1>
      </div>
    </div>
  )
}
