import React from "react";
import "./ButtonTag.css";
interface Props {
  value: any;
  setformdata: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
  initialFormData: { [key: string]: any };
  className: string[] | undefined;
  action: (data: any, e: React.MouseEvent) => void;
  arialabel?: string;
  tooltip?: string;
  loader?: boolean;
}

function Buttontag(props: Props) {
  const {
    action,
    value,
    setformdata,
    initialFormData,
    arialabel,
    tooltip,
    className,
    loader,
  } = props;

  const handleResetFn = (e: React.MouseEvent) => {
    e.preventDefault();
    setformdata(initialFormData);
    value.function(initialFormData, e);
  };

  const ButtonWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="relative group inline-block">
      {/* Loader */}
      {loader ? (
        <div className="flex justify-center items-center w-full h-full">
          <span className="h-4 w-4 border-2 border-white border-t-blue-500 rounded-full animate-spin"></span>
        </div>
      ) : (
        <>{children}</>
      )}

      {/* Tooltip */}
      {!loader && tooltip && (
        <span className="tooltip absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-sm rounded py-1 px-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out z-50">
          {tooltip}
        </span>
      )}
    </div>
  );

  return (
    <>
      {value.type === "reset" && (
        <ButtonWrapper>
          <button
            className={
              className
                ? className.join(" ")
                : "z-50 text-md font-medium text-[#3089cd] bg-gray-200 tracking-wide"
            }
            type={value.type}
            onClick={handleResetFn}
            aria-label={arialabel}
          >
            {value.name}
          </button>
        </ButtonWrapper>
      )}

      {value.type === "submit" && (
        <ButtonWrapper>
          <button
            className={
              className
                ? className.join(" ")
                : "text-md tracking-wide bg-[#0878ce] hover:bg-[#2a6898]"
            }
            type={value.type}
            aria-label={arialabel}
          >
            {value.name}
          </button>
        </ButtonWrapper>
      )}

      {value.type === "ok" && (
        <ButtonWrapper>
          <button
            className={
              className
                ? className.join(" ")
                : "mt-2 text-md tracking-wide bg-[#0878ce] hover:bg-[#2a6898] m-auto"
            }
            onClick={(e) => action(true, e)}
            aria-label={arialabel}
          >
            Yes
          </button>
        </ButtonWrapper>
      )}

      {value.type === "cancel" && (
        <ButtonWrapper>
          <button
            className={
              className
                ? className.join(" ")
                : "mt-2 text-md font-medium text-[#3089cd] bg-gray-200 tracking-wide"
            }
            onClick={(e) => action(false, e)}
            aria-label={arialabel}
          >
            Cancel
          </button>
        </ButtonWrapper>
      )}
    </>
  );
}

export default Buttontag;
