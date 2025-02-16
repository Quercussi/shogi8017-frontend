import React from "react";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";

type InputFieldProps = {
    id: string;
    label: string;
    type?: string;
    placeholder?: string;
    error?: string;
    register: any;
};

const InputField: React.FC<InputFieldProps> = ({
   id,
   label,
   type = "text",
   placeholder,
   error,
   register,
}) => {
    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            <Input id={id} type={type} placeholder={placeholder} {...register} />
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
};

export default InputField;
