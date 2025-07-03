import { useEffect, useState } from "react";

interface UseCounterProps {
  remainingTime: number; // in seconds
}

const secondsToDays = (value: number) => {
  let secNum = value;

  const days = Math.floor(secNum / 86400);
  secNum -= days * 86400;

  const hours = Math.floor(secNum / 3600);
  secNum -= hours * 3600;

  const minutes = Math.floor(secNum / 60) % 60;
  secNum -= minutes * 60;

  const seconds = secNum % 60;

  return {
    days: days.toString().padStart(2, "0"),
    hours: hours.toString().padStart(2, "0"),
    minutes: minutes.toString().padStart(2, "0"),
    seconds: seconds.toString().padStart(2, "0"),
  };
};

const useCounter = ({ remainingTime }: UseCounterProps) => {
  const [counter, setCounter] = useState<number>(remainingTime);

  useEffect(() => {
    if (counter <= 0) {
      setCounter(0);
    }

    if (counter > 0) {
      const timer: ReturnType<typeof setInterval> = setInterval(
        () => setCounter(counter - 1),
        1000
      );

      return () => clearInterval(timer);
    }

    return () => {};
  }, [counter]);

  return secondsToDays(counter);
};

export default useCounter;
