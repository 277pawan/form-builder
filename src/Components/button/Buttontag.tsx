import React from "react";

interface Props {
    value: any;
    setformdata: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
    initialFormData: { [key: string]: any };
    className: string[] | undefined;
    action: (e: React.MouseEvent) => void;
}

function Buttontag(props: Props) {
    const { action, value, setformdata, initialFormData, className } = props;
    console.log(action)

    const handleResetFn = (e: React.MouseEvent) => {
        e.preventDefault();
        setformdata(initialFormData);
        value.function(initialFormData, e);
    };


    return (
        <>
            {
                value.type === "reset" &&
                <button className={className ? className.join("") : "text-md font-medium text-[#3089cd] bg-gray-200 tracking-wide"} type={value.type} onClick={handleResetFn}>
                    {value.name}
                </button>
            }
            {
                value.type === 'submit' &&
                <button className={className ? className.join("") : "text-md tracking-wide bg-[#0878ce] hover:bg-[#2a6898] "} type={value.type}>
                    {value.name}
                </button>
            }
            {
                value.type === 'ok' &&
                <button className={className ? className.join("") : "mt-2 text-md tracking-wide bg-[#0878ce] hover:bg-[#2a6898] m-auto"} onClick={(e) => action(e)}>Yes</button>
            }
            {
                value.type === 'cancel' &&
                <button className={className ? className.join("") : "mt-2 text-md font-medium text-[#3089cd] bg-gray-200 tracking-wide"} onClick={(e) => action(e)}>Cancel</button>
            }
        </>
    );
}

export default Buttontag;
