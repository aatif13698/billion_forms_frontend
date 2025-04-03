



const handleKeyPress = (e) => {
    const value = e.target.value;
    const cleanedValue = value.replace(/[^6-9\d]/g, ""); 
    if (cleanedValue.trim() !== "") {
        e.target.value = cleanedValue;
    } else {
        e.target.value = "";
    }
};


export default {
    handleKeyPress
}