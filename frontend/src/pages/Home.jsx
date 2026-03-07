import TiltFlipCard from "../components/tilt_flip_card/TiltFlipCard";
import FlipIcon from "../components/FlipIcon";

function NameTitle({ name }) {
  return (<h1>{name}</h1>);
}

function JobTitle({ job }) {
  return (<h2>{job}</h2>);
}

export default function Home({ name, job }) {
  return (
    <div>
      <NameTitle name={name} />
      <JobTitle job={job} />
      <div className="card-container">
        <TiltFlipCard
          frontImg="./vite.svg"
          front={
            <>
              <h3>About Me</h3>

              <h5
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
              >
                Flip to Learn More
                <FlipIcon />
              </h5>
            </>
          }
          back={
            <>
              <h3>Details</h3>
              <ul>
              </ul>
            </>
          }
          maxTilt={20}
        />

        <TiltFlipCard
          frontImg="/modem.jpg"
          front={
            <>
              <h3>Portfolio</h3>
              <h5
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
              >
                Flip to Learn More
                <FlipIcon />
              </h5>
            </>
          }
          backImg="/modem.jpg"
          back={
            <>
              <h3>Details</h3>
              <p>More info here</p>
            </>
          }
          maxTilt={20}
        />

        <TiltFlipCard
          frontImg="./modem.jpg"
          front={
            <>
              <h3>About Me</h3>

              <h5
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
              >
                Flip to Learn More
                <FlipIcon />
              </h5>
            </>
          }
          backImg="./vite.svg"
          back={
            <>
              <h3>Details</h3>
              <ul>
              </ul>
            </>
          }
          maxTilt={20}
        />
      </div>
    </div>
  );
}