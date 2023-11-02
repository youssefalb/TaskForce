import React from 'react';

const CustomButton = ({ buttonText, onClick = () => { }, color = 'blue', disabled = false, width = "auto" }) => {
  const colorVariants = {
    blue: 'bg-blue-500 hover:bg-blue-600',
    red: 'bg-red-500 hover:bg-red-600',
    green: 'bg-green-500 hover:bgd-green:600',
    gray: 'bg-gray-900'
  }

  const buttonClassName = disabled
    ? `${colorVariants['gray']} `
    : `${colorVariants[color]} `;

  const widthVariants = {
    auto: 'w-auto',
    full: 'w-full',
    half: "w-1/2",
    third: "w-1/3",
    fourth: "w-1/4",
    fifth: "w-1/5",
    twelve: "w-1/12",
    twoThirds: "w-2/3",
    twoFifths: "w-2/5",
    threeFourths: "w-3/4",
    threeFifths: "w-3/5",
  }
  

  
  return (
    <button
      className={` ${buttonClassName} text-white py-2 px-4 rounded-3xl my-2 mx-auto font-sans ${widthVariants[width]} whitespace-no-wrap overflow-hidden`}
      onClick={onClick}
      disabled={disabled}
    >
      {buttonText}
    </button>
  );
};

export default CustomButton;