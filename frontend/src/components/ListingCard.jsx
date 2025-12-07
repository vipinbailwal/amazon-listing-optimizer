export default function ListingCard({ title, bullets, description, keywords }) {
  return (
    <div className="card">
      <h3>{title}</h3>

      <h4>Bullet Points:</h4>
      <ul>
        {bullets?.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>

      <h4>Description:</h4>
      <p>{description}</p>

      {keywords && (
        <>
          <h4>Suggested Keywords:</h4>
          <div className="keywords">
            {keywords.map((k, i) => (
              <span key={i} className="keyword">
                {k}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
