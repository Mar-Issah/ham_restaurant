'use client';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useEffect } from 'react';
import Spinner from './Spinner';

// Custom component to wrap the PayPalButtons and handle currency changes
const ButtonWrapper = ({ currency, isLoading, amount, createOrder, totalGHS, setIsLoading }) => {
  const [{ options, isPending }, dispatch] = usePayPalScriptReducer();
  const style = { layout: 'vertical' };

  useEffect(() => {
    dispatch({
      type: 'resetOptions',
      value: {
        ...options,
        currency: currency,
      },
    });
  }, [currency]);

  return (
    <>
      {isLoading && <Spinner />}
      <PayPalButtons
        style={style}
        disabled={false}
        forceReRender={[amount, currency, style]}
        fundingSource={undefined}
        createOrder={(data, actions) => {
          return actions.order
            .create({
              purchase_units: [
                {
                  amount: {
                    currency_code: currency,
                    value: amount,
                  },
                },
              ],
            })
            .then((orderId) => {
              // code here after create the order
              return orderId;
            });
        }}
        //what happens when the transaction is approved
        onApprove={function (data, actions) {
          return actions.order.capture().then(function (details) {
            const shipping = details.purchase_units[0].shipping;
            createOrder({
              customer: shipping.name.full_name,
              address: shipping.address.address_line_1,
              total: totalGHS,
              method: 1,
              userId: localStorage.getItem('hamfoodsUserId'),
            });
            setIsLoading(false);
          });
        }}
      />
    </>
  );
};

export default ButtonWrapper;
