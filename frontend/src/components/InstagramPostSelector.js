import React, { useState, useEffect } from "react";
import PostCarousel from "./PostCarousel";
import TextLessMore from "./TextLessMore";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaInstagram } from "react-icons/fa";

const InstagramPostSelector = ({
  onSelectImages,
  onSelectCaption,
  onSelectPost,
}) => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    const fetchInstagramPosts = async () => {
      try {
        const token = process.env.REACT_APP_INSTAGRAM_ACCESS_TOKEN;
        console.log(token); // Replace with your actual token
        const response = await fetch(
          `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,children{media_url,media_type}&access_token=${token}`
        );
        const data = await response.json();

        const fetchedPosts = data.data.map((post) => {
          const mediaUrls = [];
          if (post.children) {
            post.children.data.forEach((child) => {
              if (
                child.media_type === "IMAGE" ||
                child.media_type === "VIDEO"
              ) {
                mediaUrls.push(child.media_url);
              }
            });
          } else {
            mediaUrls.push(post.media_url);
          }
          return {
            id: post.id,
            caption: post.caption || "No caption",
            mediaUrls,
          };
        });

        setPosts(fetchedPosts);
        setFilteredPosts(fetchedPosts); // Initialize filteredPosts with all posts
      } catch (error) {
        console.error("Error fetching Instagram posts:", error);
      }
    };

    fetchInstagramPosts();
  }, []);

  const handleMouseDown = (post) => {
    // Start timer for "long click" (e.g., 1000ms)
    const newTimer = setTimeout(() => handleSelectPost(post), 450);
    setTimer(newTimer);
  };

  const handleMouseUp = () => {
    // Clear the timer if mouse released early
    clearTimeout(timer);
  };
  const handleSelectPost = (post) => {
    setSelectedPost(post); // Set the selected post by clicking on it
  };

  const finalizeImagesSelection = () => {
    if (selectedPost) {
      const ok = window.confirm(
        "פעולה זו תמחק את התמונות הקודמות אם קיימות, בטוחים שברצונכם לעשות זאת?"
      );
      if (ok) {
        onSelectImages(selectedPost.mediaUrls); // Finalize the selected post
        setShowModal(false); // Close modal
      }
    }
  };

  const finalizeCaptionSelection = () => {
    if (selectedPost) {
      const ok = window.confirm(
        "פעולה זו תמחק את התיאור הקודם אם קיים, בטוחים שברצונכם לעשות זאת?"
      );
      if (ok) {
        onSelectCaption(selectedPost.caption); // Finalize the selected post
        setShowModal(false); // Close modal
      }
    }
  };

  const finalizePostSelection = () => {
    if (selectedPost) {
      const ok = window.confirm(
        "פעולה זו תמחק את התיאור והתמונות הקודמים אם קייימים, בטוחים שברצונכם לעשות זאת?"
      );
      if (ok) {
        onSelectPost(selectedPost.mediaUrls, selectedPost.caption); // Finalize the selected post
        setShowModal(false); // Close modal
      }
    }
  };

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredPosts(
      posts.filter((post) => post.caption.toLowerCase().includes(term))
    );
  };

  return (
    <div>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => setShowModal(true)}
      >
        בחרו פוסט <FaInstagram />
      </button>

      {/* Modal */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-scrollable">
            <div className="modal-content">
              <div
                className="modal-header flex-column align-items-center"
                dir="rtl"
              >
                {/* Row for Close Button and Title */}
                <div className="d-flex justify-content-between w-100 mb-3">
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                  <h5 className="modal-title text-center flex-grow-1">
                    בחרו פוסט
                  </h5>
                </div>

                {/* Row for Search Input */}
                <div className="w-100">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="חיפוש..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>

              {/* Search Bar */}
              <div className="modal-body">
                <div className="row">
                  {filteredPosts.map((post) => (
                    <div
                      className={`col-12 mb-3 rounded ${
                        !(selectedPost && selectedPost.id === post.id)
                          ? "post-option"
                          : ""
                      }`}
                      key={post.id}
                      style={{
                        padding: "7px",
                        cursor: "pointer",
                        border: `${
                          selectedPost && selectedPost.id === post.id
                            ? "2px solid #8b4513"
                            : "2px solid white"
                        }`,
                      }}
                      /* onClick={() => handleSelectPost(post)} */
                      onMouseDown={() => handleMouseDown(post)}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp} // Select post on click
                    >
                      <PostCarousel
                        images={post.mediaUrls}
                        carouselId={`carousel-${post.id}`}
                      />
                      <TextLessMore text={post.caption} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={finalizeCaptionSelection}
                  disabled={!selectedPost} // Disable if no post selected
                >
                  עדכן תיאור
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={finalizeImagesSelection}
                  disabled={!selectedPost} // Disable if no post selected
                >
                  עדכן תמונות
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={finalizePostSelection}
                  disabled={!selectedPost} // Disable if no post selected
                >
                  עדכן הכל
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstagramPostSelector;
