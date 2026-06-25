
import { createSlice } from "@reduxjs/toolkit";
import { UpdateCart } from "../utils/vehicleUtils";
import { toast } from "react-toastify";


// Get cart data from localStorage
const cartFromStorage = localStorage.getItem("cart");

let initialState = {
  CartItems: [],
  Nagariktapage:{},
  License:{},
  PaymentMethod:"COD"

};

if (cartFromStorage) {
  try {
    const parsedCart = JSON.parse(cartFromStorage);

    initialState = {
      CartItems: parsedCart.CartItems || [],
      Nagariktapage: parsedCart.Nagariktapage || {},
      License:parsedCart.License || {},
      PaymentMethod : parsedCart.PaymentMethod || "COD" ,

    };
  } catch (error) {
    console.error("Error parsing cart from localStorage:", error);

    initialState = {
      CartItems: [],
            Nagariktapage: {},
            License:{},
            PaymentMethod:"COD"

    };
  }
}

const CartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // AddToCart: (state, action) => {
    //   const Item = action.payload;
      

    //   // Safety check
    //   if (!state.CartItems) {
    //     state.CartItems = [];
    //   }

    //   const exists = state.CartItems.find(
    //     (x) => x._id === Item._id
    //   );

    //   if (exists) {
    //     state.CartItems = state.CartItems.map((x) =>
    //       x._id === Item._id ? Item : x
    //     );
    //   } else {
    //     state.CartItems.push(Item);
    //   }

    //   UpdateCart(state);
    // },
    AddToCart: (state, action) => {
  const Item = action.payload;

  if (!state.CartItems) {
    state.CartItems = [];
  }

  //  ONE USER ONE VEHICLE RULE
 if (state.CartItems.length >= 1) {
  toast.error("Only one vehicle can be booked at a time");
  return;
}

  const exists = state.CartItems.find((x) => x._id === Item._id);

  if (exists) {
    state.CartItems = state.CartItems.map((x) =>
      x._id === Item._id ? Item : x
    );
  } else {
    state.CartItems.push({... Item ,  vehicle:Item._id});
  }

  UpdateCart(state);
},

    RemoveFromCart: (state, action) => {
      const id = action.payload;

      state.CartItems = state.CartItems.filter(
        (item) => item._id !== id
      );

      UpdateCart(state);
    },

    ClearCart: (state) => {
      state.CartItems = [];

      UpdateCart(state);
    },
    saveNagarikta:(state , action) =>{
      state.Nagariktapage = action.payload;
      UpdateCart(state);
    },
    SaveLicense : (state , action)=>{
      state.License = action.payload;
      UpdateCart(state);
    },
    SavePaymentMethod : (state , action ) =>{
      state.PaymentMethod = action.payload;
      UpdateCart(state);
    }

  },
});

export const {
  AddToCart,
  RemoveFromCart,
  ClearCart,
  saveNagarikta,
  SaveLicense,
  SavePaymentMethod
} = CartSlice.actions;

export default CartSlice.reducer;