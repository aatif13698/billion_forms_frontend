



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


export default {
    handleKeyPress,
    customStyles,
    formatDateToReadableString
}