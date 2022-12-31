export function Alert(message) {
  const p = document.createElement("p");
  p.innerText = message;
  return p;
}
