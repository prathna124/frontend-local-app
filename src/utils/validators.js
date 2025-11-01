// src/utils/validators.js

// ✅ Email Validation (RFC + required)
export const validateEmail = (email) => {
  if (!email || !email.trim()) return "Email is required";
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return re.test(email.trim().toLowerCase()) ? "" : "Invalid email format";
};

// ✅ Password Validation (max 255 chars, required)
export const validatePassword = (password) => {
  if (!password || !password.trim()) return "Password is required";
  if (password.length > 255)
    return "Password cannot exceed 255 characters";
  return "";
};

// ✅ First Name Validation (min 1, max 50)
export const validateName = (name) => {
  if (!name || !name.trim()) return "First name is required";
  if (name.trim().length < 1 || name.trim().length > 50)
    return "First name must be between 1 and 50 characters";
  return "";
};

// ✅ Last Name Validation (min 1, max 50)
export const validateLastName = (lastname) => {
  if (!lastname || !lastname.trim()) return "Last name is required";
  if (lastname.trim().length < 1 || lastname.trim().length > 50)
    return "Last name must be between 1 and 50 characters";
  return "";
};

// ✅ Phone Number Validation (exact 10 digits)
export const validatePhone = (phone) => {
  if (!phone || !phone.trim()) return "Phone number is required";
  const re = /^[0-9]{10}$/;
  return re.test(phone) ? "" : "Phone number must be exactly 10 digits";
};

// ✅ Shop Name Validation (similar to business-friendly)
export const validateShopName = (shopName) => {
  if (!shopName || !shopName.trim()) return "Shop name is required";
  if (shopName.trim().length < 3)
    return "Shop name must be at least 3 characters long";
  const re = /^[a-zA-Z0-9\s&-]+$/;
  return re.test(shopName)
    ? ""
    : "Shop name can only contain letters, numbers, spaces, &, and -";
};

// ✅ Address Type Validation (enum: home, work, other)
export const validateAddressType = (type) => {
  if (!type) return "Address type is required";
  const validTypes = ["home", "work", "other"];
  return validTypes.includes(type.toLowerCase())
    ? ""
    : "Address type must be home, work, or other";
};

// ✅ Street Address Validation (max 255)
export const validateAddress = (address) => {
  if (!address || !address.trim()) return "Street address is required";
  if (address.trim().length > 255)
    return "Street address cannot exceed 255 characters";
  return "";
};

// ✅ City Validation (max 100)
export const validateCity = (city) => {
  if (!city || !city.trim()) return "City is required";
  if (city.trim().length > 100) return "City cannot exceed 100 characters";
  return "";
};

// ✅ State Validation (max 100)
export const validateState = (state) => {
  if (!state || !state.trim()) return "State is required";
  if (state.trim().length > 100) return "State cannot exceed 100 characters";
  return "";
};

// ✅ Postal Code Validation (pattern /^[A-Za-z0-9 -]{3,15}$/)
export const validatePostalCode = (postalCode) => {
  if (!postalCode || !postalCode.trim()) return "Postal code is required";
  const re = /^[A-Za-z0-9 -]{3,15}$/;
  return re.test(postalCode.trim())
    ? ""
    : "Postal code must be 3–15 characters (letters, numbers, spaces, or -)";
};

// ✅ Country Validation (max 100)
export const validateCountry = (country) => {
  if (!country || !country.trim()) return "Country is required";
  if (country.trim().length > 100)
    return "Country cannot exceed 100 characters";
  return "";
};

// ✅ Date of Birth Validation (date < now)
export const validateDOB = (dob) => {
  if (!dob) return "Date of birth is required";
  const date = new Date(dob);
  if (isNaN(date.getTime())) return "Invalid date format";
  if (date >= new Date()) return "Date of birth must be before today";
  return "";
};
