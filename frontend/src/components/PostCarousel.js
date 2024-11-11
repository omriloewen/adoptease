import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const PostCarousel = ({ images, carouselId }) => {
  const flattenedImages = images.flat();
  console.log(flattenedImages);
  return (
    <div id={carouselId} className="carousel slide" style={{ padding: "5px" }}>
      <div className="carousel-inner rounded">
        <div class="ratio ratio-1x1">
          {flattenedImages.map((image, index) => (
            <div
              className={`carousel-item ${index === 0 ? "active" : ""}`}
              key={index}
              style={{ margin: "0" }}
            >
              <img
                src={image}
                className="rounded mx-auto d-block w-100 "
                alt={`Slide ${index}`}
                style={{ objectFit: "cover" }}
              />
            </div>
          ))}
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target={`#${carouselId}`}
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target={`#${carouselId}`}
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
};

export default PostCarousel;
