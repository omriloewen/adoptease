import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Make sure Bootstrap is imported
import Select from "react-select";
import dogBreeds from "./dogBreeds";
import InstagramPostSelector from "./InstagramPostSelector";

const AddDog = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    breed: "",
    status: "available",
    image_urls: ["", "", "", "", ""],
    description: "",
  });

  const [breed1, setBreed1] = useState("");
  const [breed2, setBreed2] = useState("");
  const [isMixed, setIsMixed] = useState(false);

  const dogBreedsOptions = dogBreeds.map((breed) => ({
    value: breed,
    label: breed,
  }));

  const handleSelectedImages = (mediaUrls) => {
    // This will receive the images array from the child
    setFormData({
      ...formData,
      image_urls: mediaUrls,
    });
    console.log("Selected Images:", mediaUrls);
  };

  const handleSelectedPost = (mediaUrls, caption) => {
    // This will receive the images array from the child
    setFormData({
      ...formData,
      image_urls: mediaUrls,
      description: caption,
    });

    console.log("Selected Images:", mediaUrls);
    console.log("Selected Caption:", caption);
  };

  const handleSelectedCaption = (caption) => {
    setFormData({
      ...formData,
      description: caption,
    });
    // This will receive the caption from the child
    console.log("Selected Caption:", caption);
  };

  const handleBreedChange1 = (selectedOption) => {
    const selectedBreed1 = selectedOption ? selectedOption.value : "";
    setBreed1(selectedBreed1);
    setFormData({
      ...formData,
      breed: `${selectedBreed1}${breed2 ? ` - ${breed2}` : ""}${
        isMixed ? " מעורב" : ""
      }`,
    });
  };

  const handleBreedChange2 = (selectedOption) => {
    const selectedBreed2 = selectedOption ? selectedOption.value : "";
    setBreed2(selectedBreed2);
    setFormData({
      ...formData,
      breed: `${breed1}${selectedBreed2 ? ` - ${selectedBreed2}` : ""}${
        isMixed ? " מעורב" : ""
      }`,
    });
  };

  const handleMixedChange = (e) => {
    const mixedStatus = e.target.checked;
    setIsMixed(mixedStatus);
    setFormData({
      ...formData,
      breed: `${breed1}${breed2 ? ` - ${breed2}` : ""}${
        mixedStatus ? " מעורב" : ""
      }`,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAdditionalImageChange = (index, value) => {
    const updatedImages = [...formData.image_urls];
    updatedImages[index] = value;
    setFormData({ ...formData, image_urls: updatedImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/api/dogs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(formData),
    });

    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("roles");
      localStorage.removeItem("name");
      navigate("/login");
    }

    if (response.ok) {
      alert("הכלב נוסף בהצלחה");
      navigate("/view-dogs");
    } else {
      alert("Failed to add dog");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "800px" }}>
      <form onSubmit={handleSubmit} className="mx-auto">
        <div className="row mb-1" dir="rtl">
          <div className="col-md-9 mb-9">
            <h2 className="text-center mb-4">הוספת כלב</h2>
          </div>
          <div className="col mb-3">
            <button type="submit" className="btn btn-primary">
              הוסף כלב
            </button>
          </div>
        </div>
        <div className="row mb-1" dir="rtl">
          <div className="col-sm mb-3">
            <label className="form-label">שם הכלב</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>

          <div className="col mb-3">
            <label className="form-label">גזע</label>
            <div class="row row-lg gx-0 mb-3 md-0">
              <Select
                options={dogBreedsOptions}
                onChange={handleBreedChange1}
                placeholder="ראשי"
                value={dogBreedsOptions.find(
                  (option) => option.value === breed1
                )}
                className="col-4 px-0 form-select-sm"
              />
              <Select
                options={dogBreedsOptions}
                onChange={handleBreedChange2}
                placeholder="משני"
                value={dogBreedsOptions.find(
                  (option) => option.value === breed2
                )}
                className="col-4 px-0 form-select-sm"
              />
              <div
                class="col-4 px-1 mt-1 input-group-text"
                style={{ height: "95%" }}
              >
                <input
                  type="checkbox"
                  id="isMixed"
                  checked={isMixed}
                  onChange={handleMixedChange}
                  className="form-check-input mt-0"
                />
                <label class="" id="basic-addon1">
                  מעורב
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="row mb-1" dir="rtl">
          <div className="col mb-3">
            <label className="form-label">סטטוס</label>
            <select
              class="form-select form-select-sm"
              value={formData.status}
              name="status"
              onChange={handleChange}
            >
              <option selected value="available">
                זמין לאימוץ
              </option>
              <option value="adopted">אומץ</option>
              <option value="not-available">אחר</option>
            </select>
          </div>
        </div>
        <div>
          <InstagramPostSelector
            onSelectImages={handleSelectedImages}
            onSelectCaption={handleSelectedCaption}
            onSelectPost={handleSelectedPost}
          />
        </div>
        <div className="row mb-1" dir="rtl">
          <div className="col mb-3">
            <label className="form-label">תיאור</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-control"
              rows="3"
            />
          </div>
        </div>

        {/* Insert the new image gallery component here */}
        <div className=" row mb-1" dir="rtl">
          <label className="form-label">תמונות</label>

          <div className="row">
            {formData.image_urls.map((url, index) => (
              <div key={index} className="col-md-4 mb-3">
                <div
                  className="image-placeholder text-center"
                  style={{ position: "relative" }}
                >
                  {/* Image or Placeholder */}
                  {url ? (
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="img-thumbnail"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        margin: "0 auto",
                      }} // Ensures image is centered
                    />
                  ) : (
                    <div
                      style={{
                        width: "100px",
                        height: "100px",
                        backgroundColor: "#f0f0f0",
                        border: "1px dashed #ccc",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        margin: "0 auto", // Centers the placeholder
                      }}
                    >
                      <i
                        className="bi bi-image"
                        style={{ fontSize: "24px", color: "#ccc" }}
                      ></i>{" "}
                      {/* Use lowercase 'i' instead of 'I' */}
                    </div>
                  )}

                  {/* Input for image URL */}
                  <input
                    type="url"
                    value={url}
                    onChange={(e) =>
                      handleAdditionalImageChange(index, e.target.value)
                    }
                    placeholder={`תמונה נוספת ${index + 1}`}
                    className="form-control form-control-sm mt-2"
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddDog;
