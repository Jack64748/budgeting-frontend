import React from 'react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload'; // Path to your component

const UploadPage = () => {
  const navigate = useNavigate();


  const handleRedirect = () => {
    console.log("Redirect function called in Parent!");
    navigate('/'); 
  };

  return (
    <div className="upload-page-container">
      <header className="page-header">
        <h1>Import Data</h1>
        <p>Please upload your CSV statement to populate your dashboard.</p>
      </header>

      <div className="upload-card">
        {/* We use the component here */}
        <FileUpload onUploadSuccess={handleRedirect} />
      </div>
      
      <div className="upload-instructions">
        <h3>Instructions:</h3>
        <ul>
          <li>Ensure the file is in .CSV format</li>
          <li>Headers must include: Type, Product, Started Date, Description, Amount</li>
        </ul>
      </div>
    </div>
  );
};

export default UploadPage;