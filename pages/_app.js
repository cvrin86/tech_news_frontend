import Head from "next/head";
import { Toaster } from "react-hot-toast";
import { persistReducer, persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import storage from "redux-persist/lib/storage";
import Header from "../components/Header";
import "../styles/globals.css";

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import bookmarks from "../reducers/bookmarks";
import user from "../reducers/user";

const reducers = combineReducers({ bookmarks, user });
const persistConfig = { key: "technews-2451GDJXJKE", storage };

const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

const persistor = persistStore(store);

function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Head>
          <title>Next.js App</title>
        </Head>
        <Header />
        <Component {...pageProps} />
        <Toaster />
      </PersistGate>
    </Provider>
  );
}

export default App;
