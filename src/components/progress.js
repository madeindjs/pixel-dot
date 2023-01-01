export function Progress() {
  const progress = document.createElement("progress");
  progress.setAttribute("max", "100");

  const status = document.createElement("label");

  const div = document.createElement("div");

  div.append(progress);
  div.append(status);

  /**
   * @param {number} value
   * @param {string} message
   */
  const update = (value, message) => {
    progress.setAttribute("value", String(value));
    status.innerText = message;
  };

  return { element: div, update };
}
