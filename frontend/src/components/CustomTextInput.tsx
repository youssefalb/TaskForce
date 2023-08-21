interface TextInputProps {
    type: "email" | "password" | "text";
    name: string;
    placeholder: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  }

  
function CustomTextInput({ type, name, placeholder, onChange}: TextInputProps) {
    return (
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        className="p-2 m-2 rounded-2xl bg-gray-100"
        onChange={onChange}
        />
    );
  }

  export default CustomTextInput;