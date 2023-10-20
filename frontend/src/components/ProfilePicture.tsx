import React from "react";

export const ProfilePicture = ({ src, alt, size }: {src: any , alt: any, size: any}) => {
  const imageSize: Number = size? Number(size) : 1/12 // default size is 48px


  return (
    <img
      src={src}
      alt={alt}
      className={`m-2 rounded-full  w-${1/size} max-h-12`}
    />
  );
};

export default ProfilePicture;
