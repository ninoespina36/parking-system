import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import slotReducer from './slotReducer';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['slot']
}

const reducers  = combineReducers({ 
    slot: slotReducer,
});

export default persistReducer(persistConfig, reducers);