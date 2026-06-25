
export const UpdateCart = (state) => {
    localStorage.setItem("cart", JSON.stringify(state));
  };