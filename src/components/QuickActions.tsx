import { Link } from "react-router-dom";

interface Action {
  title: string;
  description: string;
  icon: string;
  color: string;
  href: string;
}

const actions: Action[] = [
  {
    title: "Add New Dish",
    description: "Create a new menu item.",
    icon: "bi-plus-lg",
    color: "primary",
    href: "/add-menu-item",
  },
  {
    title: "Manage Menu",
    description: "Update prices and categories.",
    icon: "bi-card-checklist",
    color: "success",
    href: "/menu",
  },
  {
    title: "View Customers",
    description: "Respond to user feedback.",
    icon: "bi-people",
    color: "warning",
    href: "/customers",
  },
];

function QuickActions() {
  return (
    <div className="dashboard-card p-4 h-100">

      <h5 className="mb-4">
        Quick Actions
      </h5>

      <div className="list-group admin-actions">

        {actions.map((action) => (
          <Link
            key={action.title}
            to={action.href}
            className="list-group-item list-group-item-action d-flex align-items-center gap-3"
          >

            <span
              className={`action-icon bg-${action.color} ${
                action.color === "warning"
                  ? "text-dark"
                  : "text-white"
              } rounded-circle p-2`}
            >
              <i className={`bi ${action.icon}`} />
            </span>

            <div>

              <div className="fw-semibold">
                {action.title}
              </div>

              <small className="text-muted">
                {action.description}
              </small>

            </div>

          </Link>
        ))}

      </div>
    </div>
  );
}

export default QuickActions;