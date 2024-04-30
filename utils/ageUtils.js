// utils/ageUtils.js

// Function to calculate age from a birthdate
exports.calculateAge = function(birthdate) {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  
  // Function to categorize age into predefined ranges
  exports.categorizeAge = function(age) {
    if (age <= 20) return '16-20';
    else if (age <= 30) return '21-30';
    else if (age <= 40) return '31-40';
    else if (age <= 50) return '41-50';
    else return '51++';
  };