import React from "react"

export default function Tooltip({ children, tooltipText }) {
    const tipRef = React.createRef(null);
    function handleMouseEnter() {
        tipRef.current.style.opacity = 1;
        tipRef.current.style.marginTop = "20px";
    }
    function handleMouseLeave() {
        tipRef.current.style.opacity = 0;
        tipRef.current.style.marginTop = "10px";
    }
    return (
        <div
            className="relative flex items-center justify-center"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div
                className="absolute flex flex-col items-center w-auto h-auto px-4 py-2 text-black transition-all duration-150 rounded-sm"
                style={{ marginLeft: 0, top: "100%", opacity: 0 }}
                ref={tipRef}
            >
                <p className="w-full text-lg text-center text-black whitespace-nowrap">
                {tooltipText}
                </p>
                <p className="w-full text-xs text-center text-black whitespace-nowrap">
                Click to see projects
                </p>
            </div>
            {children}
        </div>
    );
}