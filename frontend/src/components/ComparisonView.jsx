import ListingCard from "./ListingCard";

export default function ComparisonView({ original, optimized }) {
  return (
    <div className="comparison-grid">
      <div>
        <h2>Original</h2>
        <ListingCard
          title={original.title}
          bullets={original.bulletPoints}
          description={original.description}
        />
      </div>

      <div>
        <h2>Optimized</h2>
        <ListingCard
          title={optimized.title}
          bullets={optimized.bulletPoints}
          description={optimized.description}
          keywords={optimized.keywords}
        />
      </div>
    </div>
  );
}
