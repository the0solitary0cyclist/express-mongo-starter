function handleCurrentUserData(data) {
  // this is the page where you can update your email or password
  $('#current-user-email').append(`<div>${data.email}</div>`)
}

function fetchCurrentUser() {
  console.log('profile clicked');
  fetch('/api/auth/currentUser', {
      method: "Get",
      headers: {
          "Content-Type": "application/json",
          authorization: "bearer " + localStorage.authToken
      }
  })
      .then(response => response.json())
      .then(data => handleCurrentUserData(data))
}

function handleProfile() {
  fetchCurrentUser();
}

$(handleProfile);