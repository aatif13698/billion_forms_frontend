

import CryptoJS from "crypto-js";
const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY || "my-secret-key";


const handleKeyPress = (e) => {
  const value = e.target.value;
  const cleanedValue = value.replace(/[^6-9\d]/g, "");
  if (cleanedValue.trim() !== "") {
    e.target.value = cleanedValue;
  } else {
    e.target.value = "";
  }
};

function formatDateToReadableString(isoDateString) {
  const date = new Date(isoDateString);

  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();

  return `${day} ${month}, ${year}`;
}


function formatDateToYYYYMMDD(dateString) {
  if (!dateString) return null;

  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}





const customStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: "transparent",
    borderColor: "#ccc",
  }),
  input: (provided) => ({
    ...provided,
    backgroundColor: "transparent",
    color: "#000",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#000",
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "#333", // Dropdown background color
  }),
  option: (provided, { isFocused, isSelected }) => ({
    ...provided,
    backgroundColor: isSelected ? "#555" : isFocused ? "#444" : "transparent", // Option background color
    color: isSelected ? "#fff" : "#ddd", // Text color for options
    cursor: "pointer",
  })
};


const encryptId = (id) => {
  const encrypted = CryptoJS.AES.encrypt(id.toString(), SECRET_KEY).toString();
  // URL-safe encoding
  return encodeURIComponent(encrypted);
};


const decryptId = (encryptedId) => {
  try {
    const decoded = decodeURIComponent(encryptedId);
    const bytes = CryptoJS.AES.decrypt(decoded, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
};


// const LoadingSpinner = () => (
//   <div className="flex justify-center items-center min-h-screen">
//     <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
//   </div>
// );


function extractFilename(url) {
  // Validate input
  if (!url || typeof url !== 'string') {
    return 'Invalid or missing URL'
  }

  // Parse URL
  const parsedUrl = new URL(url);
  const pathSegments = parsedUrl.pathname.split('/').filter(segment => segment);

  // Check if path has at least one segment (filename)
  if (pathSegments.length === 0) {
    return 'URL has no path segments';
  }

  // Return the last segment (filename)
  const filename = pathSegments[pathSegments.length - 1];
  if (!filename) {
    return 'No filename found in URL'
  }

  return filename;

}

function extractAfterFM(input) {
  const match = input.match(/FM(\d+)/);
  return match ? match[1] : null;
}

function createSerialRanges(serials, limit = 20) {
  const result = [];
  for (let i = 0; i < serials.length; i += limit) {
    const chunk = serials.slice(i, i + limit);
    // console.log("chunk",chunk);
    
    result.push({
      start: chunk[chunk.length - 1], // smallest serial in the chunk
      end: chunk[0],                  // highest serial in the chunk

    });
  }
  return result;
}

const calculateEndDate = function (validityPeriod) {
  const startDate = new Date();
  let endDate;

  switch (validityPeriod) {
    case 'weekly':
      endDate = new Date(startDate.setDate(startDate.getDate() + 7));
      break;
    case 'monthly':
      endDate = new Date(startDate.setMonth(startDate.getMonth() + 1));
      break;
    case 'quarterly':
      endDate = new Date(startDate.setMonth(startDate.getMonth() + 3));
      break;
    case 'halfyearly':
      endDate = new Date(startDate.setMonth(startDate.getMonth() + 6));
      break;
    case 'yearly':
      endDate = new Date(startDate.setFullYear(startDate.getFullYear() + 1));
      break;
    case 'infinite':
      return null; // No end date for infinite plans
    default:
      return null;
  }

  // Format the date as MM/DD/YYYY
  const formatted = `${endDate.getMonth() + 1}/${endDate.getDate()}/${endDate.getFullYear()}`;
  return formatted;
};



export default {
  handleKeyPress,
  customStyles,
  formatDateToReadableString,
  formatDateToYYYYMMDD,
  encryptId,
  decryptId,
  extractFilename,
  extractAfterFM,
  createSerialRanges,
  calculateEndDate
}