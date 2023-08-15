import { Button } from '@/components/ui/button';
import { signInWithGoogle } from '@/firebase';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { GoogleCredentials } from '@/providers/authProvider';

export const Login = () => {
  const { setUser, user } = useAuth();
  const navigate = useNavigate();
  const handleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      console.log(user.user);
      const credentials: GoogleCredentials = {
        displayName: user.user.displayName as string,
        email: user.user.email as string,
        photoURL: user.user.photoURL as string,
        uid: user.user.uid as string,
        emailVerified: user.user.emailVerified as boolean,
      };
      setUser(credentials);
      localStorage.setItem('user', JSON.stringify(credentials));
      navigate('/');
    } catch (error) {
      console.log(error);
      alert('uh oh! Not able to login');
    }
  };
  return (
    <div className='h-[80vh] flex justify-center items-center flex-col'>
      <form
        className='p-10 border rounded-xl flex flex-col gap-4 max-w-xl mx-auto bg-card w-full'
        onSubmit={(e) => e.preventDefault()}
      >
        <h1 className='text-2xl font-bold text-center'>Login With Google</h1>
        <Button onClick={handleSignIn} className='bg-green-500'>
          Login
        </Button>
      </form>
      {user?.displayName}
    </div>
  );
};
