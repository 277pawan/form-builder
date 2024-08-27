import React from 'react';

interface Person {
    name: string;
    placeholder?: string;
    label?: string;
    type?: string;
    required?: boolean;
}

interface Props {
    textfield: Person;
    value: any;
    onChange: (name: string, value: any) => void;
    className?: string[];
}

function Inputtag(props: Props) {
    const { textfield, value, onChange, className } = props;
    const { name, label, required, placeholder, type } = textfield;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(name, event.target.value);
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
                style={{
                    backgroundColor: '#d7d7d7',
                    // color: 'black',
                    WebkitTextFillColor: 'black',
                    transition: 'background-color 0s, color 0s',
                    caretColor: "black"
                }}
            />
        </>
    );
}

export default Inputtag;
