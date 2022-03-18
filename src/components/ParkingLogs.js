import { useSelector } from "react-redux";
import moment from "moment";
import RenderSize from "./RenderSize";

export default function ParkingLogs(){

    const { logs } = useSelector(state => state.slot);

    return (
        <div className="border rounded-md bg-white">
            <div className="p-4 border-b">
                <h1 className="text-2xl font-medium">Parking Logs</h1>
            </div>
            <div className="p-4">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="p-2 text-left">Time Parked</th>
                            <th className="p-2 text-left">Entrance</th>
                            <th className="p-2 text-left">Slot No.</th>
                            <th className="p-2 text-left">Slot Size</th>
                            <th className="p-2 text-left">Details</th>
                            <th className="p-2 text-left">Time Left</th>
                            <th className="p-2 text-left">Exceed Charge</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log, index)=>(
                            <tr key={index}>
                                <td className="p-2 text-left">{moment(log.timeParked).format('LLL')}</td>
                                <td className="p-2 text-left">{log.entrance}</td>
                                <td className="p-2 text-left">{log.slotNum}</td>
                                <td className="p-2 text-left">{<RenderSize sizeNumber={log.size}/>}</td>
                                <td className="p-2 text-left text-sm">
                                    {log.details.name && <p>Name: {log.details.name}</p>}
                                    {log.details.plateNo && <p>Plate No: {log.details.plateNo}</p>}
                                    {log.details.color && <p>Color: {log.details.color}</p>}
                                </td>
                                <td className="p-2 text-left">{moment(log.timeLeft).format('LLL')}</td>
                                <td className="p-2 text-left">{log.details.exceedCharge}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}