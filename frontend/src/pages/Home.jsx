function NameTitle({name}) {
  return (<h1>{name}</h1>);
}

function JobTitle({job}) {
  return (<h2>{job}</h2>);
}

export default function Home({name, job}) {
  return (
    <div>
      <NameTitle name={name} />
      <JobTitle job={job} />
    </div>
  );
}