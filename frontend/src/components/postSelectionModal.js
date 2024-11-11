import React, { useState } from "react";
import InstagramPostSelector from "./InstagramPostSelector"; // Import your post selection component
import "bootstrap/dist/css/bootstrap.min.css";

const PostSelectionModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handlePostSelection = (images) => {
    setSelectedImages(images);
    /* handleCloseModal(); */
  };

  return (
    <div>
      {/* Button to Open Modal */}
      <button className="btn btn-primary" onClick={handleOpenModal}>
        Select Instagram Post
      </button>

      {/* Modal */}
      {showModal && (
        <div
          className="modal fade show"
          tabIndex="-1"
          role="dialog"
          style={{
            display: "block",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Adjust for transparency
          }}
          data-bs-backdrop="static" // Makes backdrop non-blocking
        >
          <div
            className="modal-dialog modal-dialog-scrollable"
            style={{
              maxWidth: "500px",
              width: "90%",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Choose Instagram Post</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                <InstagramPostSelector onSelectPost={handlePostSelection} />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Display Selected Images */}
      <h3>Selected Images:</h3>
      <div className="d-flex flex-wrap">
        {selectedImages.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`Selected ${index}`}
            style={{ width: "100px", height: "100px", margin: "5px" }}
          />
        ))}
      </div>
    </div>
  );
};

export default PostSelectionModal;
