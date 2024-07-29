interface Person {
    name: string;
    placeholder: string;
    label: string;
    type: string;
    required?: boolean;
}

interface Props {
    textfield: Person;
    value: any;
    onChange: (name: string, value: any) => void;
}

function Inputtag(props: Props) {
    const { textfield, value, onChange } = props;
    const { name, label, required, placeholder, type } = textfield;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(name, event.target.value);
    };
    console.log(textfield)

    return (
        <>
            <label className="text-md font-semibold w-auto " htmlFor={name}>{label}</label>
            <input
                className="p-2 w-full border-2 border-gray-500 my-1 rounded bg-gray-200 text-black"
                type={type ? type : "text"}
                id={name}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                required={required ?? true}
            />
        </>
    );
}

export default Inputtag;
