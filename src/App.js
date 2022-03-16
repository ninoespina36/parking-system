import { useEffect, useState } from 'react';
import _ from 'underscore';

import RenderSize from './components/RenderSize';
import file from './slots.json';

function App() {

  const [ entranceSlots, setEntraceSlots ] = useState([]);

  useEffect(()=>{

    //Push boolean occupied to slot array
    let seedSlots = file.slots.map(slot=>{
      return {
        ...slot,
        occupied: false
      }
    });

    //Group slots according to entrance (make an object)
    let groupObject = _.groupBy(seedSlots, slot=> {
      return slot.entrace;
    });

    //Append objects into array
    setEntraceSlots(Object.keys(groupObject).map(object=>{
      return groupObject[object];
    }));
  }, []);


  const park = slotDetails =>{
    // entranceSlots.forEach((entranceSlot, entranceIndex) => {
    //   const findSlot = _.find(entranceSlot, slotDetails);
    //   if(findSlot){
    //     console.log(entranceIndex)
    //     setEntraceSlots([
    //       ...entranceSlots,
    //       [entranceIndex] : [
            
    //       ]
    //     ])
    //   }
    // });
  }

  const unpark = (entrance, number) =>{
    console.log(`${entrance}${number}`)
  }

  return (
    <div className="container mx-auto py-10">
      <div className="grid grid-cols-12 gap-4">
        {entranceSlots.map((entranceSlot, entraceIndex) => (

          <div key={entraceIndex} className="col-span-4">

            <h1 className="text-2xl mb-5">Entrace {entranceSlot[0].entrace}</h1>

            {entranceSlot.map((slot, slotIndex)=>(
              <div 
                key={slotIndex} 
                className="p-3 border mb-4 rounded-md shadow-lg hover:bg-slate-100 flex items-center justify-between"
              >
                <div>
                  <h5>Slot No: {slot.slotNum}</h5>
                  <div className="text-xs text-gray-500">
                    {slot.occupied ? (
                      <p className="my-1 text-green-500">Occupied</p>
                    ) : ( <p className="my-1">Not Occupied</p> )}
                    <p>Size: <RenderSize sizeNumber={slot.size} /></p>
                  </div>
                </div>
                {slot.occupied ? 
                  <button 
                    className="py-2 px-3 text-sm bg-red-200 rounded-md" 
                    onClick={()=>unpark(slot)}
                  >Unpark</button> : (
                    <button 
                      className="py-2 px-3 text-sm bg-green-200 rounded-md" 
                      onClick={()=>park(slot)}
                    >Park</button>
                  )
                }
              </div>
            ))}
          </div>
          
        ))}
      </div>
    </div>
  );
}

export default App;
