document.querySelectorAll(".toggle").forEach((button) => {
  button.addEventListener("click", () => {
    let content = button.nextElementSibling;
    content.style.display =
      content.style.display === "none" || content.style.display === ""
        ? "block"
        : "none";
    button.classList.toggle("active"); // Optional: add visual indication of active state
  });
});

function addPendulum() {
  let container = document.getElementById("pendulumContainer");
  let newRow = document.createElement("tr");

  newRow.innerHTML = `
        <td><input type="number" min="0" max="1000"></td>
        <td><input type="number" min="0" max="1000"></td>
        <td><input type="range" min="0" max="1" step="0.01"></td>
        <td><input type="range" min="0" max="1" step="0.01"></td>
        <td><button onclick="removeEntry(this)">Remove</button></td>
    `;

  container.appendChild(newRow);
}

function removeEntry(button) {
  button.parentElement.parentElement.remove();
}

function addEntry(containerId, type) {
  let container = document.getElementById(containerId);
  let newEntry = document.createElement("div");
  newEntry.className = "form-group";
  newEntry.innerHTML = `
        <label>${type} Step:</label>
        <input type="number" min="0">
        <label>${type} Value:</label>
        <input type="text">
        <button onclick="removeEntry(this)">Remove</button>
    `;
  container.appendChild(newEntry);
}

function removeEntry(button) {
  button.parentElement.remove();
}
