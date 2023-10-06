let userform = document.querySelector(".user_form");

const sendForm = async (e) => {
  e.preventDefault();
  let userinfo = Object.fromEntries(new FormData(userform));
  let response = await fetch(`/users/${e.target.id}`, {
    method: "POST",
    body: JSON.stringify(userinfo),
    headers: { "Content-type": "application/json; charset=UTF-8" },
    credentials: "include",
  })
  let message = await response.json();
  if (message?.data) {
    userform.reset();
    alert("Redireccionando");
    setTimeout(() => window.location.href = "/productos", 100);
  } else {
    alert(message.error);
  }
};

userform.addEventListener("submit", sendForm);