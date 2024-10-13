import React, { useRef, useState } from 'react';
import '../css/home.css';

const HomePage = () => {
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Trạng thái tải
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setErrors('File is too large. Maximum file size is 5MB.');
        setFile(null);
      } else {
        setErrors('');
        setFile(selectedFile);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setErrors('Please select a file before submitting.');
      return;
    }

    setIsLoading(true); // Bắt đầu tải
    try {
      const formData = new FormData();
      formData.append('files', file);
      const token = '1c330e26b8e2090711ee01f6b6fc56b955ccdf11800b97d5e0a6119e9f24416b2aaf89286a3e20182592ff983b86988e2fa7e15a78539875ec070a2187e9ece69f84df7ec4f6f849ceab6d57ff64efc8e0576f56599a6651629be7474221a1196cccbee35449afcd5a6fe3d0c97d41dd354a1340b2f5a9b4d182b92348847631';
      const response = await fetch(`/api/product-designs/import`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setSuccessMessage('File imported successfully');
        setTimeout(() => {
          setSuccessMessage('');
          setFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Reset input file bằng ref
          }
        }, 2000);
      } else {
        const errorMessage = result.message || 'Failed to import file';
        setErrors(errorMessage);
      }
    } catch (error) {
      console.error('Error during file submission:', error);
      setErrors('An error occurred during file submission');
    } finally {
      setIsLoading(false); // Dừng tải sau khi API hoàn thành
    }
  };

  return (
    <section className='import'>
      <div className='import-wrap'>
        <form className='import-form' onSubmit={handleSubmit}>
          <label htmlFor='#file'></label>
          <input
            type='file'
            id='file'
            className='import-form-inpu t'
            onChange={handleFileChange}
            ref={fileInputRef} // Gắn ref vào input file
          />
          {errors && <p className='import-error'>{errors}</p>}
          {successMessage && <p className='import-success'>{successMessage}</p>}
          <div className={`import-form-submit-wrap ${isLoading ? 'loading' : ''}`}><input
            type='submit'
            value={isLoading ? 'Importing...' : 'Import Product'}
            className={`import-form-submit `} // Thêm class loading khi đang tải
            disabled={isLoading} // Disable nút khi đang tải
          />
          </div>
        </form>
      </div>
    </section>
  );
};

export default HomePage;
