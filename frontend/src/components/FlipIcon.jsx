export default function FlipIcon() {
    return (
        <span
            style={{
                width: "22px",
                height: "24px",
                backgroundColor: "white",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}
        >
            <img
                src="./flipIcon.png"
                alt="flip icon"
                style={{
                    width: "24px",
                    height: "24px",
                    objectFit: "contain",
                    marginLeft: "-2px"
                }}
            />
        </span>
    );
}