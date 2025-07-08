import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authSlice';
import postReducer from './postSlice'
import chatReducer from './chatSlice'
import socketReducer from './socketSlice'

const rootReducer = combineReducers({
    auth: authReducer,
    posts: postReducer,
    chat: chatReducer,
    socketio: socketReducer
});

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth', 'posts', 'chat'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    'persist/PERSIST',
                    'persist/REHYDRATE',
                    'persist/PAUSE',
                    'persist/FLUSH',
                    'persist/PURGE',
                    'persist/REGISTER',
                ],
                ignoredPaths: ['socketio.socket'],
            },
        }),
});

export const persistor = persistStore(store);
