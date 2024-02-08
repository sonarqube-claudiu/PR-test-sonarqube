import { offline } from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';
import levelLogger from '../middlewares/levelLogger';
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import { encryptTransform } from 'redux-persist-transform-encrypt';
import rootReducer from '../features/rootReducer';
import createIdbStorage from '@piotr-cz/redux-persist-idb-storage';
import { createNetworkStatusMiddleware } from '../middlewares/networkStatusMiddleware';
// import storage from "redux-persist/lib/storage";

const idbStorage = createIdbStorage({ name: 'redux-gridview' });
const networkStatusMiddleware = createNetworkStatusMiddleware();

const persistConfig = {
  key: 'root',
  storage: idbStorage,
  blacklist: [], // ['auth']
  transforms: [encryptTransform({ secretKey: 'redux-gridview-secret-key' })]
};

const offlineStorageConfig = {
  ...offlineConfig,
  persistOptions: {
    storage: idbStorage,
    blacklist: [] // ['auth']
  },
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false })
      .concat(levelLogger)
      .concat(networkStatusMiddleware),
  enhancers: [offline(offlineStorageConfig)]
});

// window.store = store;

export const persistor = persistStore(store);
export default store;
