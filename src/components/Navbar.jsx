'use client';
import React from 'react';
import { signOut, useSession } from 'next-auth/react';
import Menu from './Menu';
import Link from 'next/link';
import Cart from './Cart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import styles from '@/styles/fonts.module.css';
import { usePathname } from 'next/navigation';
import { APP_URL } from '@/lib/url';
import { useQuery } from 'react-query';
import { useRouter } from 'next/navigation';

async function fetchData(email) {
  const response = await fetch(`${APP_URL}/api/auth/user/${email}`);
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  return response.json();
}

//Navbar components with links
const Navbar = () => {
  const currentRoute = usePathname();
  const { status, data } = useSession();
  const email = data?.user?.email;
  const { data: loggedUser, error } = useQuery(['product', email], () => fetchData(email));
  if (status && loggedUser) {
    localStorage.setItem('hamfoodsUserId', loggedUser._id);
  }
  const token = localStorage.getItem('hamfoodsToken');
  const router = useRouter();

  return (
    <div className='h-10 text-gray-100 p-4 flex items-center justify-between uppercase md:h-20 lg:px-17 xl:px-35'>
      {/* LOGO */}
      <div className='text-xl md:font-bold flex-1 tracking-widest md:pl-6 lg:pl-6 xl:pl-10'>
        <Link href='/'>
          h.a.m <span className={styles.fontPacifico}>foods</span>
        </Link>
      </div>

      {/* MOBILE MENU */}
      <div className='md:hidden'>
        <Menu status={status} />
      </div>
      {/* RIGHT LINKS */}
      <div className='hidden md:flex gap-4 items-center justify-end flex-1'>
        <div className='flex items-center gap-2 cursor-pointer bg-custom-orange px-1 rounded-md w-44'>
          <FontAwesomeIcon icon={faPhone} style={{ color: '#bfc7d4', height: '1rem' }} />
          <span>
            <a href='tel:+2335678900'>(+233) 567-8900</a>
          </span>
        </div>
        <Link
          className={`${currentRoute === '/' && 'border-b-2 border-custom-orange'} hover:text-custom-orange `}
          href='/'
        >
          Home
        </Link>
        <Link
          href='/menu'
          className={`${currentRoute === '/menu' && 'border-b-2 border-custom-orange'} hover:text-custom-orange`}
        >
          Menu
        </Link>
        {status === 'authenticated' || token ? (
          <>
            <Link
              href='/orders'
              className={`${currentRoute === '/orders' && 'border-b-2 border-custom-orange'} hover:text-custom-orange`}
            >
              Orders
            </Link>
            <Cart currentRoute={currentRoute} />
            <Link
              className={`hover:text-custom-orange mr-8`}
              href='/login'
              onClick={() => {
                localStorage.removeItem('hamfoodsToken');
                localStorage.removeItem('hamfoodsUserId');
                signOut();
                router.push('/login');
              }}
            >
              Logout
            </Link>
          </>
        ) : (
          <>
            <Link
              className={`${currentRoute === '/login' && 'border-b-2 border-custom-orange'} hover:text-custom-orange`}
              href='/login'
            >
              Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
