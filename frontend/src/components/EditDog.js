import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import dogBreeds from "./dogBreeds";
import Select from "react-select";
import InstagramPostSelector from "./InstagramPostSelector";

const EditDog = () => {
  const { id } = useParams();
  const [dog, setDog] = useState(null);
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
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchDog = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/dogs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (response.status === 401) {
        // If the token is invalid, redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("roles");
        localStorage.removeItem("name");
        navigate("/login");
      }

      if (response.ok) {
        setDog(data);
        parseBreed(data.breed);
        setFormData({
          name: data.name,
          breed: data.breed,
          status: data.status,
          image_urls: JSON.parse(data.image_urls),
          description: data.description,
        });
      }
    };

    fetchDog();
  }, [id]);

  const parseBreed = (breed) => {
    let breed1 = "";
    let breed2 = "";
    let isMixed = false;

    // Check if the breed includes "מעורב" to set isMixed
    if (breed.includes("מעורב")) {
      isMixed = true;
      breed = breed.replace(" מעורב", ""); // Remove "מעורב" from the end for easier parsing
    }

    // Split breed into two parts if there's a separator (" - ")
    const breeds = breed.split(" - ");

    breed1 = breeds[0] || ""; // The primary breed
    breed2 = breeds[1] || ""; // The secondary breed, if present

    setBreed1(breed1);
    setBreed2(breed2);
    setIsMixed(isMixed);
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

    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:5000/api/dogs/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (response.status === 401) {
      // If the token is invalid, redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("roles");
      localStorage.removeItem("name");
      navigate("/login");
    }

    if (response.ok) {
      alert("פרטי הכלב עודכנו בהצלחה");
      navigate("/view-dogs"); // Redirect back to the dogs list
    } else {
      alert("Failed to update dog.");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("בטוח שברצונך למחוק את הכלב ?");

    if (confirmDelete) {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/dogs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        // If the token is invalid, redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("roles");
        localStorage.removeItem("name");
        navigate("/login");
      }

      if (response.ok) {
        alert("הכלב נמחק בהצלחה");
        navigate("/view-dogs"); // Redirect back to the dog list after deletion
      } else {
        alert("Failed to delete dog.");
      }
    }
  };

  if (!dog) return <p>טוען פרטי כלב...</p>;
  return (
    <div className="container mt-5" style={{ maxWidth: "800px" }}>
      <form onSubmit={handleSubmit} className="mx-auto">
        <div className="row mb-1" dir="rtl">
          <div className="col-md-9 mb-9">
            <h2 className="text-center mb-4">עדכון פרטי כלב</h2>
          </div>
          <div className="col mb-3">
            <button type="submit" className="btn btn-primary">
              עדכן
            </button>
          </div>
          <div className="col mb-3">
            <button
              type="button"
              onClick={handleDelete}
              className="btn btn-danger"
            >
              מחק כלב
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
        <InstagramPostSelector
          onSelectImages={handleSelectedImages}
          onSelectCaption={handleSelectedCaption}
          onSelectPost={handleSelectedPost}
        />

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

export default EditDog;
