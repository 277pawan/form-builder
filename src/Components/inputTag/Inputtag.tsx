import React from 'react';

interface Person {
    name: string;
    placeholder?: string;
    label?: string;
    type?: string;
    required?: boolean;
}
interface FormErrors {
    [key: string]: string | undefined;
}
interface Props {
    textfield: Person;
    value: any;
    onChange: (name: string, value: any) => void;
    className?: string[];
    formErrors?: FormErrors;
}

function Inputtag(props: Props) {
    const { textfield, value, onChange, className, formErrors } = props;
    const { name, label, required, placeholder, type } = textfield;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let inputValue: any = event.target.value;

        // Handle specific input types
        switch (textfield.type) {
            case "number":
                inputValue = event.target.value === "" ? "" : Number(event.target.value);
                break;
            case "date":

                inputValue = event.target.value ? new Date(event.target.value) : "";
                break;
            case "time":
                inputValue = event.target.value;
                break;
            case "checkbox":
                inputValue = event.target.checked;
                break;
            default:
                inputValue = event.target.value;
                break;
        }

        onChange(textfield.name, inputValue);
    };

    return (
        <>
            {label && (
                <label className="text-black text-md font-semibold" htmlFor={name}>
                    {label}
                </label>
            )}

            <input
                className={`autofill-input p-2 w-full border-2 border-gray-500 my-1 rounded bg-gray-200 text-black ${className ? className.join(' ') : ''
                    }`}
                type={type ? type : 'text'}
                id={name}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                required={required ?? true}
                aria-required={required ?? true}
                style={{
                    backgroundColor: '#d7d7d7',
                    // color: 'black',
                    WebkitTextFillColor: 'black',
                    transition: 'background-color 0s, color 0s',
                    caretColor: "black"
                }}
            />
            {formErrors && formErrors[textfield.name] && (
                <span className="text-sm font-medium text-red-400">{formErrors[textfield.name]}</span>
            )}
        </>
    );
}

export default Inputtag;
