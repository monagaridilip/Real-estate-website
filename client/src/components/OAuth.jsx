import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
import { app } from '../firebase';
import { useDispatch, useSelector } from 'react-redux';
import {  signInSuccess } from '../redux store/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleGoogleAuth = async() =>{
        try {
          const provider = new GoogleAuthProvider();
          const auth = getAuth(app);
          const result = await signInWithPopup(auth,provider)
          console.log(result)
          const res = await fetch('api/auth/google',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({name:result.user.displayName,email:result.user.email,photoURL:result.user.photoURL})
          });
          const data = await res.json();
          console.log(data)
          dispatch(signInSuccess(data))
          navigate("/")
        } catch (error) {
            console.log("could sign in with google",error)
            // dispatch(signInFailure(error.message))
        }
    }
  return (
    <button onClick={handleGoogleAuth} type='button' className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-90'>
      Continue with Google
    </button>
  )
}
