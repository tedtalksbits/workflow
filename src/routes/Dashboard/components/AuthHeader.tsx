import { Logo } from '@/components/logo/Logo';
import { AuthMenu } from '@/routes/Auth/components/AuthMenu';
import { NavLink } from 'react-router-dom';

export const AuthHeader = () => {
  return (
    <header className='full-bleed border-b  h-[5rem]'>
      <nav className='bg-card p-4 flex items-center justify-between'>
        <NavLink to='/' className='logo flex items-center gap-2'>
          <Logo className='w-24 fill-primary' />
          <h1 className='font-bold text-xl'></h1>
        </NavLink>
        <div className='ml-auto flex items-center gap-4'>
          {/* <div className='links flex items-center gap-4'>
              <Link to='/'>Dashboard</Link>
              <Link to='/progress'>Progress</Link>
              <Link to='/decks'>Decks</Link>
              <Link to='/decks/public'>Public</Link>
            </div> */}
          <AuthMenu />
        </div>
      </nav>
    </header>
  );
};
