export default function HistoryTable({ history, onSelect }) {
  return (
    <div className="history-section">
      <h2>Optimization History</h2>

      <table className="history-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Created At</th>
            <th>Original Title</th>
            <th>Optimized Title</th>
          </tr>
        </thead>

        <tbody>
          {history.map((row, i) => (
            <tr key={row.id} onClick={() => onSelect(row)}>
              <td>{i + 1}</td>
              <td>{new Date(row.createdAt).toLocaleString()}</td>
              <td>{row.original.title.slice(0, 50)}...</td>
              <td>{row.optimized.title.slice(0, 50)}...</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
