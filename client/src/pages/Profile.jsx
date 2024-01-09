import { useSelector } from "react-redux"

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-3'>
        <img src={currentUser.avatar} alt="profile" className="h-25 w-25 rounded-full object-cover self-center cursor-pointer mt-2"/>
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
