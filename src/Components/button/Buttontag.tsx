import React from "react";

interface Props {
    value: any;
    setformdata: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
    initialFormData: { [key: string]: any };
}

function Buttontag(props: Props) {
    const { value, setformdata, initialFormData } = props;

    const handleResetFn = (e: React.MouseEvent) => {
        e.preventDefault();
        setformdata(initialFormData);
        value.function(initialFormData, e);
    };

    return (
        <>
            {
                value.type === "reset"
                    ?
                    <button className="text-md font-medium text-[#3089cd] bg-gray-200 tracking-wide" type={value.type} onClick={handleResetFn}>
                        {value.name}
                    </button>
                    :
                    <button className="text-md tracking-wide bg-[#0878ce] hover:bg-[#2a6898] " type={value.type}>
                        {value.name}
                    </button>

            }
        </>
    );
}

export default Buttontag;
