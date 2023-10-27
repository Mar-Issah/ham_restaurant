import { menu } from '@/data';
import Link from 'next/link';
import React from 'react';
import Navbar from '@/components/Navbar';
import Button from '@/components/Button';
import styles from '@/styles/menu.module.css';
import Image from 'next/image';
import Footer from '@/components/Footer';

const MenuPage = () => {
  return (
    <div className='bg-custom-blueblack'>
      <Navbar />
      <div className={`${styles.backgroundImage} w-screen relative z-10 text-gray-200`}>
        <div className={`${styles.fontDancing} w-4/5 flex flex-col justify-end items-end mt-10`}>
          <h1 className='text-center sm:text-1xl md:text-2xl'>We serve</h1>
          <h1 className='relative z-10 text-gray-200 sm:text-1xl md:text-3xl'>TRADITIONAL & MODERN</h1>
        </div>
      </div>
      <div className='lg:px-20 xl:px-40 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 items-center items-center pb-15'>
        {menu.map((category) => (
          <Link
            href={`/product/${category.id}`}
            key={category.id}
            className='w-full h-1/3 bg-cover md:h-1/2'
            style={{ backgroundImage: `url(${category.img})` }}
          >
            <div className='flex flex-col items-center w-auto mx-auto mb-8 text-gray-200 bg-transparent rounded-lg hover:shadow-lg'>
              <div className='rounded-full border-2 border-custom-orange overflow-hidden h-50 w-50'>
                <Image src='/loginBG.jpg' alt='food' width={200} height={200} className='object-contain' />
              </div>
              <div className='mt-6 flex gap-5 mb-2'>
                <h2 className='text-md font-semibold text-gray-200'>FoodName</h2>
                <p className='text-md text-gray-300'>$20</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default MenuPage;
