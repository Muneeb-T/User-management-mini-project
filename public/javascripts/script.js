$(document).ready(function () {
  $("#usersTable").DataTable();
});

document
  .querySelector("#editPasswordInputGroup button")
  .addEventListener("click", (event) => {
    event.preventDefault();
    let input = document.querySelector("#editPasswordInputGroup input");
    let button = document.querySelector("#editPasswordInputGroup button");

    if (input.disabled) {
      input.disabled = false;
      button.innerHTML = "Cancel";
    } else {
      input.disabled = true;
      button.innerHTML = "Edit";
    }
  });
