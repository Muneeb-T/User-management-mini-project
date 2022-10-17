$(document).ready(function () {
  $("#userSignUpForm").validate({
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

  $("#userLoginForm").validate({
    errorClass: "validation-error",
    rules: {
      // simple rule, converted to {required:true}
      emailAddressOrUsername: {
        required: true,
      },
      password: {
        required: true,
        minlength: 8,
      },
    },
    messages: {
      emailAddressOrUsername: {
        required: "Enter username or email address",
      },
      password: {
        required: "Enter valid password",
        minlength: "Password must contain 8 characters",
      },
    },
  });
});
