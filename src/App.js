import { useEffect, useState } from 'react';
import _ from 'underscore';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import RenderSlot from './components/RenderSlot';
import Layout from './components/Layout';
import { setSlots, unPark, pushToLogs } from './store/reducers/slotReducer';
import { DATE_TODAY } from './utils';
import ParkingLogs from './components/ParkingLogs';

function App() {

  const customerInitialState = {
    entrance: '',
    name: '',
    plateNo: '',
    size: '',
    color: '',
    charge: 40,
    exceedCharge: 0
  }

  const [ entrances, setEntrances ] = useState([]);
  const [ customerState, setCustomerState ] = useState(customerInitialState);
  const { slots, logs } = useSelector(state => state.slot);
  const dispatch = useDispatch();

  useEffect(()=>{

    //Group slots according to entrance (make an object)
    let groupObject = _.groupBy(slots, 'entrance');

    // //Append keys into array
    setEntrances(Object.keys(groupObject));
  }, []);

  const checkLogs = () =>{
    const findLogs = logs.filter(log => { 
      const exceedMinutes = moment(log.timeParked).diff(moment(DATE_TODAY), 'minutes');
      if(Math.abs(exceedMinutes) <= 60) return log.details.plateNo === customerState.plateNo;
      else return null;
     });
    return findLogs[0];
  }

  const handlePark = e =>{
    e.preventDefault();

    let cancelPark = false;
    let prioritySlots = [];
    let otherSlots = [];

    //Prioritize slots with regards to entrance
    slots.forEach(slot => {
      if(slot.entrance === customerState.entrance) 
        prioritySlots.push(slot);
      else 
        otherSlots.push(slot);
    });

    //Set priority slots with regards to vehicle size
    let availableSlots = [...prioritySlots,...otherSlots].filter(slot =>{
      return slot.size === parseInt(customerState.size) && !slot.occupied;
    });

    //If no more slots on particular size
    if(_.isEmpty(availableSlots)){

      const checkMediumSlots = () =>{
        let mediumSlots = [...prioritySlots,...otherSlots].filter(slot =>{
          return slot.size === 1 && !slot.occupied;
        });
        if(!_.isEmpty(mediumSlots)){
          //If small spots are full, get the medium spots
          if(window.confirm('Small slots are full, do you want to park in medium slots?')){
            availableSlots = mediumSlots;
          }else cancelPark = true;
        }else checkLargeSlots();
      }

      const checkLargeSlots = () =>{
        //If medium spots are full, get the large spots
        if(window.confirm('Medium slots are full, do you want to park in large slots?')){
          availableSlots =  [...prioritySlots,...otherSlots].filter(slot =>{
            return slot.size === 2 && !slot.occupied;
          });;
        }else cancelPark = true;
      }

      switch(parseInt(customerState.size)){
        case 0:
          checkMediumSlots();
          break;
        case 1:
          checkLargeSlots();
          break;

        default: alert('Large slots are full');
      }
    }

    if(_.isEmpty(availableSlots)){

      if(cancelPark) alert('Ba bye');
      else alert('Parking slot is full');

    }else{

      const searchIndex = _.findIndex(slots, availableSlots[0]);
      const logFound = checkLogs();
      let appendSlotToArray = [];

      if(logFound){
         appendSlotToArray = slots.map((slot, slotIndex) => {
          if(slotIndex === searchIndex){
            return {
              ...logFound,
              details: logFound.details,
              occupied: true,
              timeParked: logFound.timeParked,
              timeLeft: logFound.timeLeft,
            }
          }else return slot;
        })
      }else{
         appendSlotToArray = slots.map((slot, slotIndex) => {
          if(slotIndex === searchIndex){
            return {
              ...availableSlots[0],
              details: customerState,
              occupied: true,
              timeParked: DATE_TODAY,
              timeLeft: null
            }
          }else return slot;
        })
      }

      dispatch(setSlots(appendSlotToArray));
      setCustomerState(customerInitialState);
      
    }
  } 

  const handleChange = e =>{
    const { value, name } = e.target;
    setCustomerState({
      ...customerState,
      [name]: value
    })
  }

  const unpark = (slot, exceedCharge) =>{
    dispatch(pushToLogs({ slot, exceedCharge }))
    const slotIndex = _.findIndex(slots, slot);
    dispatch(unPark({ slot, slotIndex }))
  }

  return (
    <Layout>
      <div className="container mx-auto p-5">
        <div className="grid grid-cols-12 gap-4">
          {entrances.map((entrance, entranceIndex) => (
              <div key={entranceIndex} className="col-span-4">
                <h1 className="text-2xl mb-5">Entrance {entrance}</h1>
                {slots
                  .filter(slot => slot.entrance === entrance)
                  .map((slot, slotIndex)=>(
                    <RenderSlot 
                      key={slotIndex}
                      unpark={unpark} 
                      slot={{...slot}} 
                    />
                  ))}
              </div>
          ))} 
        </div>


        <div className="grid grid-cols-12 pt-10 gap-4">
          <div className="col-span-4">

            <div className="border rounded-md bg-white">
              <div className="p-4 border-b">
                <h1 className="text-2xl font-medium">New Park</h1>
              </div>
              <div className="p-4">
                <form onSubmit={handlePark}>
                  <select 
                    className="border p-2 rounded-md block w-full mb-2"
                    onChange={handleChange}
                    name="entrance"
                    value={customerState.entrance}
                    required
                  >
                    <option value="" disabled>Entrance</option>
                    {entrances.map((entrance, index) => (
                      <option 
                        key={index}
                        value={entrance}>{entrance}</option>
                    ))}
                  </select>
                  <input 
                    type="text" 
                    name="name"
                    className="border p-2 rounded-md block w-full mb-2"
                    value={customerState.name}
                    placeholder="Enter Name"
                    onChange={handleChange}
                  /> 
                  <input 
                    type="text" 
                    name="plateNo"
                    className="border p-2 rounded-md block w-full mb-2"
                    value={customerState.plateNo}
                    placeholder="Plate No."
                    onChange={handleChange}
                    required
                  />
                  
                  <select 
                    className="border p-2 rounded-md block w-full mb-2"
                    onChange={handleChange}
                    name="size"
                    value={customerState.size}
                    required
                  >
                    <option value="" disabled>Size</option>
                    <option value={0}>Small</option>
                    <option value={1}>Medium</option>
                    <option value={2}>Large</option>
                  </select>

                  <input 
                    type="text" 
                    name="color"
                    className="border p-2 rounded-md block w-full mb-2"
                    value={customerState.color}
                    placeholder="Color"
                    onChange={handleChange}
                  />

                  <button 
                    type="submit"
                    className="bg-green-300 p-2 rounded-md block w-full hover:bg-green-400"
                  >Submit Details</button>
                </form>
              </div>
            </div>

          </div>
          <div className="col-span-8">
            <ParkingLogs />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default App;
