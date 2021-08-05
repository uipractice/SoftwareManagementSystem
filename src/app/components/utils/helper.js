export const getApiUrl = (str) => {
  return `${process.env.REACT_APP_NODE_HOST}/${str}`;
};
