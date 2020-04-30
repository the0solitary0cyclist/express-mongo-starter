function logout() {
  $( "#logout" ).click( ( event ) => {
    event.preventDefault();
    localStorage.clear();
    window.location.href = "/";
  } );
}

function handleLogout() {
  logout();
}

$( handleLogout );
