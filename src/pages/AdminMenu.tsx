import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/admin-menu.css";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  discount: number;
  restaurant: string;
  image: string;
  isAvailable: boolean;
}

const initialMenuItems: MenuItem[] = [
  {
    id: 1,
    name: "Double Cheese Burger",
    description: "Double beef patties with cheese, lettuce, and special sauce.",
    category: "Burger",
    price: 180,
    discount: 10,
    restaurant: "Burgerizza",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
    isAvailable: true,
  },
  {
    id: 2,
    name: "Pepperoni Pizza",
    description: "Classic pizza with mozzarella cheese and pepperoni.",
    category: "Pizza",
    price: 240,
    discount: 0,
    restaurant: "Burgerizza",
    image:
      "https://images.unsplash.com/photo-1579751626657-72bc17010498",
    isAvailable: true,
  },
  {
    id: 3,
    name: "Crispy Chicken",
    description: "Crispy chicken served with fries and special sauce.",
    category: "Chicken",
    price: 210,
    discount: 15,
    restaurant: "Burgerizza",
    image:
      "https://images.unsplash.com/photo-1562967914-608f82629710",
    isAvailable: false,
  },
  {
    id: 4,
    name: "Chocolate Cake",
    description: "Rich chocolate cake with creamy chocolate topping.",
    category: "Desserts",
    price: 95,
    discount: 0,
    restaurant: "Burgerizza",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
    isAvailable: true,
  },
];

function AdminMenu() {
  const [menuItems, setMenuItems] =
    useState<MenuItem[]>(initialMenuItems);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");

  const [availability, setAvailability] = useState("All");

  const categories = [
    "All",
    ...new Set(menuItems.map((item) => item.category)),
  ];

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.restaurant.toLowerCase().includes(search.toLowerCase());

      const matchCategory =
        category === "All" || item.category === category;

      const matchAvailability =
        availability === "All" ||
        (availability === "Available" && item.isAvailable) ||
        (availability === "Unavailable" && !item.isAvailable);

      return matchSearch && matchCategory && matchAvailability;
    });
  }, [menuItems, search, category, availability]);

  const handleDelete = (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this menu item?"
    );

    if (!confirmDelete) {
      return;
    }

    setMenuItems((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  const handleToggleAvailability = (id: number) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              isAvailable: !item.isAvailable,
            }
          : item
      )
    );
  };

  return (
    <div className="admin-menu-page">

      <div className="container py-5">

        {/* HEADER */}

        <div className="admin-menu-header mb-4">

          <div>

            <div className="admin-menu-label mb-2">

              <i className="bi bi-grid me-2"></i>

              MENU MANAGEMENT

            </div>

            <h1 className="admin-menu-title mb-2">
              Menu Items
            </h1>

            <p className="text-muted mb-0">
              Manage dishes, prices, categories and availability.
            </p>

          </div>

          <div className="d-flex flex-wrap gap-2">

            <Link
              to="/"
              className="btn btn-light admin-menu-back-button"
            >
              <i className="bi bi-arrow-left me-2"></i>

              Dashboard
            </Link>

            <Link
              to="/add-menu-item"
              className="btn admin-add-item-button"
            >
              <i className="bi bi-plus-lg me-2"></i>

              Add Menu Item
            </Link>

          </div>

        </div>

        {/* STATISTICS */}

        <div className="row g-3 mb-4">

          <div className="col-sm-6 col-xl-3">

            <div className="menu-stat-card">

              <div className="menu-stat-icon orange-icon">
                <i className="bi bi-grid-fill"></i>
              </div>

              <div>

                <span className="menu-stat-label">
                  Total Items
                </span>

                <h4 className="mb-0">
                  {menuItems.length}
                </h4>

              </div>

            </div>

          </div>

          <div className="col-sm-6 col-xl-3">

            <div className="menu-stat-card">

              <div className="menu-stat-icon green-icon">
                <i className="bi bi-check-circle-fill"></i>
              </div>

              <div>

                <span className="menu-stat-label">
                  Available
                </span>

                <h4 className="mb-0">
                  {
                    menuItems.filter(
                      (item) => item.isAvailable
                    ).length
                  }
                </h4>

              </div>

            </div>

          </div>

          <div className="col-sm-6 col-xl-3">

            <div className="menu-stat-card">

              <div className="menu-stat-icon red-icon">
                <i className="bi bi-x-circle-fill"></i>
              </div>

              <div>

                <span className="menu-stat-label">
                  Unavailable
                </span>

                <h4 className="mb-0">
                  {
                    menuItems.filter(
                      (item) => !item.isAvailable
                    ).length
                  }
                </h4>

              </div>

            </div>

          </div>

          <div className="col-sm-6 col-xl-3">

            <div className="menu-stat-card">

              <div className="menu-stat-icon blue-icon">
                <i className="bi bi-tags-fill"></i>
              </div>

              <div>

                <span className="menu-stat-label">
                  Categories
                </span>

                <h4 className="mb-0">
                  {categories.length - 1}
                </h4>

              </div>

            </div>

          </div>

        </div>

        {/* FILTERS */}

        <div className="menu-filter-card mb-4">

          <div className="row g-3 align-items-center">

            <div className="col-lg-6">

              <div className="menu-search-box">

                <i className="bi bi-search"></i>

                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

              </div>

            </div>

            <div className="col-md-6 col-lg-3">

              <select
                className="form-select menu-filter-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >

                {categories.map((categoryName) => (
                  <option
                    key={categoryName}
                    value={categoryName}
                  >
                    {categoryName === "All"
                      ? "All Categories"
                      : categoryName}
                  </option>
                ))}

              </select>

            </div>

            <div className="col-md-6 col-lg-3">

              <select
                className="form-select menu-filter-select"
                value={availability}
                onChange={(e) =>
                  setAvailability(e.target.value)
                }
              >

                <option value="All">
                  All Availability
                </option>

                <option value="Available">
                  Available
                </option>

                <option value="Unavailable">
                  Unavailable
                </option>

              </select>

            </div>

          </div>

        </div>

        {/* MENU ITEMS */}

        {filteredItems.length > 0 ? (

          <div className="row g-4">

            {filteredItems.map((item) => (

              <div
                key={item.id}
                className="col-md-6 col-xl-4"
              >

                <div className="admin-menu-item-card">

                  <div className="menu-item-image">

                    <img
                      src={item.image}
                      alt={item.name}
                    />

                    <span
                      className={`availability-badge ${
                        item.isAvailable
                          ? "available"
                          : "unavailable"
                      }`}
                    >
                      {item.isAvailable
                        ? "Available"
                        : "Unavailable"}
                    </span>

                    {item.discount > 0 && (

                      <span className="discount-badge">
                        -{item.discount}%
                      </span>

                    )}

                  </div>

                  <div className="menu-item-body">

                    <div className="d-flex justify-content-between gap-3 mb-2">

                      <div>

                        <span className="menu-category">
                          {item.category}
                        </span>

                        <h5 className="menu-item-name mt-2 mb-0">
                          {item.name}
                        </h5>

                      </div>

                      <div className="menu-item-price">
                        EGP {item.price}
                      </div>

                    </div>

                    <p className="menu-item-description">
                      {item.description}
                    </p>

                    <div className="restaurant-name">

                      <i className="bi bi-shop me-2"></i>

                      {item.restaurant}

                    </div>

                    <div className="menu-card-actions">

                      <button
                        type="button"
                        className={`btn availability-action ${
                          item.isAvailable
                            ? "disable-button"
                            : "enable-button"
                        }`}
                        onClick={() =>
                          handleToggleAvailability(item.id)
                        }
                      >
                        <i
                          className={`bi ${
                            item.isAvailable
                              ? "bi-eye-slash"
                              : "bi-eye"
                          } me-2`}
                        ></i>

                        {item.isAvailable
                          ? "Disable"
                          : "Enable"}
                      </button>

                      <Link
                        to={`/edit-menu-item/${item.id}`}
                        className="btn edit-menu-button"
                      >
                        <i className="bi bi-pencil"></i>
                      </Link>

                      <button
                        type="button"
                        className="btn delete-menu-button"
                        onClick={() =>
                          handleDelete(item.id)
                        }
                      >
                        <i className="bi bi-trash"></i>
                      </button>

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

        ) : (

          <div className="empty-menu-state">

            <i className="bi bi-search"></i>

            <h4>No menu items found</h4>

            <p>
              Try changing your search or filter options.
            </p>

          </div>

        )}

      </div>

    </div>
  );
}

export default AdminMenu;