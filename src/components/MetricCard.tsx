interface MetricCardProps {
  label: string;
  value: string;
  description: string;
  icon: string;
  color: string;
}

function MetricCard({
  label,
  value,
  description,
  icon,
  color,
}: MetricCardProps) {
  return (
    <div className="metric-card p-4 h-100">

      <div className="d-flex align-items-center justify-content-between mb-3">

        <span className="metric-label">
          {label}
        </span>

        <span
          className={`metric-icon bg-${color} text-white rounded-circle p-2`}
        >
          <i className={`bi ${icon}`} />
        </span>

      </div>

      <h2 className="metric-value">
        {value}
      </h2>

      <p className="text-muted mb-0">
        {description}
      </p>

    </div>
  );
}

export default MetricCard;