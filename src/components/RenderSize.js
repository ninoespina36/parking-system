import { useEffect, useState } from "react";
import _ from 'underscore';
import { SIZES } from "../utils";

export default function RenderSize({ sizeNumber }){

    const [ size, setSize ] = useState({});

    useEffect(()=>{
        setSize(_.find(SIZES, item=> {
            return item.number === sizeNumber;
        }));
    }, [ sizeNumber ]);

    return <span>{size?.size}</span>;
}