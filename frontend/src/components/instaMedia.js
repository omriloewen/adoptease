import React, { useState, useEffect } from "react";
import PostSelectionModal from "./postSelectionModal";
import InstagramPostSelector from "./InstagramPostSelector";

const InstagramMedia = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedCaption, setSelectedCaption] = useState("");

  const handleSelectedImages = (mediaUrls) => {
    // This will receive the images array from the child
    setSelectedImages(mediaUrls);
    console.log("Selected Images:", mediaUrls);
  };

  const handleSelectedCaption = (caption) => {
    setSelectedCaption(caption);
    // This will receive the caption from the child
    console.log("Selected Caption:", caption);
  };

  return (
    <div>
      <h2>Select an Instagram Post to Use as Image</h2>
      <InstagramPostSelector
        onSelectImages={handleSelectedImages}
        onSelectCaption={handleSelectedCaption}
      />
    </div>
  );
};

export default InstagramMedia;
