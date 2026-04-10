import React from "react";
import "./ButtonTag.css";

interface LoaderType {
  loader: boolean;
  className?: string[];
}
// Button Component props
interface Props {
  value: any;
  setformdata: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
  initialFormData: { [key: string]: any };
  className: string[] | undefined;
  action?: (data: any, e: React.MouseEvent) => void;
  arialabel?: string;
  tooltip?: string;
  disabled?: boolean;
  loader?: LoaderType;
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
    disabled,
  } = props;

  // Handle reset funcction
  const handleResetFn = (e: React.MouseEvent) => {
    e.preventDefault();
    setformdata(initialFormData);
  };

  // Button Wrrapper Function
  const ButtonWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="relative group inline-block">
      {children}
      {/* Tooltip */}
      {!loader?.loader && tooltip && (
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
                : "relative z-50 text-md font-medium text-[#3089cd] bg-gray-200 tracking-wide"
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
            className={`${
              className
                ? className.join(" ")
                : "text-md tracking-wide bg-[#0878ce] hover:bg-[#2a6898]"
            } ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
            type={value.type}
            aria-label={arialabel}
            disabled={disabled}
          >
            {loader?.loader ? (
              <>
                {" "}
                <span className="text-md tracking-wide invisible">
                  {value.name}
                </span>
                <span
                  className={`absolute left-[42%] h-6 w-6 rounded-full animate-spin ${
                    loader?.className
                      ? loader.className.join(" ")
                      : "border-2 border-white border-t-blue-500"
                  }`}
                ></span>
              </>
            ) : (
              <>{value.name}</>
            )}
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
