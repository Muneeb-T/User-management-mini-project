$(document).ready(function () {
  $("#adminLoginForm").validate({
    errorClass: "validation-error",
    rules: {
      adminName: {
        required: true,
      },
      password: {
        required: true,
        minlength: 8,
      },
    },
    messages: {
      adminName: {
        required: "Enter admin name",
      },
      password: {
        required: "Enter valid password",
        minlength: "Password must contain 8 characters",
      },
    },
  });

  $("#addUserForm").validate({
    errorClass: "validation-error",
    rules: {
      // simple rule, converted to {required:true}
      firstName: "required",
      lastName: "required",
      username: {
        required: true,
      },
      emailAddress: {
        required: true,
        email: true,
      },
      password: {
        required: true,
        minlength: 8,
      },
      confirmPassword: {
        required: true,
        equalTo: "#password",
      },
    },
    messages: {
      firstName: "Enter first name",
      lastName: "Enter last name",
      username: "Enter username",
      emailAddress: {
        required: "Enter email address",
        email: "Enter valid email address",
      },
      password: {
        required: "Enter password",
        minlength: "Password must contain 8 characters",
      },
      confirmPassword: {
        required: "Confirm your password",
        equalTo: "Enter same password again",
      },
    },
  });

  $("#editUserForm").validate({
    errorClass: "validation-error",
    rules: {
      firstName: "required",
      lastName: "required",
      username: {
        required: true,
      },
      emailAddress: {
        required: true,
        email: true,
      },
      password: {
        required: true,
        minlength: 8,
      },
    },
    messages: {
      firstName: "Enter first name",
      lastName: "Enter last name",
      username: "Enter username",
      emailAddress: {
        required: "Enter email address",
        email: "Enter valid email address",
      },
      password: {
        required: "Enter password",
        minlength: "Password must contain 8 characters",
      },
    },
    errorPlacement: function (error, element) {
      if (element.parent().hasClass("input-group")) {
        error.insertAfter(element.parent());
      } else {
        error.insertAfter(element);
      }
    },
  });
});
