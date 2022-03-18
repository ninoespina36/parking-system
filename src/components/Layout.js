import { useEffect } from "react";
import { DATE_TODAY } from "../utils";
import { useDispatch } from "react-redux";
import { setLogs, setSlots } from "../store/reducers/slotReducer";
import moment from "moment";
import file from '../slots.json';

export default function Layout({ children }){

    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(setSlots(file.slots));
        dispatch(setLogs([]));
    }, [ ])

    return (
        <main className="bg-gray-100 min-h-screen">
            <div className="border-b bg-white">
                <div className="container mx-auto p-5 justify-between flex items-center">
                    <h1 className="font-medium text-gray-500">Parking Allocation System</h1>
                    <div className="flex items-center gap-x-3">
                        <h5>{moment(DATE_TODAY).format('LLL')}</h5>
                    </div>
                </div>
            </div>
            {children}
        </main>
    )
}