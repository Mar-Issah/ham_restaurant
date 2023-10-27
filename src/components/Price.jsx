'use client';
import React, { useEffect, useState } from 'react';

const Price = ({ price, id, options }) => {
  const [total, setTotal] = useState(price);
  const [quantity, setQuantity] = useState(1);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    setTotal(quantity * price);
  }, [quantity, selected, price]);

  return (
    <div className='flex flex-col gap-4'>
      <h2 className='text-2xl font-bold'>${total.toFixed(2)}</h2>
      {/* QUANTITY AND ADD BUTTON CONTAINER */}
      <div className='flex justify-between items-center'>
        {/* QUANTITY */}
        <div className='flex justify-between w-full p-3 ring-1 ring-custom-orange'>
          <span>Quantity</span>
          <div className='flex gap-4 items-center'>
            <button onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}>{'<'}</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity((prev) => (prev < 9 ? prev + 1 : 9))}>{'>'}</button>
          </div>
        </div>
        {/* CART BUTTON */}
        <button className='uppercase w-56 bg-custom-orange text-gray-200  p-3 ring-1 ring-custom-orange'>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default Price;