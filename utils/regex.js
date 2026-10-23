// Escape user input before embedding it in a RegExp (avoids 500s on
// characters like "(" and regex-based DoS).
const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Case-insensitive exact match, e.g. for brand names.
const exactInsensitive = (value) => new RegExp(`^${escapeRegex(value)}$`, "i");

module.exports = { escapeRegex, exactInsensitive };
