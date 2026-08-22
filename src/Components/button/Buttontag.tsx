import React from "react";
import "./ButtonTag.css";
import { mergeClasses, ClassValue } from "../../utils/mergeClasses";

interface LoaderType {
  loader: boolean;
  className?: ClassValue;
}
// Button Component props
interface Props {
  value: any;
  setformdata: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
  initialFormData: { [key: string]: any };
  className?: ClassValue;
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
        <span className="tooltip absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-sm rounded py-1 px-2 opacity-0 whitespace-nowrap group-hover:opacity-100 transition-all duration-300 ease-in-out z-40">
          {tooltip}
        </span>
      )}
    </div>
  );

  const baseBtnStyle = "px-4 py-2 rounded-md font-medium text-sm transition-colors cursor-pointer";

  return (
    <>
      {value.type === "button" && (
        <ButtonWrapper>
          <button
            className={mergeClasses(
              `${baseBtnStyle} bg-[#0878ce] text-white hover:bg-[#2a6898]`,
              className
            )}
            type={value.type}
            onClick={(e) => action && action(null, e)}
            aria-label={arialabel}
          >
            {value.name}
          </button>
        </ButtonWrapper>
      )}
      {value.type === "reset" && (
        <ButtonWrapper>
          <button
            className={mergeClasses(
              `${baseBtnStyle} bg-gray-200 text-[#3089cd] hover:bg-gray-300`,
              className
            )}
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
            className={mergeClasses(
              `${baseBtnStyle} bg-[#0878ce] text-white hover:bg-[#2a6898] ${
                disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
              }`,
              className
            )}
            type={value.type}
            aria-label={arialabel}
            disabled={disabled}
          >
            {loader?.loader ? (
              <>
                <span className="text-sm tracking-wide invisible">
                  {value.name}
                </span>
                <span
                  className={mergeClasses(
                    "absolute left-[42%] h-5 w-5 rounded-full animate-spin border-2 border-white border-t-transparent",
                    loader?.className
                  )}
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
            className={mergeClasses(
              `${baseBtnStyle} bg-[#0878ce] text-white hover:bg-[#2a6898]`,
              className
            )}
            onClick={(e) => action && action(true, e)}
            aria-label={arialabel}
          >
            Yes
          </button>
        </ButtonWrapper>
      )}

      {value.type === "cancel" && (
        <ButtonWrapper>
          <button
            className={mergeClasses(
              `${baseBtnStyle} bg-gray-200 text-[#3089cd] hover:bg-gray-300`,
              className
            )}
            onClick={(e) => action && action(false, e)}
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
