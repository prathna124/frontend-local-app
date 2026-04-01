// src/utils/validators.js

/** Matches backend shopKeeperSchema email .pattern + .email (typos like gmai. rejected) */
const SHOPKEEPER_EMAIL_PATTERN =
  /^[a-zA-Z0-9._%+-]+@(?!gmai\.|gmil\.|gmal\.|gnail\.|gmaill\.)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/** Password must contain letter, digit, and one of @$!%*#?& (shopKeeperSchema) */
const SHOPKEEPER_PASSWORD_RULE =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])/;

// ✅ Email Validation (shopKeeperSchema: trim, lowercase, pattern)
export const validateEmail = (email) => {
  if (!email || !String(email).trim()) return "Email is required";
  const value = String(email).trim().toLowerCase();
  if (!SHOPKEEPER_EMAIL_PATTERN.test(value))
    return "Enter a valid email address";
  return "";
};

// ✅ Password Validation (shopKeeperSchema: min 8, max 50, complexity)
export const validatePassword = (password) => {
  if (password == null || password === "" || !String(password).trim())
    return "Password is required";
  const p = String(password);
  if (p.length < 8) return "Password must be at least 8 characters";
  if (p.length > 50) return "Password cannot exceed 50 characters";
  if (!SHOPKEEPER_PASSWORD_RULE.test(p))
    return "Password must include a letter, a number, and a symbol (@$!%*#?&)";
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

// ✅ Phone Number Validation (shopKeeperSchema: length 10, digits only)
export const validatePhone = (phone) => {
  if (!phone || !String(phone).trim()) return "Phone number is required";
  const value = String(phone).trim();
  if (value.length !== 10 || !/^[0-9]+$/.test(value))
    return "Phone number must be exactly 10 digits";
  return "";
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

/**
 * shopKeeperSchema (Joi): abortEarly: false, allowUnknown: false
 * Fields: first_name, last_name, email, phone_number, password_hash, confirm_password, user_type
 */
export const validateShopKeeperSignupForm = (data) => {
  const errors = {};

  const firstName = trim(data.first_name ?? data.name ?? "");
  if (!firstName) {
    errors.name = "First name is required";
  } else if (firstName.length > 50) {
    errors.name = "First name cannot exceed 50 characters";
  }

  const lastName = trim(data.last_name ?? data.lastname ?? "");
  if (!lastName) {
    errors.lastname = "Last name is required";
  } else if (lastName.length > 50) {
    errors.lastname = "Last name cannot exceed 50 characters";
  }

  const emailErr = validateEmail(data.email ?? "");
  if (emailErr) errors.email = emailErr;

  const phoneErr = validatePhone(data.phone_number ?? data.phone ?? "");
  if (phoneErr) errors.phone = phoneErr;

  const pwd = data.password_hash ?? data.password ?? "";
  const passwordErr = validatePassword(pwd);
  if (passwordErr) errors.password = passwordErr;

  const confirm = data.confirm_password ?? data.confirm ?? "";
  if (!confirm || !String(confirm).trim()) {
    errors.confirm = "Confirm password is required";
  } else if (String(confirm) !== String(pwd)) {
    errors.confirm = "Passwords must match";
  }

  const userType = data.user_type ?? "";
  const allowed = ["customer", "shop_owner", "guest"];
  if (!userType) {
    errors.user_type = "User type is required";
  } else if (!allowed.includes(userType)) {
    errors.user_type = "Invalid user type";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// ============================================================
// SHOP FORM VALIDATION (all fields required except description)
// Collects all errors (abortEarly: false style)
// ============================================================

/** Trim helper - matches Joi .trim() */
const trim = (s) => (s == null || typeof s !== "string" ? "" : s.trim());

const hasAddressProof = (value) => {
  if (value == null) return false;
  if (typeof value === "string") return trim(value).length > 0;
  if (typeof value === "object" && value.uri != null)
    return String(value.uri).trim().length > 0;
  return false;
};

/**
 * Validates shop form data. Description optional; all other inputs required.
 * Returns { isValid: boolean, errors: { fieldKey: message } }
 */
export const validateCreateShopForm = (formData) => {
  const errors = {};

  const shopName = trim(formData.shop_name ?? formData.shopName ?? "");
  if (!shopName) {
    errors.shop_name = "Shop name is required";
  } else if (shopName.length < 3) {
    errors.shop_name = "Shop name must be at least 3 characters";
  } else if (shopName.length > 255) {
    errors.shop_name = "Shop name cannot exceed 255 characters";
  }

  const brn = trim(formData.business_registration_number ?? "");
  if (!brn) {
    errors.business_registration_number =
      "Business registration number is required";
  } else if (brn.length > 100) {
    errors.business_registration_number =
      "Business registration number cannot exceed 100 characters";
  }

  const taxId = trim(formData.tax_id ?? "");
  if (!taxId) {
    errors.tax_id = "GST / Tax ID is required";
  } else if (taxId.length > 100) {
    errors.tax_id = "Tax ID cannot exceed 100 characters";
  }

  const bankDetails = trim(formData.bank_account_details ?? "");
  if (!bankDetails) {
    errors.bank_account_details = "Bank account details are required";
  } else if (bankDetails.length > 255) {
    errors.bank_account_details =
      "Bank account details cannot exceed 255 characters";
  }

  if (!hasAddressProof(formData.address_proof)) {
    errors.address_proof = "Address proof is required";
  } else if (typeof formData.address_proof === "string") {
    const ap = trim(formData.address_proof);
    if (ap.length > 255) {
      errors.address_proof = "Address proof URL cannot exceed 255 characters";
    }
  }

  const description = trim(formData.description ?? "");
  if (description.length > 500) {
    errors.description = "Description cannot exceed 500 characters";
  }

  const categories = formData.categories;
  if (!Array.isArray(categories) || categories.length === 0) {
    errors.categories = "Select at least one category";
  }

  const logoUrl = formData.logo_url ?? "";
  if (typeof logoUrl === "string" && logoUrl.length > 255) {
    errors.logo_url = "Logo URL cannot exceed 255 characters";
  }

  const bannerUrl = formData.banner_url ?? "";
  if (typeof bannerUrl === "string" && bannerUrl.length > 255) {
    errors.banner_url = "Banner URL cannot exceed 255 characters";
  }

  const streetAddress = trim(formData.street_address ?? "");
  if (!streetAddress) {
    errors.street_address = "Shop address is required";
  } else if (streetAddress.length > 255) {
    errors.street_address = "Street address cannot exceed 255 characters";
  }

  const city = trim(formData.city ?? "");
  if (!city) {
    errors.city = "City is required";
  } else if (city.length > 50) {
    errors.city = "City cannot exceed 50 characters";
  }

  const state = trim(formData.state ?? "");
  if (!state) {
    errors.state = "State is required";
  } else if (state.length > 50) {
    errors.state = "State cannot exceed 50 characters";
  }

  const postalCode = trim(formData.postal_code ?? "");
  if (!postalCode) {
    errors.postal_code = "Postal code is required";
  } else if (postalCode.length > 50) {
    errors.postal_code = "Postal code cannot exceed 50 characters";
  }

  const country = trim(formData.country ?? "");
  if (!country) {
    errors.country = "Country is required";
  } else if (country.length > 50) {
    errors.country = "Country cannot exceed 50 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// ============================================================
// PRODUCT FORM VALIDATION (matches DB: products table)
// ============================================================

export const validateProductForm = (formData) => {
  const errors = {};

  const shopId = formData.shop_id ?? formData.shopId;
  if (shopId == null || shopId === "" || !Number.isFinite(Number(shopId))) {
    errors.shop_id = "Select a shop";
  }

  const name = trim(formData.name ?? "");
  if (!name) {
    errors.name = "Product name is required";
  } else if (name.length > 255) {
    errors.name = "Product name cannot exceed 255 characters";
  }

  const basePrice = parseFloat(formData.base_price ?? formData.basePrice ?? 0);
  if (isNaN(basePrice) || basePrice < 0) {
    errors.base_price = "Valid base price is required";
  }

  const discountPrice = parseFloat(formData.discount_price ?? formData.discountPrice ?? 0);
  if (!isNaN(discountPrice) && discountPrice < 0) {
    errors.discount_price = "Discount price cannot be negative";
  }
  if (!isNaN(discountPrice) && discountPrice > basePrice) {
    errors.discount_price = "Discount price cannot exceed base price";
  }

  const qty = parseInt(formData.quantity_available ?? formData.quantityAvailable ?? 0, 10);
  if (isNaN(qty) || qty < 0) {
    errors.quantity_available = "Stock quantity must be 0 or more";
  }

  const sku = trim(formData.sku ?? "");
  if (sku.length > 100) {
    errors.sku = "SKU cannot exceed 100 characters";
  }

  const categoryIds = formData.category_ids ?? formData.categoryIds ?? [];
  if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
    errors.category_ids = "Select at least one category";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
