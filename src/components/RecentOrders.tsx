interface Order {
  id: string;
  customer: string;
  status: string;
  total: string;
  badge: string;
}

const orders: Order[] = [
  {
    id: "#A124",
    customer: "Ahmed T.",
    status: "Delivered",
    total: "EGP 310",
    badge: "success",
  },
  {
    id: "#A125",
    customer: "Noor S.",
    status: "Preparing",
    total: "EGP 245",
    badge: "warning",
  },
  {
    id: "#A126",
    customer: "Youssef H.",
    status: "On the way",
    total: "EGP 420",
    badge: "info",
  },
  {
    id: "#A127",
    customer: "Salma R.",
    status: "Pending",
    total: "EGP 180",
    badge: "secondary",
  },
];

function RecentOrders() {
  return (
    <div className="dashboard-card p-4 h-100">

      <div className="d-flex align-items-center justify-content-between mb-4">

        <div>
          <h5 className="mb-1">
            Recent Orders
          </h5>

          <p className="text-muted mb-0">
            Latest orders from the restaurant
          </p>
        </div>

        <a href="/orders" className="text-decoration-none">
          See all
        </a>

      </div>

      <div className="table-responsive">

        <table className="table align-middle mb-0">

          <thead className="table-light">
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>

            {orders.map((order) => (
              <tr key={order.id}>

                <td>{order.id}</td>

                <td>{order.customer}</td>

                <td>
                  <span
                    className={`badge bg-${order.badge} ${
                      order.badge === "warning" ||
                      order.badge === "info"
                        ? "text-dark"
                        : ""
                    }`}
                  >
                    {order.status}
                  </span>
                </td>

                <td>{order.total}</td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>
    </div>
  );
}

export default RecentOrders;