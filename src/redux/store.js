import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { postDetailsReducer } from './postDetailReducer';
import { postsReducer } from './postsReducer';

const postDetailsConfig = {
  key: 'postDetails',
  storage,
  // пишемо для відправлення даних в локальне сховище
  whitelist: ['posts'],
  // пишемо якщо не хочемо пропускати дані в локльне сховище
  blacklist: ['filter'],
};

// configureStore приймає об'єкт опцій
// прикріпляємо ред'юсер до стору
export const store = configureStore({
  reducer: {
    postDetails: persistReducer(postDetailsConfig, postDetailsReducer),
    postsData: postsReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
