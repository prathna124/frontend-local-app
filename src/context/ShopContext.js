import React, { createContext, useContext, useState } from "react";

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  /* ================= MOCK SHOPS (FOR EXPO TESTING) ================= */
  const [shops, setShops] = useState([
    {
      id: 1,
      name: "Apna Grocery",
      categories: "Grocery, Dairy",
      city: "Ahmedabad",
      status: "active",
      verified: true,
      isActiveShop: true,
    },
    {
      id: 2,
      name: "Fresh Milk Center",
      categories: "Dairy",
      city: "Surat",
      status: "inactive",
      verified: false,
      isActiveShop: false,
    },
  ]);

  const [activeShop, setActiveShop] = useState(shops[0]);

  /* ================= ADD ================= */
  const addShop = (shop) => {
    setShops((prev) => [...prev, shop]);
    if (!activeShop) setActiveShop(shop);
  };

  /* ================= UPDATE ================= */
  const updateShop = (updatedShop) => {
    setShops((prev) =>
      prev.map((shop) =>
        shop.id === updatedShop.id ? updatedShop : shop
      )
    );

    if (activeShop?.id === updatedShop.id) {
      setActiveShop(updatedShop);
    }
  };

  /* ================= DELETE ================= */
  const deleteShop = (shopId) => {
    setShops((prev) => prev.filter((shop) => shop.id !== shopId));

    if (activeShop?.id === shopId) {
      setActiveShop(null);
    }
  };

  /* ================= SET ACTIVE (individual toggle, no effect on other shops) ================= */
  const setActiveShopById = (idOrShop) => {
    const shopId = typeof idOrShop === "object" ? idOrShop?.id : idOrShop;
    const shopToSet =
      typeof idOrShop === "object" ? idOrShop : shops.find((s) => s.id === shopId);

    setShops((prev) =>
      prev.map((shop) =>
        shop.id === shopId ? { ...shop, isActiveShop: true, status: "active" } : shop
      )
    );
    if (shopToSet) setActiveShop({ ...shopToSet, isActiveShop: true, status: "active" });
  };

  /* ================= SET INACTIVE ================= */
  const setInactiveShopById = (idOrShop) => {
    const shopId = typeof idOrShop === "object" ? idOrShop?.id : idOrShop;

    setShops((prev) =>
      prev.map((shop) => ({
        ...shop,
        isActiveShop: shop.id === shopId ? false : shop.isActiveShop,
        status: shop.id === shopId ? "inactive" : shop.status,
      }))
    );
    if (activeShop?.id === shopId) {
      setActiveShop(null);
    }
  };

  return (
    <ShopContext.Provider
      value={{
        shops,
        activeShop,
        addShop,
        updateShop,
        deleteShop,
        setActiveShop: setActiveShopById,
        setInactiveShop: setInactiveShopById,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
