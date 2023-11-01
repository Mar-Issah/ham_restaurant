import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    products: [],
    quantity: 0,
    total: 0,
  },
  reducers: {
    addProduct: (state, action) => {
      state.products.push(action.payload);
      state.quantity += 1;
      state.total += action.payload.price * action.payload.quantity;
    },

    removeProduct: (state, action) => {
      const idToRemove = action.payload.id;
      const removedProduct = state.products.find((product) => product.id === idToRemove);

      if (removedProduct) {
        // Calculate the quantity and total to be deducted
        const removedQuantity = removedProduct.quantity;
        const removedTotal = removedProduct.price * removedQuantity;

        // Update state based on the removed product
        state.products = state.products.filter((product) => product.id !== idToRemove);
        state.quantity -= removedQuantity;
        state.total -= removedTotal;
      }
    },
    reset: (state) => {
      state.products = [];
      state.quantity = 0;
      state.total = 0;
    },
  },
});

export const { addProduct, removeProduct } = cartSlice.actions;
export default cartSlice.reducer;
