// src/utils/validators.js

// ✅ Email Validation (RFC 5322 simplified)
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return re.test(String(email).toLowerCase())
    ? ""
    : "Invalid email address";
};

// ✅ Phone Validation (10–15 digits, allows country codes)
export const validatePhone = (phone) => {
  const re = /^\+?[0-9]{10,12}$/; 
  return re.test(phone) ? "" : "Invalid phone number";
};

// ✅ Name Validation (letters + spaces, at least 2 chars)
export const validateName = (name) => {
  return /^[A-Za-z\s]{2,50}$/.test(name.trim())
    ? ""
    : "Name should be 2–50 letters only";
};

// ✅ Password Validation (min 6 chars, 1 letter & 1 number)
export const validatePassword = (password) => {
  const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;
  return re.test(password)
    ? ""
    : "Password must be at least 6 characters, include a letter & number";
};

// ✅ DOB Validation (dd-mm-yyyy format + age >= 13)
export const validateDOB = (dob) => {
  if (!dob) return "Date of Birth is required";

  // Match dd-mm-yyyy strictly
  const re = /^([0-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-(19|20)\d{2}$/;
  if (!re.test(dob)) return "DOB must be in dd-mm-yyyy format";

  const [day, month, year] = dob.split("-").map(Number);
  const birthDate = new Date(year, month - 1, day);

  if (isNaN(birthDate.getTime())) return "Invalid Date of Birth";

  // ✅ Check age >= 13
  const today = new Date();
  let age = today.getFullYear() - year;
  if (
    today.getMonth() + 1 < month ||
    (today.getMonth() + 1 === month && today.getDate() < day)
  ) {
    age--;
  }

  return age >= 13 ? "" : "You must be at least 13 years old";
};

// ✅ Address Line Validation (basic check)
export const validateAddress = (address) => {
  return address && address.trim().length >= 5
    ? ""
    : "Address must be at least 5 characters";
};

// ✅ City Validation (letters only)
export const validateCity = (city) => {
  return /^[A-Za-z\s]{2,50}$/.test(city.trim())
    ? ""
    : "City should be 2–50 letters only";
};

// ✅ State Validation (letters only)
export const validateState = (state) => {
  return /^[A-Za-z\s]{2,50}$/.test(state.trim())
    ? ""
    : "State should be 2–50 letters only";
};

// ✅ Postal Code Validation (5–10 digits/letters)
export const validatePostalCode = (postalCode) => {
  return /^[A-Za-z0-9\s-]{4,10}$/.test(postalCode.trim())
    ? ""
    : "Invalid postal code";
};

// ✅ Country Validation (letters only)
export const validateCountry = (country) => {
  return /^[A-Za-z\s]{2,50}$/.test(country.trim())
    ? ""
    : "Country should be 2–50 letters only";
};

export const validateShopName = (shopName) => {
  if (!shopName || shopName.trim().length < 3) {
    return "Shop name must be at least 3 characters long";
  }

  const re = /^[a-zA-Z0-9\s&-]+$/;
  return re.test(shopName)
    ? ""
    : "Shop name can only contain letters, numbers, spaces, & and -";
};
