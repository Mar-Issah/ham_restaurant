'use client';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OrderForm from '@/components/OrderForm';
import Button from '@/components/Button';
import ButtonWrapper from '@/components/ButtonWrapper';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import { removeProduct, reset } from '@/redux/cartSlice';
import { useRouter } from 'next/navigation';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Confirm from '@/components/Confirm';
import { APP_URL } from '@/lib/url';

const CartPage = () => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModal, setIsConfirmModal] = useState(false);
  const { products, total, quantity } = useSelector((state) => state.cart);
  const [rate, setRate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const token = localStorage.getItem('hamfoodsToken');
  const { status } = useSession();

  if (!token && status === 'unauthenticated') {
    router.push('/menu');
  }
  const currency = 'USD';
  const dispatch = useDispatch();
  const serviceCost = 4.0;
  const deliveryCost = 15.0;

  const convertCurrency = async () => {
    try {
      const res = await axios.get(
        ` https://api.currencyapi.com/v3/latest?apikey=${process.env.NEXT_PUBLIC_CURRENCY_KEY}&currencies=USD&base_currency=GHS`
      );
      const usdValue = res.data.data.USD.value;
      setRate(usdValue);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    convertCurrency();
  }, []);

  const createOrder = async (data) => {
    try {
      const res = await axios.post(`${APP_URL}/api/orders`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.status === 201) {
        setIsModalOpen(false);
        dispatch(reset());
        setIsConfirmModal(true);
        setIsLoading(false);
      }
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      setError('Something went wrong, Please retry');
    }
  };

  const handleRemoveProduct = (productId) => {
    dispatch(removeProduct({ id: productId }));
  };

  return (
    <div className='bg-custom-blueblack w-screen overflow-x-hidden'>
      <Navbar />
      <div className='h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] flex flex-col text-gray-200 lg:flex-row w-screen mt-15 px-2 md:px-5'>
        {/* PRODUCTS CONTAINER */}
        <div className='h-1/2 p-0 md:p-4 flex flex-col justify-center overflow-x-hidden overflow-y-auto lg:h-full lg:w-2/3 2xl:w-1/2 lg:px-15 xl:px-40 mt-10'>
          {/* SINGLE ITEM */}
          {products?.length === 0 ? (
            <h1 className='uppercase bold text-xl'>No Orders Today</h1>
          ) : (
            products?.map((product, idx) => (
              <div className='flex items-center justify-between mb-4' key={idx}>
                <Image src={product.img} alt='food' width={100} height={100} />
                <h1 className='text-sm md:base uppercase font-bold w-56'>
                  {product.title} ({product?.quantity})
                </h1>
                <h2 className='text-sm md:text-base font-bold'>{(product?.quantity * product.price).toFixed(2)}</h2>
                <span className='cursor-pointer text-red ml-2 hover:bg-black' onClick={() => handleRemoveProduct(idx)}>
                  <FontAwesomeIcon icon={faXmark} style={{ color: '#d51515' }} />
                </span>
              </div>
            ))
          )}
        </div>
        <hr className='my-2 border-custom-orange' />
        {/* PAYMENT */}
        <div className='bg-custom-blueblack overflow-x-hidden h-screen pr-2 flex flex-col gap-4 justify-center lg:h-full lg:w-1/3 2xl:w-1/2 lg:px-20 xl:px-40 2xl:text-xl 2xl:gap-6 overflow-y-auto'>
          <div className='flex justify-between'>
            <span className=''>Subtotal({quantity})</span>
            <span className='ml-2'>{'GH₵' + total.toFixed(2)}</span>
          </div>
          <div className='flex justify-between'>
            <span className=''>Service Cost</span>
            <span className='ml-4'>GH₵{products?.length === 0 ? (0.0).toFixed(2) : serviceCost.toFixed(2)}</span>
          </div>
          <div className='flex justify-between'>
            <span className=''>Delivery Cost</span>
            <span className='text-green-500 ml-2'>
              GH₵{products?.length === 0 ? (0.0).toFixed(2) : deliveryCost.toFixed(2)}
            </span>
          </div>
          <hr className='border-custom-orange' />
          <div className='flex justify-between text-custom-orange'>
            <span className=''>TOTAL(INCL. VAT)</span>
            <span className='font-bold ml-4'>
              {' '}
              GH₵{products?.length === 0 ? (0.0).toFixed(2) : (total + serviceCost + deliveryCost).toFixed(2)}
            </span>
          </div>

          {products?.length !== 0 && open ? (
            <PayPalScriptProvider
              options={{
                'client-id': process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
                components: 'buttons',
                currency: currency,
                'disable-funding': 'credit,card,p24',
              }}
            >
              <ButtonWrapper
                currency={currency}
                products={products}
                amount={(rate * total).toFixed(2)}
                totalGHS={total + serviceCost + deliveryCost}
                createOrder={createOrder}
                setIsLoading={setIsLoading}
                isLoading={isLoading}
              />
            </PayPalScriptProvider>
          ) : (
            products?.length !== 0 && (
              <div
                className='mb-2'
                onClick={() => {
                  setIsLoading(true);
                  setOpen(true);
                }}
              >
                <Button label='CHECKOUT' />
              </div>
            )
          )}
          {products?.length !== 0 && (
            <>
              <div
                onClick={() => {
                  setOpen(false);
                  setIsModalOpen(true);
                  setIsLoading(false);
                }}
              >
                <Button label='PAY ON DELIVERY' />
              </div>
            </>
          )}
        </div>
        {isModalOpen && (
          <OrderForm
            error={error}
            total={total + serviceCost + deliveryCost}
            products={products}
            createOrder={createOrder}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        )}
      </div>
      <Confirm isConfirmModal={isConfirmModal} setIsConfirmModal={setIsConfirmModal} />
      <div className='mt-20'>
        <Footer />
      </div>
    </div>
  );
};

export default CartPage;
