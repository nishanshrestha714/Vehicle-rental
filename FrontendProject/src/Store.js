import {configureStore} from '@reduxjs/toolkit';
import apiSlice from './Slices/Apislices';
import  CartSlice  from './Slices/cartslice';
import  AuthSlice  from './Slices/Authslices';

const store = configureStore({
    reducer:{
       [ apiSlice.reducerPath]:apiSlice.reducer,
       cart: CartSlice,
       auth:AuthSlice

    },
    middleware:(getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
});






export {store};

// sotre is create for ,import main.jsx in provider 


