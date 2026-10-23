// Builds the URL that clients should use for a file under /uploads.
// When PUBLIC_URL is set (e.g. https://api-carshowroom.khantmaung.com) the
// URL is absolute, so stored image links never point at localhost or an
// internal Docker host name. Without it, a root-relative path is returned
// and the frontend resolves it against VITE_API_URL's origin.
const publicBaseUrl = () =>
  (process.env.PUBLIC_URL || "").trim().replace(/\/+$/, "");

const toPublicUrl = (relativePath) => {
  const p = relativePath.startsWith("/") ? relativePath : `/${relativePath}`;
  const base = publicBaseUrl();
  return base ? `${base}${p}` : p;
};

module.exports = { publicBaseUrl, toPublicUrl };
