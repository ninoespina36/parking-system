import { createSlice } from '@reduxjs/toolkit';
import { DATE_TODAY } from '../../utils';

const slotSlice = createSlice({
  name: 'slot',
  initialState: {
    slots: [],
    logs: []
  },
  reducers: {
    setSlots: (state, { payload }) => {
      state.slots = payload;
    },
    setLogs: (state, { payload }) => {
      state.logs = payload;
    },
    unPark: (state, { payload }) => {
      const { slot, slotIndex } = payload;
      state.slots[slotIndex] = {
        entrance: slot.entrance,
        slotNum: slot.slotNum,
        size: slot.size,
        occupied: false,
        details: {}
      }
    },
    pushToLogs: (state, { payload }) =>{
      const { slot, exceedCharge } = payload;
      state.logs.unshift({
        ...slot,
        timeLeft: DATE_TODAY,
        details: {
          ...slot.details,
          exceedCharge
        }
      })
    }
  }
})

export const { 
    setSlots,
    setLogs,
    unPark,
    pushToLogs
} = slotSlice.actions;

export default slotSlice.reducer;