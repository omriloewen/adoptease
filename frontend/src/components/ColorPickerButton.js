import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';  // Ensure Bootstrap Icons are imported

const ColorPickerButton = ({ row, handleColoring }) => {
  const [selectedColor, setSelectedColor] = useState(row.values.colorMark || '#ffffff');
  
  const predefinedColors = [
    '#ffffff',  // Default - White
    '#ffcccc',  // Light Pink
    '#ffd9b3',  // Light Peach
    '#ffffcc',  // Light Yellow
    '#ccffcc',  // Light Mint
    '#ccffff',  // Light Cyan
    '#cce0ff',  // Light Blue
    '#e0ccff',  // Light Lavender
    '#ffccff'   // Light Lilac
  ];

  // Sync the button color with the row color when filtering or updating the table
  useEffect(() => {
    setSelectedColor(row.values.colorMark || '#ffffff');
  }, [row.values.colorMark]);

  const handleSelectColor = (color) => {
    setSelectedColor(color);  // Update the button color
    handleColoring(color, row.values.id);  // Call the handleColoring function to update the color
  };

  return (
    <Dropdown>
      <Dropdown.Toggle
        variant="secondary"
        style={{
          backgroundColor: selectedColor,
          border: '3px solid #ccc',
          width: '45px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Color palette icon inside the button */}
        <i className="bi bi-palette" style={{ fontSize: '1.2rem', color: '#000' }}></i>
      </Dropdown.Toggle>

      <Dropdown.Menu style={{ minWidth: '120px' }}>  {/* Adjust dropdown menu width here */}
        {predefinedColors.map((color, index) => (
          <Dropdown.Item
            key={index}
            onClick={() => handleSelectColor(color)}
            style={{
              backgroundColor: color,
              width: '100%',
              height: '30px',
              padding: '5px',
              border: '1px solid #ccc',
            }}
          >
            {/* Just the color block */}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ColorPickerButton;