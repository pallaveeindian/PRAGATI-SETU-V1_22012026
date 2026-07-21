import React, { useEffect, useState } from "react";

const CountUp = ({ end, duration = 1500 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;

        if (end === 0) {
            setCount(0);
            return;
        }

        const increment = Math.ceil(end / (duration / 20));

        const timer = setInterval(() => {
            start += increment;

            if (start >= end) {
                start = end;
                clearInterval(timer);
            }

            setCount(start);
        }, 20);

        return () => clearInterval(timer);
    }, [end, duration]);

    return <>{count}</>;
};

export default CountUp;