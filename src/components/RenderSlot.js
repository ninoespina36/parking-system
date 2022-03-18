import { useState, useEffect } from "react";
import moment from "moment";
import { DATE_TODAY, DAILY_CHARGE, SIZES } from '../utils';
import RenderSize from "./RenderSize";

export default function RenderSlot({ slot, unpark }){

    const [ timer, setTimer ] = useState('');

    const handleUnPark  = e =>{
        e.preventDefault();
        const exceedMinutes = moment(slot.timeParked).add(3, 'hours').diff(moment(DATE_TODAY), 'minutes');
        const exceedDays = moment(slot.timeParked).add(3, 'hours').diff(moment(DATE_TODAY), 'days');
        let charge = 0;
        //If exceeded, compute the charge
        if(exceedMinutes < 0){
            const multiplyChargeByDay = Math.abs(exceedDays);
            const multiplyChargeByHours = Math.abs(Math.round(Math.floor((exceedMinutes / 60) * 100) / 100)) % 24;
            const chargePerHour = SIZES.find(size => size.number === parseInt(slot.size));
            charge = (multiplyChargeByDay * DAILY_CHARGE) + (chargePerHour.charge * multiplyChargeByHours );
        }
        unpark(slot, charge);
    }

    useEffect(()=>{
        let timer = null;
        if(slot.occupied){

            const startTime = moment(DATE_TODAY);
            const timeParked = moment(slot.timeParked).add(3, 'hours');
            const diffTime = timeParked.diff(startTime, 'seconds');
            let duration = moment.duration(diffTime, 'seconds');
            const interval = 1000;

            //Start timer when occupied
            timer = setInterval(() => {
                duration = moment.duration(duration - interval, 'milliseconds');
                setTimer(`${duration.days()}:${duration.hours()}:${duration.minutes()}:${duration.seconds()}`);
            }, interval);
        }
        return ()=> clearInterval(timer);
    }, [ slot.occupied, slot.timeParked ]);


    return (
        <div className="p-3 border mb-4 rounded-md shadow-lg bg-gray-50 hover:bg-slate-100 flex items-start justify-between relative">
            <div>
                <h5>Slot No: {slot.slotNum}</h5>
                <div className="text-xs text-gray-500 mt-1">
                    <div className="flex gap-x-2 items-center">
                        {slot.occupied ? 
                            <p className="mb-1 text-green-800 p-1 bg-green-200 rounded font-medium">Occupied</p> : 
                            <p className="my-1 p-1 bg-gray-200 rounded font-medium">Available</p>
                        }
                        <p className="mb-1 text-green-800 p-1 bg-blue-100 rounded font-medium"><RenderSize sizeNumber={slot.size} /></p>
                    </div>
                    {slot.occupied && (
                        <div className="border-t mt-2 pt-2">
                            <h5 className="text-base mb-1">Details:</h5>
                            <p className="mb-1">Date Parked: {moment(slot.timeParked).format('LLL')}</p>
                            <p className="mb-1">Charge: {slot.details.charge}</p>
                            {slot.details.name && <p className="mb-1">Name: {slot.details.name}</p>}
                            {slot.details.plateNo && <p className="mb-1">Plate No: {slot.details.plateNo}</p>}
                            {slot.details.color && <p className="mb-1">Color: {slot.details.color}</p>}
                        </div>
                    )}
                </div>
            </div>
            {slot.occupied && (
                <>
                <button 
                    className="py-2 px-3 text-sm bg-red-200 rounded-md" 
                    onClick={handleUnPark}
                >Unpark</button>
                <h5 className="absolute bottom-3 right-3">{timer}</h5>
                </>
            )}
        </div>
    )
}