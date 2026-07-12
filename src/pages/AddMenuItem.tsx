import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import "../styles/add-menu-item.css";

function AddMenuItem() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    discount: "",
    restaurant: "",
    image: "",
    isAvailable: true,
  });

  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    console.log(formData);
  };

  return (
    <div className="add-menu-page">
      <div className="container py-5">

        {/* Top Header */}

        <div className="add-menu-header mb-4">

          <div>
            <div className="page-label mb-2">
              <i className="bi bi-grid me-2"></i>
              MENU MANAGEMENT
            </div>

            <h1 className="add-menu-title mb-2">
              Add New Menu Item
            </h1>

            <p className="text-muted mb-0">
              Create a new dish and add it to the Burgerizza menu.
            </p>
          </div>

          <Link
            to="/"
            className="btn btn-light back-button"
          >
            <i className="bi bi-arrow-left me-2"></i>
            Back to Dashboard
          </Link>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="row g-4">

            {/* LEFT SIDE */}

            <div className="col-lg-8">

              {/* BASIC INFORMATION */}

              <div className="menu-form-card mb-4">

                <div className="section-header">
                  <div className="section-icon">
                    <i className="bi bi-info-lg"></i>
                  </div>

                  <div>
                    <h5 className="mb-1">
                      Basic Information
                    </h5>

                    <p className="text-muted mb-0">
                      Enter the main details of your menu item.
                    </p>
                  </div>
                </div>

                <div className="row g-4">

                  <div className="col-md-7">

                    <label className="form-label">
                      Dish Name
                      <span className="required">*</span>
                    </label>

                    <input
                      type="text"
                      className="form-control custom-input"
                      name="name"
                      placeholder="e.g. Double Cheese Burger"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />

                  </div>

                  <div className="col-md-5">

                    <label className="form-label">
                      Category
                      <span className="required">*</span>
                    </label>

                    <select
                      className="form-select custom-input"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">
                        Select category
                      </option>

                      <option value="Burger">
                        Burger
                      </option>

                      <option value="Pizza">
                        Pizza
                      </option>

                      <option value="Chicken">
                        Chicken
                      </option>

                      <option value="Drinks">
                        Drinks
                      </option>

                      <option value="Desserts">
                        Desserts
                      </option>
                    </select>

                  </div>

                  <div className="col-12">

                    <label className="form-label">
                      Description
                    </label>

                    <textarea
                      rows={5}
                      maxLength={300}
                      className="form-control custom-input description-input"
                      name="description"
                      placeholder="Describe the ingredients and what makes this dish special..."
                      value={formData.description}
                      onChange={handleChange}
                    />

                    <div className="description-counter">
                      {formData.description.length}/300
                    </div>

                  </div>

                </div>

              </div>

              {/* PRICING */}

              <div className="menu-form-card">

                <div className="section-header">

                  <div className="section-icon">
                    <i className="bi bi-cash-stack"></i>
                  </div>

                  <div>
                    <h5 className="mb-1">
                      Pricing & Restaurant
                    </h5>

                    <p className="text-muted mb-0">
                      Set the price, discount, and restaurant information.
                    </p>
                  </div>

                </div>

                <div className="row g-4">

                  <div className="col-md-4">

                    <label className="form-label">
                      Price
                      <span className="required">*</span>
                    </label>

                    <div className="input-group">

                      <span className="input-group-text">
                        EGP
                      </span>

                      <input
                        type="number"
                        min="0"
                        className="form-control custom-input"
                        name="price"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={handleChange}
                        required
                      />

                    </div>

                  </div>

                  <div className="col-md-4">

                    <label className="form-label">
                      Discount
                    </label>

                    <div className="input-group">

                      <input
                        type="number"
                        min="0"
                        max="100"
                        className="form-control custom-input"
                        name="discount"
                        placeholder="0"
                        value={formData.discount}
                        onChange={handleChange}
                      />

                      <span className="input-group-text">
                        %
                      </span>

                    </div>

                  </div>

                  <div className="col-md-4">

                    <label className="form-label">
                      Restaurant
                    </label>

                    <input
                      type="text"
                      className="form-control custom-input"
                      name="restaurant"
                      placeholder="Burgerizza"
                      value={formData.restaurant}
                      onChange={handleChange}
                    />

                  </div>

                </div>

              </div>

            </div>

            {/* RIGHT SIDE */}

            <div className="col-lg-4">

              <div className="menu-form-card mb-4">

                <div className="section-header">

                  <div className="section-icon">
                    <i className="bi bi-image"></i>
                  </div>

                  <div>
                    <h5 className="mb-1">
                      Dish Image
                    </h5>

                    <p className="text-muted mb-0">
                      Add an image URL for the dish.
                    </p>
                  </div>

                </div>

                <div className="image-preview">

                  {formData.image ? (
                    <img
                      src={formData.image}
                      alt="Dish Preview"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="image-placeholder">

                      <i className="bi bi-image"></i>

                      <span>
                        Image Preview
                      </span>

                    </div>
                  )}

                </div>

                <label className="form-label mt-4">
                  Image URL
                </label>

                <input
                  type="url"
                  className="form-control custom-input"
                  name="image"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image}
                  onChange={handleChange}
                />

              </div>

              {/* AVAILABILITY */}

              <div className="menu-form-card mb-4">

                <div className="availability-box">

                  <div className="availability-icon">

                    <i className="bi bi-check-circle"></i>

                  </div>

                  <div className="availability-content">

                    <label
                      htmlFor="availability"
                      className="fw-semibold"
                    >
                      Item Availability
                    </label>

                    <p className="text-muted mb-0">
                      Customers can order this item.
                    </p>

                  </div>

                  <div className="form-check form-switch ms-auto">

                    <input
                      id="availability"
                      className="form-check-input availability-switch"
                      type="checkbox"
                      checked={formData.isAvailable}
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          isAvailable: !prev.isAvailable,
                        }))
                      }
                    />

                  </div>

                </div>

              </div>

              {/* ACTIONS */}

              <div className="menu-actions">

                <button
                  type="submit"
                  className="btn save-item-button"
                >
                  <i className="bi bi-plus-lg me-2"></i>
                  Create Menu Item
                </button>

                <Link
                  to="/"
                  className="btn btn-light cancel-button"
                >
                  Cancel
                </Link>

              </div>

            </div>

          </div>

        </form>

      </div>
    </div>
  );
}

export default AddMenuItem;