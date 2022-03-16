import { useState, useEffect } from "react";
import _ from 'underscore';

export default function RenderSize({ sizeNumber }){

    const SIZES = [
        { size: 'L', number: 2 },
        { size: 'M', number: 1 },
        { size: 'S', number: 0 },
    ];

    const [ size, setSize ] = useState({});

    useEffect(()=>{
        setSize(_.find(SIZES, item=> {
            return item.number === sizeNumber;
        }));
    }, []);

    return <span>{size?.size}</span>;
}